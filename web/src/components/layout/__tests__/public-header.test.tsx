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
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router'
import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'

import { STATUS_QUERY_KEY } from '@/lib/status-query'

import { PublicHeader } from '../components/public-header'

async function renderHeaderAt(path: string) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity } },
  })
  client.setQueryData(STATUS_QUERY_KEY, { docs_link: '/docs' })
  const root = createRootRoute({ component: () => <PublicHeader /> })
  const page = createRoute({ getParentRoute: () => root, path: '$' })
  const router = createRouter({
    routeTree: root.addChildren([page]),
    history: createMemoryHistory({ initialEntries: [path] }),
  })
  render(
    <QueryClientProvider client={client}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
  await screen.findAllByRole('link', { name: 'Docs' })
}

test('keeps a nav link active on its sub-pages', async () => {
  await renderHeaderAt('/docs/tools/codex')

  // Desktop and mobile menus both render the links.
  for (const docs of screen.getAllByRole('link', { name: 'Docs' })) {
    expect(docs).not.toHaveClass('text-muted-foreground')
  }
  for (const home of screen.getAllByRole('link', { name: 'Home' })) {
    expect(home).toHaveClass('text-muted-foreground')
  }
})
