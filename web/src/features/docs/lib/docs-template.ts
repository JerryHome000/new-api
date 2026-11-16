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
import { DOCS_FALLBACK_PROVIDER_ID } from '../constants'
import type { DocsTemplateVars } from '../types'

/**
 * Fills the site-specific placeholders the Markdown pages use, so every
 * snippet shows this deployment's name, address and default models.
 */
export function fillDocsTemplate(
  markdown: string,
  vars: DocsTemplateVars
): string {
  return markdown
    .replaceAll('{{SITE_NAME}}', vars.siteName)
    .replaceAll('{{BASE_URL}}', vars.baseUrl)
    .replaceAll('{{PROVIDER_ID}}', vars.providerId)
    .replaceAll('{{CLAUDE_MODEL}}', vars.claudeModel)
    .replaceAll('{{GPT_MODEL}}', vars.gptModel)
}

/**
 * Turns the site name into the id prefix tools use for custom providers:
 * lowercase ASCII words joined by hyphens ("Aion Cloud" → "omni-cloud").
 */
export function toDocsProviderId(siteName: string): string {
  const id = siteName
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, '-')
    .replaceAll(/^-+|-+$/g, '')
  return id || DOCS_FALLBACK_PROVIDER_ID
}

/**
 * GitHub-style heading anchor: lowercase, punctuation removed, whitespace
 * collapsed to hyphens, CJK kept ("3. 写入配置" → "3-写入配置"). `seen`
 * tracks earlier anchors on the page so repeats get a numeric suffix.
 */
export function slugifyHeading(
  text: string,
  seen: Map<string, number>
): string {
  const base =
    text
      .trim()
      .toLowerCase()
      .replaceAll(/[^\p{L}\p{N}\s_-]/gu, '')
      .replaceAll(/\s+/g, '-') || 'section'
  const count = seen.get(base) ?? 0
  seen.set(base, count + 1)
  return count === 0 ? base : `${base}-${count}`
}
