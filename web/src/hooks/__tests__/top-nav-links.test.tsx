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
import { renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { expect, test } from 'vitest'

import { STATUS_QUERY_KEY } from '@/lib/status-query'

import { useTopNavLinks } from '../use-top-nav-links'

function docsLinkFor(docsLink?: string) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity } },
  })
  client.setQueryData(STATUS_QUERY_KEY, { docs_link: docsLink })
  const wrapper = (props: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{props.children}</QueryClientProvider>
  )
  const { result } = renderHook(() => useTopNavLinks(), { wrapper })
  return result.current.find((link) => link.title === 'Docs')
}

test('uses the built-in docs when no docs link is set', () => {
  expect(docsLinkFor()).toMatchObject({ href: '/docs' })
  expect(docsLinkFor()?.external).toBeFalsy()
})

test('keeps a site path docs link inside the app', () => {
  const link = docsLinkFor('/docs/guide')
  expect(link).toMatchObject({ href: '/docs/guide' })
  expect(link?.external).toBeFalsy()
})

test('opens an external docs site as an external link', () => {
  expect(docsLinkFor('https://docs.example.com')).toMatchObject({
    href: 'https://docs.example.com',
    external: true,
  })
  expect(docsLinkFor('//docs.example.com')?.external).toBe(true)
})
