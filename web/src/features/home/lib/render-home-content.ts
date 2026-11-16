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
import type { TFunction } from 'i18next'

import type { PricingModel, PricingVendor } from '@/features/pricing/types'
import { formatNumber } from '@/lib/format'

export type HomeCatalog = {
  models: Pick<PricingModel, 'model_name' | 'vendor_id'>[]
  vendors: PricingVendor[]
}

export function renderHomePageContent(
  content: string,
  t: TFunction,
  locale?: string,
  catalog?: HomeCatalog
): string {
  if (!content.includes('data-home-') || typeof document === 'undefined') {
    return content
  }

  const template = document.createElement('template')
  template.innerHTML = content
  const root = template.content
  const models =
    catalog?.models.filter((model) => model.model_name.trim()) ?? []
  const modelNames = new Set(models.map((model) => model.model_name))
  const vendorIds = new Set(models.map((model) => model.vendor_id))
  const activeVendors = new Map(
    catalog?.vendors
      .filter((vendor) => vendorIds.has(vendor.id) && vendor.name.trim())
      .map((vendor) => [vendor.name.trim().toLowerCase(), vendor])
  )

  for (const element of root.querySelectorAll('[data-home-i18n]')) {
    const key = element.getAttribute('data-home-i18n')
    if (!key) continue
    // Only fixed markup is interpolated. Catalog names are inserted as text
    // below, and HtmlContent sanitizes the completed HTML before rendering.
    element.innerHTML = t(key, {
      vendors: '<span data-home-vendors></span>',
      interpolation: { escapeValue: false },
    })
  }

  for (const element of root.querySelectorAll('[data-home-stat]')) {
    const count =
      element.getAttribute('data-home-stat') === 'models'
        ? modelNames.size
        : activeVendors.size
    element.textContent = catalog ? formatNumber(count, locale) : '—'
  }

  const vendorNames = [...activeVendors.values()].map((vendor) => vendor.name)
  const vendorList = new Intl.ListFormat(locale, {
    style: 'short',
    type: 'conjunction',
  }).format(vendorNames)
  for (const element of root.querySelectorAll('[data-home-vendors]')) {
    element.textContent = vendorList || '—'
  }
  for (const element of root.querySelectorAll<HTMLElement>(
    '[data-home-vendor]'
  )) {
    const name = element.getAttribute('data-home-vendor')?.toLowerCase() ?? ''
    element.hidden = !activeVendors.has(name)
  }

  for (const element of root.querySelectorAll('[data-home-model]')) {
    const preferred = element.getAttribute('data-home-model')
    const vendorName = element
      .getAttribute('data-home-model-vendor')
      ?.toLowerCase()
    const vendor = vendorName ? activeVendors.get(vendorName) : undefined
    const model =
      models.find((item) => item.model_name === preferred) ??
      models.find((item) => vendor && item.vendor_id === vendor.id)
    const card = element.closest<HTMLElement>('.om-model')
    if (card) card.hidden = !model
    let value = model?.model_name ?? '—'
    if (element.hasAttribute('data-home-quoted')) {
      value = JSON.stringify(value)
    }
    element.textContent = value
  }

  return template.innerHTML
}
