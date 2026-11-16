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
import { act, render } from '@testing-library/react'
import i18next from 'i18next'
import { afterEach, expect, test } from 'vitest'

import { HtmlContent } from '../html-content'

afterEach(async () => {
  await act(() => i18next.changeLanguage('en'))
})

function isolatedWrapper(container: HTMLElement): HTMLElement | null {
  const page = container.firstElementChild?.shadowRoot?.querySelector('.page')
  return page?.parentElement ?? null
}

test('isolated content follows the interface language for its CSS', async () => {
  await act(() => i18next.changeLanguage('zhCN'))
  const { container } = render(
    <HtmlContent variant='isolated' content='<div class="page">Hi</div>' />
  )
  expect(isolatedWrapper(container)).toHaveAttribute('lang', 'zh-CN')

  await act(() => i18next.changeLanguage('en'))
  expect(isolatedWrapper(container)).toHaveAttribute('lang', 'en')
})
