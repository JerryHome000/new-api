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
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { toIntlLocale } from '@/i18n/languages'
import { cn } from '@/lib/utils'

import { BrandBackdrop } from './brand-backdrop'

type PageHeroProps = {
  /** Mono kicker label shown above the title. */
  eyebrow: ReactNode
  /** Optional mono detail after the kicker, such as a live count. */
  meta?: ReactNode
  title: ReactNode
  description?: ReactNode
  /** Right column on wide screens (search, primary action). */
  aside?: ReactNode
  /** Full-width row pinned to the bottom edge (tabs, filters). */
  children?: ReactNode
  /** Width and gutters of the inner container; match the page body. */
  containerClassName?: string
  className?: string
}

/**
 * Editorial page header for public pages: flowing brand backdrop, mono
 * kicker, large display title and an optional aside. Clears the fixed
 * public header on its own.
 */
export function PageHero(props: PageHeroProps) {
  const { i18n } = useTranslation()
  const lang = toIntlLocale(i18n.resolvedLanguage || i18n.language)

  return (
    <section
      lang={lang}
      className={cn(
        'relative isolate overflow-hidden border-b border-border/60',
        props.className
      )}
    >
      <BrandBackdrop />
      <div
        className={cn(
          'relative mx-auto w-full max-w-[1280px] px-4 sm:px-6 xl:px-8',
          props.containerClassName
        )}
      >
        <div
          className={cn(
            'grid gap-8 pt-28 sm:pt-32',
            props.children ? 'pb-6' : 'pb-12 sm:pb-16',
            props.aside &&
              'lg:grid-cols-[minmax(0,1fr)_minmax(0,34rem)] lg:items-end'
          )}
        >
          <div className='min-w-0'>
            <p className='omni-eyebrow omni-rise'>
              <span className='omni-dot' />
              <b>{props.eyebrow}</b>
              {props.meta && (
                <>
                  <span className='omni-eyebrow-rule' />
                  <span>{props.meta}</span>
                </>
              )}
            </p>
            <h1
              data-delay='1'
              className='omni-display omni-rise mt-5 text-[clamp(2.6rem,6.4vw,5.25rem)]'
            >
              <span className='omni-underline'>{props.title}</span>
            </h1>
            {props.description && (
              <p
                data-delay='2'
                className='omni-rise text-muted-foreground mt-5 max-w-2xl text-base leading-relaxed'
              >
                {props.description}
              </p>
            )}
          </div>
          {props.aside && (
            <div data-delay='3' className='omni-rise min-w-0'>
              {props.aside}
            </div>
          )}
        </div>
        {props.children && (
          <div data-delay='3' className='omni-rise'>
            {props.children}
          </div>
        )}
      </div>
    </section>
  )
}
