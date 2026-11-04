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

import { cn } from '@/lib/utils'

import type { DocsSection } from '../types'

type DocsSidebarNavProps = {
  section: DocsSection
  activeSlug: string
  /** Called after a link is chosen, e.g. to close the mobile sheet. */
  onNavigate?: () => void
}

/** Page list of one docs section, grouped under mono headings. */
export function DocsSidebarNav(props: DocsSidebarNavProps) {
  return (
    <nav lang='zh-CN' className='space-y-7'>
      {props.section.groups.map((group, index) => (
        <div key={group.title ?? index}>
          {group.title && (
            <p className='omni-mono-label text-muted-foreground mb-2.5'>
              {group.title}
            </p>
          )}
          <ul className='border-border/60 space-y-px border-l'>
            {group.pages.map((page) => {
              const isActive = page.slug === props.activeSlug
              return (
                <li key={page.slug}>
                  <Link
                    to='/docs/$'
                    params={{ _splat: page.slug }}
                    onClick={props.onNavigate}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      '-ml-px block border-l py-1.5 pr-2 pl-4 text-sm leading-snug transition-colors',
                      isActive
                        ? 'border-primary text-foreground font-medium'
                        : 'text-muted-foreground hover:border-foreground/40 hover:text-foreground border-transparent'
                    )}
                  >
                    {page.title}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}
