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
  Outlet,
  RouterProvider,
} from '@tanstack/react-router'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'

import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/auth-store'

import type { SystemStatus } from '../../types'
import { UserAuthForm } from '../components/user-auth-form'

const clients: QueryClient[] = []

function renderLoginForm(status: SystemStatus | undefined, preview = false) {
  if (preview) {
    const marker = document.createElement('meta')
    marker.name = 'app-preview'
    marker.content = 'read-only'
    document.head.append(marker)
  }
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  clients.push(client)
  if (status) client.setQueryData(['status'], status)
  const root = createRootRoute({ component: Outlet })
  const route = createRoute({
    getParentRoute: () => root,
    path: '/',
    component: () => <UserAuthForm />,
  })
  const router = createRouter({
    routeTree: root.addChildren([route]),
    history: createMemoryHistory({ initialEntries: ['/'] }),
  })
  return render(
    <QueryClientProvider client={client}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}

beforeEach(() => {
  localStorage.clear()
  useAuthStore.getState().auth.reset('complete')
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
  vi.spyOn(api, 'post').mockRejectedValue(new Error('Unexpected login request'))
})

afterEach(() => {
  cleanup()
  for (const client of clients.splice(0)) client.clear()
  document.head.querySelector('meta[name="app-preview"]')?.remove()
  localStorage.clear()
  vi.restoreAllMocks()
})

test('read-only previews show the login form even when every login method is disabled', async () => {
  renderLoginForm({ password_login_enabled: false }, true)

  const username = await screen.findByLabelText('Username or Email')
  const password = screen.getByLabelText('Password', { exact: true })
  expect(username).toHaveAttribute('readonly')
  expect(password).toHaveAttribute('readonly')
  expect(screen.getByRole('button', { name: 'Sign in' })).toBeDisabled()
  expect(screen.getByRole('status')).toHaveTextContent(
    'Sign-in is unavailable in this page preview.'
  )
  await userEvent.type(username, 'preview-user')
  expect(username).toHaveValue('')
})

test('programmatic submission in preview mode never sends credentials to the login API', async () => {
  renderLoginForm({ password_login_enabled: true }, true)
  const username = await screen.findByLabelText('Username or Email')
  const password = screen.getByLabelText('Password', { exact: true })
  const form = username.closest('form')
  if (!form) throw new Error('Login form is missing')

  await act(async () => {
    fireEvent.change(username, { target: { value: 'preview-user' } })
    fireEvent.change(password, {
      target: { value: 'example-input' },
    })
    fireEvent.submit(form)
  })

  expect(api.post).not.toHaveBeenCalled()
})

test('the preview is read-only before the status request has completed', async () => {
  vi.spyOn(api, 'get').mockImplementation(() => new Promise(() => {}))
  renderLoginForm(undefined, true)

  expect(await screen.findByLabelText('Username or Email')).toHaveAttribute(
    'readonly'
  )
  expect(screen.getByLabelText('Password', { exact: true })).toHaveAttribute(
    'readonly'
  )
  expect(screen.getByRole('button', { name: 'Sign in' })).toBeDisabled()
  expect(api.post).not.toHaveBeenCalled()
})

test('preview mode disables alternative login actions even when a provider is configured', async () => {
  renderLoginForm(
    {
      password_login_enabled: false,
      github_oauth: true,
      github_client_id: 'preview-client',
    },
    true
  )

  const github = await screen.findByRole('button', { name: /GitHub/ })
  expect(github).toBeDisabled()
  await userEvent.click(github)
  expect(api.post).not.toHaveBeenCalled()
})

test('non-preview sites explain when no login method is available', async () => {
  renderLoginForm({ password_login_enabled: false })

  expect(await screen.findByRole('alert')).toHaveTextContent(
    'No sign-in methods are enabled. Please contact the administrator.'
  )
  expect(screen.queryByLabelText('Username or Email')).not.toBeInTheDocument()
})

test('normal password login remains editable when the page is not a preview', async () => {
  renderLoginForm({ password_login_enabled: true })
  const username = await screen.findByLabelText('Username or Email')

  expect(username).not.toHaveAttribute('readonly')
  expect(
    screen.getByLabelText('Password', { exact: true })
  ).not.toHaveAttribute('readonly')
  expect(screen.getByRole('button', { name: 'Sign in' })).toBeEnabled()
  await userEvent.type(username, 'preview-user')
  expect(username).toHaveValue('preview-user')
})
