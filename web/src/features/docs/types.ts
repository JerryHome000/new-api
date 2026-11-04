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
export type DocsPage = {
  /** Path below /docs, e.g. `tools/codex/macos`. */
  slug: string
  title: string
  load: () => Promise<{ default: string }>
}

export type DocsGroup = {
  /** Omitted for the leading group of a section. */
  title?: string
  pages: DocsPage[]
}

export type DocsSection = {
  id: string
  title: string
  description: string
  groups: DocsGroup[]
}

/** A page together with where it sits in the tree. */
export type DocsPageEntry = {
  page: DocsPage
  section: DocsSection
  group: DocsGroup
}

export type DocsHeading = {
  id: string
  text: string
  level: 2 | 3
}

export type DocsTemplateVars = {
  siteName: string
  baseUrl: string
  providerId: string
  claudeModel: string
  gptModel: string
}
