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
import { readFileSync } from 'node:fs'

import { createInstance } from 'i18next'
import { expect, test } from 'vitest'

import { resources } from '@/i18n/config'
import { toIntlLocale } from '@/i18n/languages'

import { renderHomePageContent } from '../render-home-content'

const catalog = {
  models: [
    { model_name: 'claude-sonnet-5-5', vendor_id: 1 },
    { model_name: 'gpt-5.5', vendor_id: 2 },
    { model_name: 'gemini-3.1-pro-preview', vendor_id: 3 },
  ],
  vendors: [
    { id: 1, name: 'Anthropic' },
    { id: 2, name: 'OpenAI' },
    { id: 3, name: 'Google' },
    { id: 4, name: 'Unused vendor' },
  ],
}

function parseMarkup(content: string): HTMLDivElement {
  const page = document.createElement('div')
  page.innerHTML = content
  return page
}

const markup = `<div>
  <span data-home-stat="models">100+</span>
  <span data-home-stat="vendors">6+</span>
  <span data-home-model="retired-model" data-home-model-vendor="Anthropic">retired-model</span>
  <span data-home-vendor="Unused vendor">Unused vendor</span>
  <span data-home-vendor="Anthropic">Anthropic</span>
</div>`

test('catalog counts deduplicate models and exclude unused or unknown vendors', async () => {
  const i18n = await createInstance().init({ resources, lng: 'en' })
  const result = renderHomePageContent(markup, i18n, 'en', {
    ...catalog,
    models: [
      ...catalog.models,
      catalog.models[0],
      { model_name: 'unclassified-model', vendor_id: 99 },
    ],
  })
  const page = parseMarkup(result)

  expect(page.querySelector('[data-home-stat="models"]')).toHaveTextContent('4')
  expect(page.querySelector('[data-home-stat="vendors"]')).toHaveTextContent(
    '3'
  )
  expect(
    page.querySelector('[data-home-vendor="Unused vendor"]')
  ).toHaveAttribute('hidden')
  expect(
    page.querySelector('[data-home-vendor="Anthropic"]')
  ).not.toHaveAttribute('hidden')
})

test('an unavailable catalog displays placeholders instead of invented counts and retired models', async () => {
  const t = await createInstance().init({ resources, lng: 'en' })
  const page = parseMarkup(renderHomePageContent(markup, t, 'en'))

  expect(page.querySelector('[data-home-stat="models"]')).toHaveTextContent('—')
  expect(page.querySelector('[data-home-stat="vendors"]')).toHaveTextContent(
    '—'
  )
  expect(page.querySelector('[data-home-model]')).toHaveTextContent('—')
})

test('a successful empty catalog displays zero counts', async () => {
  const t = await createInstance().init({ resources, lng: 'en' })
  const page = parseMarkup(
    renderHomePageContent(markup, t, 'en', { models: [], vendors: [] })
  )

  expect(page.querySelector('[data-home-stat="models"]')).toHaveTextContent('0')
  expect(page.querySelector('[data-home-stat="vendors"]')).toHaveTextContent(
    '0'
  )
})

test('a retired example switches to a listed model from the same vendor', async () => {
  const t = await createInstance().init({ resources, lng: 'en' })
  const page = parseMarkup(renderHomePageContent(markup, t, 'en', catalog))

  expect(page.querySelector('[data-home-model]')).toHaveTextContent(
    'claude-sonnet-5-5'
  )
})

test('catalog vendor names are rendered as text instead of injected HTML', async () => {
  const t = await createInstance().init({ resources, lng: 'en' })
  const name = '<img src=x onerror=alert(1)>'
  const source =
    '<p data-home-i18n="<b>{{vendors}}</b> behind one Base URL. Browse the model square for availability and pricing."></p>'
  const result = renderHomePageContent(source, t, 'en', {
    models: [catalog.models[0]],
    vendors: [{ id: 1, name }],
  })
  const page = parseMarkup(result)

  expect(page.querySelector('img')).toBeNull()
  expect(page.querySelector('[data-home-vendors]')).toHaveTextContent(name)
})

test.each([
  ['en', 'One key'],
  ['zhCN', '一把 Key'],
  ['zhTW', '一把 Key'],
  ['fr', 'Une clé'],
  ['ja', 'ひとつのキー'],
  ['ru', 'Один ключ'],
  ['vi', 'Một khóa'],
])(
  'the %s homepage is translated and secondary headings have no final periods',
  async (language, title) => {
    const instance = createInstance()
    const t = await instance.init({
      resources,
      lng: language,
      fallbackLng: 'en',
    })
    const content = readFileSync('../branding/home-openrouter.html', 'utf8')
    const page = parseMarkup(
      renderHomePageContent(content, t, toIntlLocale(language), catalog)
    )

    expect(page.querySelector('h1')).toHaveTextContent(title)
    expect(
      [...page.querySelectorAll('h2,h3')].every(
        (el) => !/[.。]$/.test(el.textContent?.trim() ?? '')
      )
    ).toBe(true)
    for (const element of page.querySelectorAll('[data-home-i18n]')) {
      const key = element.getAttribute('data-home-i18n') ?? ''
      expect(
        instance.exists(key, { lng: language, fallbackLng: false }),
        key
      ).toBe(true)
    }
  }
)
