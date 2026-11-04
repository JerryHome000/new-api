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
import { useTranslation } from 'react-i18next'

import { PageHero } from '@/components/layout'
import { cn } from '@/lib/utils'

import type { RankingPeriod } from '../types'

const PERIODS: { id: RankingPeriod; labelKey: string }[] = [
  { id: 'today', labelKey: 'Today' },
  { id: 'week', labelKey: 'Week' },
  { id: 'month', labelKey: 'Month' },
  { id: 'year', labelKey: 'Year' },
]

type RankingsHeroProps = {
  period: RankingPeriod
  onPeriodChange: (period: RankingPeriod) => void
}

/**
 * Rankings page header: shared brand hero with the period tabs pinned to
 * its bottom edge.
 */
export function RankingsHero(props: RankingsHeroProps) {
  const { t } = useTranslation()
  const activePeriod = PERIODS.find((p) => p.id === props.period)

  return (
    <PageHero
      eyebrow={t('Live usage')}
      meta={activePeriod && t(activePeriod.labelKey)}
      title={t('Rankings')}
      description={t(
        'Discover the most-used models and rising vendors on the platform, updated from live usage data.'
      )}
      containerClassName='px-3'
    >
      <div
        role='tablist'
        aria-label={t('Period')}
        className='flex items-center gap-1'
      >
        {PERIODS.map((p) => {
          const isActive = props.period === p.id
          return (
            <button
              key={p.id}
              role='tab'
              type='button'
              aria-selected={isActive}
              onClick={() => props.onPeriodChange(p.id)}
              className={cn(
                'focus-visible:ring-ring/40 omni-mono-label relative rounded-sm px-3 py-3 transition-colors focus-visible:ring-2 focus-visible:outline-none',
                isActive
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {t(p.labelKey)}
              <span
                aria-hidden
                className={cn(
                  'bg-primary absolute inset-x-3 -bottom-px h-[2px] transition-opacity',
                  isActive ? 'opacity-100' : 'opacity-0'
                )}
              />
            </button>
          )
        })}
      </div>
    </PageHero>
  )
}
