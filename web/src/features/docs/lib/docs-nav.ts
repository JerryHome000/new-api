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
import type { DocsPageEntry, DocsSection } from '../types'

/** Every page in reading order: section by section, group by group. */
export function flattenDocs(sections: DocsSection[]): DocsPageEntry[] {
  return sections.flatMap((section) =>
    section.groups.flatMap((group) =>
      group.pages.map((page) => ({ page, section, group }))
    )
  )
}

/** Normalizes a URL splat (`/tools/codex/`) to a page slug (`tools/codex`). */
export function normalizeDocsSlug(splat: string | undefined): string {
  return (splat ?? '').replaceAll(/^\/+|\/+$/g, '')
}

export type DocsLocation = {
  entry: DocsPageEntry
  previous?: DocsPageEntry
  next?: DocsPageEntry
}

/** Finds a page and its neighbours in reading order, or undefined. */
export function locateDocsPage(
  sections: DocsSection[],
  slug: string
): DocsLocation | undefined {
  const entries = flattenDocs(sections)
  const index = entries.findIndex((entry) => entry.page.slug === slug)
  if (index === -1) return undefined

  return {
    entry: entries[index],
    previous: entries[index - 1],
    next: entries[index + 1],
  }
}
