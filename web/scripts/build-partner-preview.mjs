/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import { execFileSync } from 'node:child_process'
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repository = fileURLToPath(new URL('../..', import.meta.url))
const destination = process.argv[2] && path.resolve(process.argv[2])
const source = new URL(process.argv[3] || 'http://localhost:3000')
if (!destination || !['http:', 'https:'].includes(source.protocol)) {
  throw new Error(
    'Usage: node scripts/build-partner-preview.mjs SITE_DIRECTORY [PUBLIC_SOURCE_URL]'
  )
}
const manifestPath = path.join(destination, '.openai/hosting.json')
let manifest = null
try {
  manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
} catch (error) {
  if (error.code !== 'ENOENT') throw error
}
if (manifest && !manifest.project_id) {
  throw new Error('Create the preview Site before building')
}

async function readPublicEndpoint(endpoint) {
  const response = await fetch(new URL(endpoint, source), {
    credentials: 'omit',
    signal: AbortSignal.timeout(20000),
  })
  if (!response.ok) {
    throw new Error(`Preview snapshot failed: ${endpoint} (${response.status})`)
  }
  const value = await response.json()
  if (value.success !== true) {
    throw new Error(`Preview snapshot failed: ${endpoint}`)
  }
  return value
}

const publicPaths = [
  '/api/status',
  '/api/setup',
  '/api/pricing',
  '/api/about',
  '/api/user-agreement',
  '/api/privacy-policy',
  '/api/notice',
]
const publicData = new Map(
  await Promise.all(
    publicPaths.map(async (endpoint) => [
      endpoint,
      await readPublicEndpoint(endpoint),
    ])
  )
)
publicData.set('/api/home_page_content', {
  success: true,
  data: await readFile(
    path.join(repository, 'branding/home-openrouter.html'),
    'utf8'
  ),
})
const periods = ['today', 'week', 'month', 'year']
const rankings = await Promise.all(
  periods.map(async (period) => [
    period,
    await readPublicEndpoint(`/api/rankings?period=${period}`),
  ])
)

// Only public branding and display configuration are distributed. The preview
// has no credentials, account records, write APIs, or upstream relay backend.
const statusKeys = [
  'system_name',
  'logo',
  'footer_html',
  'theme',
  'version',
  'HeaderNavModules',
  'default_collapse_sidebar',
  'quota_display_type',
  'display_in_currency',
  'quota_per_unit',
  'usd_exchange_rate',
  'custom_currency_symbol',
  'custom_currency_exchange_rate',
  'price',
  'user_agreement_enabled',
  'privacy_policy_enabled',
  'self_use_mode_enabled',
  'enable_drawing',
  'enable_task',
]
const status = publicData.get('/api/status')
status.data = Object.fromEntries(
  statusKeys
    .filter((key) => key in status.data)
    .map((key) => [key, status.data[key]])
)
Object.assign(status.data, {
  setup: true,
  register_enabled: false,
  password_register_enabled: false,
  password_login_enabled: false,
  github_oauth: false,
  discord_oauth: false,
  linuxdo_oauth: false,
  telegram_oauth: false,
  telegram_oauth_configured: false,
  wechat_login: false,
  passkey_login: false,
  oidc_enabled: false,
  turnstile_check: false,
  announcements_enabled: false,
  api_info_enabled: false,
  faq_enabled: false,
})

const output = path.join(destination, 'dist')
await readFile(path.join(repository, 'web/dist/index.html'), 'utf8')
await rm(output, { recursive: true, force: true })
await cp(path.join(repository, 'web/dist'), output, { recursive: true })
for (const [endpoint, data] of publicData) {
  const filename = path.join(output, endpoint.slice(1))
  await mkdir(path.dirname(filename), { recursive: true })
  await writeFile(filename, JSON.stringify(data))
}
await mkdir(path.join(output, 'preview-data'), { recursive: true })
for (const [period, data] of rankings) {
  await writeFile(
    path.join(output, `preview-data/rankings-${period}.json`),
    JSON.stringify(data)
  )
}
await writeFile(
  path.join(output, 'api/_unavailable'),
  JSON.stringify({ success: false, message: 'Forbidden' })
)
await writeFile(
  path.join(output, 'api/rankings'),
  JSON.stringify(rankings[0][1])
)

// Preserve each period's real public response while serving a static preview.
const bootstrap = `(() => {
  const endpoints = new Set(${JSON.stringify([...publicData.keys()])});
  const periods = new Set(${JSON.stringify(periods)});
  const open = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, target, ...args) {
    let url = new URL(target, location.href);
    if (method.toUpperCase() === 'GET' && url.origin === location.origin && url.pathname.startsWith('/api/')) {
      if (url.pathname === '/api/rankings') {
        const period = url.searchParams.get('period');
        url = new URL('/preview-data/rankings-' + (periods.has(period) ? period : 'today') + '.json', location.origin);
      } else if (!endpoints.has(url.pathname)) {
        url = new URL('/api/_unavailable', location.origin);
      }
    }
    return open.call(this, method, url.href, ...args);
  };
})();`
await writeFile(path.join(output, 'partner-preview.js'), bootstrap)
const index = path.join(output, 'index.html')
const html = await readFile(index, 'utf8')
await writeFile(
  index,
  html.replace(
    '<head>',
    '<head><meta name="app-preview" content="read-only"><script src="/partner-preview.js"></script>'
  )
)
for (const filename of ['LICENSE', 'NOTICE', 'THIRD-PARTY-LICENSES.md']) {
  await cp(path.join(repository, filename), path.join(output, filename))
}
await writeFile(
  path.join(output, '_headers'),
  '/api/*\n  Content-Type: application/json; charset=utf-8\n  Cache-Control: no-store\n'
)
if (manifest) {
  manifest.static = {
    ...manifest.static,
    directory: 'dist',
    not_found_handling: 'single-page-application',
  }
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
}
const commit = execFileSync('git', ['rev-parse', 'HEAD'], {
  cwd: repository,
  encoding: 'utf8',
}).trim()
await writeFile(
  path.join(destination, 'source-info.json'),
  `${JSON.stringify(
    {
      repository: 'https://github.com/JerryHome000/new-api',
      branch: 'feat/omni-branding',
      commit,
      captured_at: new Date().toISOString(),
      purpose: 'Read-only partner preview of public pages',
    },
    null,
    2
  )}\n`
)
console.log(
  JSON.stringify({
    output,
    model_count: publicData.get('/api/pricing').data.length,
    public_endpoints: publicData.size,
  })
)
