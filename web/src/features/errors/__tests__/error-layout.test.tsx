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
import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'

import { ErrorLayout } from '../components/error-layout'

test('shows the status code as the heading when one is given', () => {
  render(<ErrorLayout code='404' title='Page not found' />)

  expect(screen.getByRole('heading', { level: 1, name: '404' })).toBeVisible()
  expect(screen.getByText('Page not found')).toBeVisible()
})

test('omits the status heading when no code is known', () => {
  render(
    <ErrorLayout title='Something went wrong'>
      <button type='button'>Back to Home</button>
    </ErrorLayout>
  )

  expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Back to Home' })).toBeVisible()
})
