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
import { afterEach, beforeEach, expect, test } from 'vitest'

import i18n, { resources } from '../config'

beforeEach(async () => {
  localStorage.clear()
  await i18n.init({
    debug: false,
    resources,
    lng: 'en',
    fallbackLng: 'en',
    supportedLngs: Object.keys(resources),
  })
  document.documentElement.lang = 'en'
})

afterEach(async () => {
  await i18n.changeLanguage('en')
  localStorage.clear()
  document.documentElement.lang = 'en'
})

test('initial Chinese language updates the document for localized typography', async () => {
  await i18n.init({ lng: 'zhCN' })

  expect(document.documentElement).toHaveAttribute('lang', 'zh-CN')
})

test.each([
  ['zhCN', 'zh-CN'],
  ['zhTW', 'zh-TW'],
  ['en', 'en'],
  ['fr', 'fr'],
  ['ru', 'ru'],
  ['ja', 'ja'],
  ['vi', 'vi'],
])(
  'switching to %s applies the valid document language %s',
  async (language, locale) => {
    await i18n.changeLanguage('zhCN')
    await i18n.changeLanguage(language)

    expect(document.documentElement).toHaveAttribute('lang', locale)
  }
)

test('an unsupported language uses the resolved English fallback for typography', async () => {
  await i18n.changeLanguage('zhTW')
  await i18n.changeLanguage('unsupported')

  expect(document.documentElement).toHaveAttribute('lang', 'en')
})
