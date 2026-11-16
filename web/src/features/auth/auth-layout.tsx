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
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { BrandBackdrop } from '@/components/layout'
import { Skeleton } from '@/components/ui/skeleton'
import { useSystemConfig } from '@/hooks/use-system-config'
import { toIntlLocale } from '@/i18n/languages'

type AuthLayoutProps = {
  children: React.ReactNode
}

export function AuthLayout(props: AuthLayoutProps) {
  const { t, i18n } = useTranslation()
  const { systemName, logo, loading } = useSystemConfig()
  const lang = toIntlLocale(i18n.resolvedLanguage || i18n.language)
  const brandPoints = [
    t('OpenAI-compatible API'),
    t('Pay as you go'),
    t('Live usage logs'),
  ]

  const brandLink = (
    <Link
      to='/'
      className='relative flex items-center gap-2.5 transition-opacity hover:opacity-80'
    >
      <div className='relative size-8'>
        {loading ? (
          <Skeleton className='absolute inset-0 rounded-md' />
        ) : (
          <img
            src={logo}
            alt={t('Logo')}
            className='size-8 rounded-md object-cover'
          />
        )}
      </div>
      {loading ? (
        <Skeleton className='h-6 w-24' />
      ) : (
        <span className='omni-wordmark text-sm'>{systemName}</span>
      )}
    </Link>
  )

  return (
    <div className='bg-background relative grid min-h-svh lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]'>
      <aside
        lang={lang}
        className='border-border/60 relative isolate hidden flex-col justify-between overflow-hidden border-r p-10 lg:flex xl:p-14'
      >
        <BrandBackdrop variant='panel' />
        {brandLink}
        <div className='relative max-w-2xl'>
          <p className='omni-eyebrow omni-rise'>
            <span className='omni-dot' />
            <b>{t('Unified AI gateway')}</b>
          </p>
          <p
            data-delay='1'
            className='omni-display omni-rise mt-6 text-[clamp(2.5rem,3.6vw,3.75rem)]'
          >
            <span className='omni-underline'>
              {t('One key for every model')}
            </span>
          </p>
          <p
            data-delay='2'
            className='omni-rise text-muted-foreground mt-6 max-w-md text-base leading-relaxed'
          >
            {t(
              'Route Claude, GPT, Gemini, DeepSeek and more through one endpoint, with live pricing and usage you can audit.'
            )}
          </p>
          <ul
            data-delay='3'
            className='omni-rise omni-mono-label border-border/60 mt-10 grid max-w-xl grid-cols-3 border-t'
          >
            {brandPoints.map((point) => (
              <li
                key={point}
                className='border-border/60 text-muted-foreground border-r py-4 pr-4 last:border-r-0 [&:not(:first-child)]:pl-4'
              >
                {point}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <main className='relative isolate flex flex-col'>
        <BrandBackdrop className='opacity-40 lg:hidden' />
        <div className='relative p-4 sm:p-8 lg:hidden'>{brandLink}</div>
        <div className='relative flex flex-1 items-center'>
          <div className='mx-auto flex w-full flex-col justify-center space-y-2 px-4 py-8 sm:w-[480px] sm:p-8'>
            {props.children}
          </div>
        </div>
      </main>
    </div>
  )
}
