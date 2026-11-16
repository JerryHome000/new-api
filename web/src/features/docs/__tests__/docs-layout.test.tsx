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
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router'
import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { expect, test } from 'vitest'

import { DocsPager } from '../components/docs-pager'
import { DocsSidebarNav } from '../components/docs-sidebar'
import { DOCS_SECTIONS } from '../constants'
import { locateDocsPage } from '../lib/docs-nav'

function locate(slug: string) {
  const location = locateDocsPage(DOCS_SECTIONS, slug)
  if (!location) throw new Error(`unknown docs page ${slug}`)
  return location
}

async function renderInRouter(node: ReactNode) {
  const root = createRootRoute()
  const docs = createRoute({
    getParentRoute: () => root,
    path: '/docs/$',
    component: () => node,
  })
  const router = createRouter({
    routeTree: root.addChildren([docs]),
    history: createMemoryHistory({ initialEntries: ['/docs/x'] }),
  })
  render(<RouterProvider router={router} />)
  await screen.findAllByRole('link')
}

test('sidebar lists the section in groups and marks the current page', async () => {
  const tools = locate('tools').entry.section
  await renderInRouter(
    <DocsSidebarNav section={tools} activeSlug='tools/codex/macos' />
  )

  expect(screen.getByText('Claude Code')).toBeInTheDocument()
  const current = screen
    .getAllByRole('link', { name: 'macOS' })
    .find((link) => link.getAttribute('aria-current') === 'page')
  expect(current).toHaveAttribute('href', '/docs/tools/codex/macos')
  expect(
    screen
      .getAllByRole('link')
      .filter((link) => link.hasAttribute('aria-current'))
  ).toHaveLength(1)
})

test('pager links to the neighbouring pages in reading order', async () => {
  const location = locate('guide/recharge')
  await renderInRouter(
    <DocsPager previous={location.previous} next={location.next} />
  )

  expect(screen.getByRole('link', { name: /Previous/ })).toHaveAttribute(
    'href',
    '/docs/guide/pricing'
  )
  expect(screen.getByRole('link', { name: /Next/ })).toHaveAttribute(
    'href',
    '/docs/tools'
  )
})

test('pager leaves out the missing side on the first page', async () => {
  const location = locate('guide')
  await renderInRouter(<DocsPager next={location.next} />)

  expect(screen.queryByRole('link', { name: /Previous/ })).toBeNull()
  expect(screen.getByRole('link', { name: /Next/ })).toBeInTheDocument()
})
