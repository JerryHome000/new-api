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
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'

import type { DocsHeading } from '../types'

type DocsTocProps = {
  headings: DocsHeading[]
}

/** "On this page" outline with scroll-spy on the article headings. */
export function DocsToc(props: DocsTocProps) {
  const { t } = useTranslation()
  const [activeId, setActiveId] = useState<string>()

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const elements = props.headings
      .map((heading) => document.getElementById(heading.id))
      .filter((element): element is HTMLElement => element != null)
    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting)
        if (visible) setActiveId(visible.target.id)
      },
      { rootMargin: '-96px 0px -70% 0px' }
    )
    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [props.headings])

  if (props.headings.length === 0) return null

  return (
    <nav aria-label={t('On this page')}>
      <p className='omni-mono-label text-muted-foreground mb-3'>
        {t('On this page')}
      </p>
      <ul lang='zh-CN' className='border-border/60 space-y-px border-l'>
        {props.headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className={cn(
                '-ml-px block border-l py-1 text-[13px] leading-snug transition-colors',
                heading.level === 3 ? 'pl-6' : 'pl-3',
                heading.id === activeId
                  ? 'border-primary text-foreground'
                  : 'text-muted-foreground hover:text-foreground border-transparent'
              )}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
