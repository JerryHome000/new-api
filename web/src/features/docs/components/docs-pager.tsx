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
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'

import type { DocsPageEntry } from '../types'

type DocsPagerProps = {
  previous?: DocsPageEntry
  next?: DocsPageEntry
}

type DocsPagerLinkProps = {
  entry: DocsPageEntry
  direction: 'previous' | 'next'
}

function DocsPagerLink(props: DocsPagerLinkProps) {
  const { t } = useTranslation()
  const isNext = props.direction === 'next'
  const Icon = isNext ? ArrowRight : ArrowLeft

  return (
    <Link
      to='/docs/$'
      params={{ _splat: props.entry.page.slug }}
      rel={isNext ? 'next' : 'prev'}
      className={cn(
        'group border-border/60 hover:border-primary/70 flex min-w-0 flex-1 flex-col gap-1.5 rounded-lg border px-4 py-3.5 transition-colors',
        isNext && 'items-end text-right'
      )}
    >
      <span className='omni-mono-label text-muted-foreground flex items-center gap-1.5'>
        {!isNext && <Icon className='size-3.5' />}
        {isNext ? t('Next') : t('Previous')}
        {isNext && <Icon className='size-3.5' />}
      </span>
      <span lang='zh-CN' className='truncate text-sm font-medium'>
        {props.entry.page.title}
      </span>
      <span lang='zh-CN' className='text-muted-foreground truncate text-xs'>
        {props.entry.group.title ?? props.entry.section.title}
      </span>
    </Link>
  )
}

/** Previous / next links in reading order at the end of an article. */
export function DocsPager(props: DocsPagerProps) {
  if (!props.previous && !props.next) return null

  return (
    <div className='mt-14 flex flex-col gap-3 sm:flex-row'>
      {props.previous ? (
        <DocsPagerLink entry={props.previous} direction='previous' />
      ) : (
        <div className='hidden flex-1 sm:block' />
      )}
      {props.next && <DocsPagerLink entry={props.next} direction='next' />}
    </div>
  )
}
