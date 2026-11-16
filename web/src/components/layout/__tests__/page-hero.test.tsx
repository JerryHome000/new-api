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
import i18next from 'i18next'
import { afterEach, expect, test } from 'vitest'

import { PageHero } from '../components/page-hero'

afterEach(async () => {
  await i18next.changeLanguage('en')
})

test('renders the title as the page heading with its kicker', () => {
  render(<PageHero eyebrow='Models' meta='42 live' title='Model Square' />)

  expect(
    screen.getByRole('heading', { level: 1, name: 'Model Square' })
  ).toBeVisible()
  expect(screen.getByText('Models')).toBeVisible()
  expect(screen.getByText('42 live')).toBeVisible()
})

test('places the aside in a second column only when one is given', () => {
  const { container, rerender } = render(
    <PageHero eyebrow='Models' title='Model Square' />
  )
  const grid = container.querySelector('section .grid')
  expect(grid?.className).not.toContain('lg:grid-cols-')

  rerender(
    <PageHero
      eyebrow='Models'
      title='Model Square'
      aside={<input aria-label='Search models' />}
    />
  )

  expect(grid?.className).toContain('lg:grid-cols-')
  expect(screen.getByRole('textbox', { name: 'Search models' })).toBeVisible()
})

test('renders a bottom row for children such as tabs', () => {
  render(
    <PageHero eyebrow='Live usage' title='Rankings'>
      <div role='tablist' aria-label='Period' />
    </PageHero>
  )

  expect(screen.getByRole('tablist', { name: 'Period' })).toBeInTheDocument()
})

test('tags the hero with a valid locale so CJK titles get CJK tracking', async () => {
  await i18next.changeLanguage('zhCN')

  const { container } = render(<PageHero eyebrow='模型' title='模型广场' />)

  expect(container.querySelector('section')).toHaveAttribute('lang', 'zh-CN')
})

test('keeps the brand backdrop out of the accessibility tree', () => {
  const { container } = render(<PageHero eyebrow='About' title='About' />)

  expect(container.querySelector('.omni-backdrop')).toHaveAttribute(
    'aria-hidden',
    'true'
  )
})
