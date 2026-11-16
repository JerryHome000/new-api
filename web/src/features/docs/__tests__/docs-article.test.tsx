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
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'

import { STATUS_QUERY_KEY } from '@/lib/status-query'

import { DocsArticle } from '../components/docs-article'
import type { DocsHeading, DocsPage } from '../types'

const navigate = vi.fn()

vi.mock('@tanstack/react-router', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@tanstack/react-router')>()),
  useNavigate: () => navigate,
}))

const MARKDOWN = [
  '## 1. 安装',
  '',
  '用 {{SITE_NAME}} 的地址 `{{BASE_URL}}/v1`。',
  '',
  '```bash',
  'curl {{BASE_URL}}/v1/models',
  '```',
  '',
  '### 常见问题',
  '',
  '## 常见问题',
  '',
  '[下一步](/docs/guide/account) · [跳到常见问题](#常见问题) · [Node.js](https://nodejs.org/)',
].join('\n')

const page: DocsPage = {
  slug: 'test/page',
  title: 'Test',
  load: async () => ({ default: MARKDOWN }),
}

let client: QueryClient
beforeEach(() => {
  client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  client.setQueryData(STATUS_QUERY_KEY, {
    system_name: 'Aion',
    server_address: 'https://api.example.com/',
  })
  window.scrollTo = vi.fn()
})

afterEach(() => {
  client.clear()
  navigate.mockReset()
})

async function renderArticle() {
  const onHeadingsChange = vi.fn<(headings: DocsHeading[]) => void>()
  const view = render(
    <QueryClientProvider client={client}>
      <DocsArticle page={page} onHeadingsChange={onHeadingsChange} />
    </QueryClientProvider>
  )
  await screen.findByRole('heading', { level: 2, name: '1. 安装' })
  return { ...view, onHeadingsChange }
}

test('fills site values and anchors headings for the outline', async () => {
  const { container, onHeadingsChange } = await renderArticle()

  expect(container).toHaveTextContent(
    '用 Aion 的地址 https://api.example.com/v1'
  )
  expect(
    screen.getByRole('heading', { level: 2, name: '1. 安装' })
  ).toHaveAttribute('id', '1-安装')
  await waitFor(() =>
    expect(onHeadingsChange).toHaveBeenLastCalledWith([
      { id: '1-安装', text: '1. 安装', level: 2 },
      { id: '常见问题', text: '常见问题', level: 3 },
      { id: '常见问题-1', text: '常见问题', level: 2 },
    ])
  )
})

test('gives each code block a language label and a copy button', async () => {
  const { container } = await renderArticle()

  const block = container.querySelector('.docs-code')
  expect(block?.querySelector('.docs-code-bar')).toHaveTextContent('bash')
  expect(block?.querySelector('pre')).toHaveTextContent(
    'curl https://api.example.com/v1/models'
  )
  expect(
    await screen.findByRole('button', { name: 'Copy to clipboard' })
  ).toBeInTheDocument()
})

test('keeps site links in the app and opens other sites in a new tab', async () => {
  await renderArticle()

  const internal = screen.getByRole('link', { name: '下一步' })
  expect(internal).not.toHaveAttribute('target')
  fireEvent.click(internal)
  expect(navigate).toHaveBeenCalledWith({ href: '/docs/guide/account' })

  const heading = screen.getByRole('heading', { level: 3, name: '常见问题' })
  const scroll = vi.spyOn(heading, 'scrollIntoView')
  fireEvent.click(screen.getByRole('link', { name: '跳到常见问题' }))
  expect(navigate).toHaveBeenCalledTimes(1)
  expect(scroll).toHaveBeenCalled()

  expect(screen.getByRole('link', { name: 'Node.js' })).toHaveAttribute(
    'target',
    '_blank'
  )
})
