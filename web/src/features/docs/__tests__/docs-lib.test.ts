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
import { describe, expect, test } from 'vitest'

import { DOCS_SECTIONS } from '../constants'
import { flattenDocs, locateDocsPage, normalizeDocsSlug } from '../lib/docs-nav'
import {
  fillDocsTemplate,
  slugifyHeading,
  toDocsProviderId,
} from '../lib/docs-template'

const vars = {
  siteName: 'Aion',
  baseUrl: 'https://api.example.com',
  providerId: 'aion',
  claudeModel: 'claude-x',
  gptModel: 'gpt-x',
}

describe('docs template', () => {
  test('fills every placeholder, including repeats', () => {
    expect(
      fillDocsTemplate(
        '{{SITE_NAME}} at {{BASE_URL}}/v1 and {{BASE_URL}} as {{PROVIDER_ID}}: {{CLAUDE_MODEL}}, {{GPT_MODEL}}',
        vars
      )
    ).toBe(
      'Aion at https://api.example.com/v1 and https://api.example.com as aion: claude-x, gpt-x'
    )
  })

  test('derives an ASCII provider id from the site name', () => {
    expect(toDocsProviderId('Aion Cloud')).toBe('aion-cloud')
    expect(toDocsProviderId('  API·Hub 2 ')).toBe('api-hub-2')
    expect(toDocsProviderId('全能')).toBe('aion')
  })

  test('slugs headings like GitHub and numbers repeats', () => {
    const seen = new Map<string, number>()
    expect(slugifyHeading('3. 写入配置', seen)).toBe('3-写入配置')
    expect(slugifyHeading('常见问题', seen)).toBe('常见问题')
    expect(slugifyHeading('常见问题', seen)).toBe('常见问题-1')
    expect(slugifyHeading('Python 完整示例', seen)).toBe('python-完整示例')
    expect(slugifyHeading('!!!', seen)).toBe('section')
  })
})

describe('docs navigation', () => {
  test('normalizes route splats to slugs', () => {
    expect(normalizeDocsSlug('/tools/codex/')).toBe('tools/codex')
    expect(normalizeDocsSlug(undefined)).toBe('')
  })

  test('gives every page a unique slug', () => {
    const slugs = flattenDocs(DOCS_SECTIONS).map((entry) => entry.page.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  test('links neighbours across group and section boundaries', () => {
    const first = locateDocsPage(DOCS_SECTIONS, 'guide')
    expect(first?.previous).toBeUndefined()
    expect(first?.next?.page.slug).toBe('guide/account')

    const crossing = locateDocsPage(DOCS_SECTIONS, 'guide/recharge')
    expect(crossing?.next?.page.slug).toBe('tools')
    expect(crossing?.next?.section.id).toBe('tools')

    const last = locateDocsPage(DOCS_SECTIONS, 'help/terms')
    expect(last?.next).toBeUndefined()
    expect(locateDocsPage(DOCS_SECTIONS, 'nope')).toBeUndefined()
  })
})

/** Heading anchors a page will get once rendered. */
function anchorsOf(markdown: string): Set<string> {
  const seen = new Map<string, number>()
  const anchors = new Set<string>()
  const withoutCode = markdown.replaceAll(/```[\s\S]*?```/g, '')
  for (const match of withoutCode.matchAll(/^#{2,3}\s+(.+)$/gm)) {
    const text = match[1]
      .replaceAll(/[`*_]/g, '')
      .replaceAll(/\[(.+?)\]\(.+?\)/g, '$1')
    anchors.add(slugifyHeading(text, seen))
  }
  return anchors
}

test('every /docs link in the content points at a real page and heading', async () => {
  const entries = flattenDocs(DOCS_SECTIONS)
  const sources = new Map<string, string>()
  for (const entry of entries) {
    sources.set(entry.page.slug, (await entry.page.load()).default)
  }

  const broken: string[] = []
  for (const [slug, markdown] of sources) {
    for (const match of markdown.matchAll(
      /\]\((\/docs\/[^)\s]*|#[^)\s]+)\)/g
    )) {
      const [path, hash] = match[1].split('#')
      const target = path ? normalizeDocsSlug(path.slice('/docs'.length)) : slug
      const source = sources.get(target)
      if (source === undefined) {
        broken.push(`${slug} → ${match[1]} (no page)`)
      } else if (hash && !anchorsOf(source).has(hash)) {
        broken.push(`${slug} → ${match[1]} (no heading)`)
      }
    }
  }

  expect(broken).toEqual([])
})
