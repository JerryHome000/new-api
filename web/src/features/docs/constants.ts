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
import type { DocsPage, DocsSection } from './types'

/**
 * Models used in the copy-ready snippets. Pages refer to them through
 * {{CLAUDE_MODEL}} / {{GPT_MODEL}} so a model change is a one-line edit.
 */
export const DOCS_DEFAULT_MODELS = {
  claude: 'claude-opus-5-5',
  gpt: 'gpt-6.1-sol',
} as const

/** Provider id prefix used in tool configs when the site name has no ASCII. */
export const DOCS_FALLBACK_PROVIDER_ID = 'omni'

/**
 * Documentation tree. Titles here are page content (the docs are written in
 * Chinese), not interface chrome, so they are not passed through t().
 * Each page loads its Markdown lazily from `content/<slug>.md`.
 */
export const DOCS_SECTIONS: DocsSection[] = [
  {
    id: 'guide',
    title: '快速入门',
    description: '了解服务、注册账号、创建 Key，以及计费与充值规则。',
    groups: [
      {
        pages: [
          {
            slug: 'guide',
            title: '中转站介绍',
            load: () => import('./content/guide/index.md?raw'),
          },
          {
            slug: 'guide/account',
            title: '注册并创建 Key',
            load: () => import('./content/guide/account.md?raw'),
          },
          {
            slug: 'guide/pricing',
            title: '分组与计价',
            load: () => import('./content/guide/pricing.md?raw'),
          },
          {
            slug: 'guide/recharge',
            title: '充值与退款',
            load: () => import('./content/guide/recharge.md?raw'),
          },
        ],
      },
    ],
  },
  {
    id: 'tools',
    title: '工具部署',
    description:
      '把 Codex、Claude Code、OpenClaw 等工具接入进来，按系统一步步配置。',
    groups: [
      {
        title: '开始之前',
        pages: [
          {
            slug: 'tools',
            title: '工具概览',
            load: () => import('./content/tools/index.md?raw'),
          },
          {
            slug: 'tools/nodejs',
            title: 'Node.js 安装',
            load: () => import('./content/tools/nodejs/index.md?raw'),
          },
          {
            slug: 'tools/nodejs/windows',
            title: 'Node.js · Windows',
            load: () => import('./content/tools/nodejs/windows.md?raw'),
          },
          {
            slug: 'tools/nodejs/macos',
            title: 'Node.js · macOS',
            load: () => import('./content/tools/nodejs/macos.md?raw'),
          },
          {
            slug: 'tools/nodejs/linux',
            title: 'Node.js · Linux',
            load: () => import('./content/tools/nodejs/linux.md?raw'),
          },
        ],
      },
      {
        title: 'Codex',
        pages: [
          {
            slug: 'tools/codex',
            title: 'Codex 概览',
            load: () => import('./content/tools/codex/index.md?raw'),
          },
          {
            slug: 'tools/codex/one-click',
            title: '一键配置安装',
            load: () => import('./content/tools/codex/one-click.md?raw'),
          },
          {
            slug: 'tools/codex/chatgpt-desktop',
            title: 'ChatGPT 桌面版',
            load: () => import('./content/tools/codex/chatgpt-desktop.md?raw'),
          },
          {
            slug: 'tools/codex/windows',
            title: 'Windows',
            load: () => import('./content/tools/codex/windows.md?raw'),
          },
          {
            slug: 'tools/codex/macos',
            title: 'macOS',
            load: () => import('./content/tools/codex/macos.md?raw'),
          },
          {
            slug: 'tools/codex/linux',
            title: 'Linux',
            load: () => import('./content/tools/codex/linux.md?raw'),
          },
        ],
      },
      {
        title: 'Claude Code',
        pages: [
          {
            slug: 'tools/claude-code',
            title: 'Claude Code 概览',
            load: () => import('./content/tools/claude-code/index.md?raw'),
          },
          {
            slug: 'tools/claude-code/one-click',
            title: '一键配置安装',
            load: () => import('./content/tools/claude-code/one-click.md?raw'),
          },
          {
            slug: 'tools/claude-code/windows',
            title: 'Windows',
            load: () => import('./content/tools/claude-code/windows.md?raw'),
          },
          {
            slug: 'tools/claude-code/macos',
            title: 'macOS',
            load: () => import('./content/tools/claude-code/macos.md?raw'),
          },
          {
            slug: 'tools/claude-code/linux',
            title: 'Linux',
            load: () => import('./content/tools/claude-code/linux.md?raw'),
          },
        ],
      },
      {
        title: 'OpenClaw',
        pages: [
          {
            slug: 'tools/openclaw',
            title: 'OpenClaw 概览',
            load: () => import('./content/tools/openclaw/index.md?raw'),
          },
          {
            slug: 'tools/openclaw/one-click',
            title: '一键配置安装',
            load: () => import('./content/tools/openclaw/one-click.md?raw'),
          },
          {
            slug: 'tools/openclaw/tencent-cloud-json',
            title: '腾讯云 JSON 配置',
            load: () =>
              import('./content/tools/openclaw/tencent-cloud-json.md?raw'),
          },
          {
            slug: 'tools/openclaw/windows',
            title: 'Windows',
            load: () => import('./content/tools/openclaw/windows.md?raw'),
          },
          {
            slug: 'tools/openclaw/macos',
            title: 'macOS',
            load: () => import('./content/tools/openclaw/macos.md?raw'),
          },
          {
            slug: 'tools/openclaw/linux',
            title: 'Linux',
            load: () => import('./content/tools/openclaw/linux.md?raw'),
          },
        ],
      },
      {
        title: 'Hermes Agent',
        pages: [
          {
            slug: 'tools/hermes-agent',
            title: 'Hermes Agent 概览',
            load: () => import('./content/tools/hermes-agent/index.md?raw'),
          },
          {
            slug: 'tools/hermes-agent/one-click',
            title: '一键配置安装',
            load: () => import('./content/tools/hermes-agent/one-click.md?raw'),
          },
          {
            slug: 'tools/hermes-agent/windows',
            title: 'Windows',
            load: () => import('./content/tools/hermes-agent/windows.md?raw'),
          },
          {
            slug: 'tools/hermes-agent/macos',
            title: 'macOS',
            load: () => import('./content/tools/hermes-agent/macos.md?raw'),
          },
          {
            slug: 'tools/hermes-agent/linux',
            title: 'Linux / WSL2',
            load: () => import('./content/tools/hermes-agent/linux.md?raw'),
          },
        ],
      },
      {
        title: 'OpenCode',
        pages: [
          {
            slug: 'tools/opencode',
            title: 'OpenCode 概览',
            load: () => import('./content/tools/opencode/index.md?raw'),
          },
          {
            slug: 'tools/opencode/one-click',
            title: '一键配置安装',
            load: () => import('./content/tools/opencode/one-click.md?raw'),
          },
          {
            slug: 'tools/opencode/windows',
            title: 'Windows',
            load: () => import('./content/tools/opencode/windows.md?raw'),
          },
          {
            slug: 'tools/opencode/macos',
            title: 'macOS',
            load: () => import('./content/tools/opencode/macos.md?raw'),
          },
          {
            slug: 'tools/opencode/linux',
            title: 'Linux',
            load: () => import('./content/tools/opencode/linux.md?raw'),
          },
        ],
      },
      {
        title: 'Pi',
        pages: [
          {
            slug: 'tools/pi',
            title: 'Pi 概览',
            load: () => import('./content/tools/pi/index.md?raw'),
          },
          {
            slug: 'tools/pi/one-click',
            title: '一键配置安装',
            load: () => import('./content/tools/pi/one-click.md?raw'),
          },
        ],
      },
      {
        title: '配置工具',
        pages: [
          {
            slug: 'tools/cc-switch',
            title: 'CC-Switch 概览',
            load: () => import('./content/tools/cc-switch/index.md?raw'),
          },
          {
            slug: 'tools/cc-switch/windows',
            title: 'CC-Switch · Windows',
            load: () => import('./content/tools/cc-switch/windows.md?raw'),
          },
          {
            slug: 'tools/cc-switch/macos',
            title: 'CC-Switch · macOS',
            load: () => import('./content/tools/cc-switch/macos.md?raw'),
          },
          {
            slug: 'tools/cc-switch/linux',
            title: 'CC-Switch · Linux',
            load: () => import('./content/tools/cc-switch/linux.md?raw'),
          },
        ],
      },
    ],
  },
  {
    id: 'api',
    title: 'API 文档',
    description: 'OpenAI 与 Anthropic 格式的文本接口，以及图片、视频生成接口。',
    groups: [
      {
        pages: [
          {
            slug: 'api',
            title: 'API 概览',
            load: () => import('./content/api/index.md?raw'),
          },
        ],
      },
      {
        title: '文本生成',
        pages: [
          {
            slug: 'api/openai',
            title: 'OpenAI 格式',
            load: () => import('./content/api/openai.md?raw'),
          },
          {
            slug: 'api/anthropic',
            title: 'Anthropic 格式',
            load: () => import('./content/api/anthropic.md?raw'),
          },
        ],
      },
      {
        title: '图片生成',
        pages: [
          {
            slug: 'api/gpt-image-2',
            title: 'GPT Image',
            load: () => import('./content/api/gpt-image-2.md?raw'),
          },
          {
            slug: 'api/gemini-image',
            title: 'Gemini 图片',
            load: () => import('./content/api/gemini-image.md?raw'),
          },
        ],
      },
      {
        title: '视频生成',
        pages: [
          {
            slug: 'api/veo-video',
            title: 'Veo 视频',
            load: () => import('./content/api/veo-video.md?raw'),
          },
          {
            slug: 'api/seedance-video',
            title: 'Seedance 视频',
            load: () => import('./content/api/seedance-video.md?raw'),
          },
        ],
      },
    ],
  },
  {
    id: 'help',
    title: '帮助中心',
    description: '常见问题、故障排查、联系支持，以及使用政策与服务条款。',
    groups: [
      {
        pages: [
          {
            slug: 'help',
            title: '帮助首页',
            load: () => import('./content/help/index.md?raw'),
          },
          {
            slug: 'help/faq',
            title: '常见问题',
            load: () => import('./content/help/faq.md?raw'),
          },
          {
            slug: 'help/troubleshooting',
            title: '疑难杂症',
            load: () => import('./content/help/troubleshooting.md?raw'),
          },
          {
            slug: 'help/support',
            title: '获取支持',
            load: () => import('./content/help/support.md?raw'),
          },
        ],
      },
      {
        title: '政策条款',
        pages: [
          {
            slug: 'help/usage-policy',
            title: '使用政策',
            load: () => import('./content/help/usage-policy.md?raw'),
          },
          {
            slug: 'help/terms',
            title: '服务条款',
            load: () => import('./content/help/terms.md?raw'),
          },
        ],
      },
    ],
  },
]

/** Introduction rendered under the docs home hero; not part of the tree. */
export const DOCS_HOME_PAGE: DocsPage = {
  slug: '',
  title: '',
  load: () => import('./content/index.md?raw'),
}

/** Tool shortcuts shown on the docs home page. */
export const DOCS_FEATURED_TOOLS = [
  { slug: 'tools/codex', name: 'Codex', kind: 'CLI · Desktop' },
  { slug: 'tools/claude-code', name: 'Claude Code', kind: 'CLI' },
  { slug: 'tools/openclaw', name: 'OpenClaw', kind: 'Agent' },
  { slug: 'tools/hermes-agent', name: 'Hermes Agent', kind: 'Agent' },
  { slug: 'tools/opencode', name: 'OpenCode', kind: 'TUI' },
  { slug: 'tools/pi', name: 'Pi', kind: 'CLI' },
  { slug: 'tools/cc-switch', name: 'CC-Switch', kind: 'Desktop' },
] as const
