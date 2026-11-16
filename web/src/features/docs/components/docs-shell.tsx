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
import { PanelLeft } from 'lucide-react'
import { type ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { BrandBackdrop, PublicLayout } from '@/components/layout'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

import { DOCS_SECTIONS } from '../constants'
import { useDocsVars } from '../hooks/use-docs-vars'
import type { DocsSection } from '../types'
import { DocsSidebarNav } from './docs-sidebar'

type DocsShellProps = {
  section: DocsSection
  activeSlug: string
  children: ReactNode
  /** Right rail on extra-wide screens (the page outline). */
  aside?: ReactNode
}

/**
 * Docs frame: a slim branded band with section tabs, then a sticky section
 * sidebar (a sheet on small screens), the article and an optional outline.
 */
export function DocsShell(props: DocsShellProps) {
  const { t } = useTranslation()
  const vars = useDocsVars()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <PublicLayout showMainContainer={false}>
      <section className='border-border/60 relative isolate overflow-hidden border-b'>
        <BrandBackdrop variant='panel' />
        <div className='relative mx-auto w-full max-w-[1280px] px-4 pt-24 sm:px-6 xl:px-8'>
          <p className='omni-eyebrow'>
            <span className='omni-dot' />
            <Link to='/docs' className='hover:text-foreground'>
              <b>{t('Docs')}</b>
            </Link>
            <span className='omni-eyebrow-rule' />
            <span>{vars.siteName}</span>
          </p>
          <nav
            lang='zh-CN'
            aria-label={t('Documentation')}
            className='-mx-1 mt-5 flex gap-1 overflow-x-auto'
          >
            {DOCS_SECTIONS.map((section) => {
              const isActive = section.id === props.section.id
              return (
                <Link
                  key={section.id}
                  to='/docs/$'
                  params={{ _splat: section.groups[0].pages[0].slug }}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'shrink-0 border-b-2 px-3 pt-1 pb-3 text-sm transition-colors',
                    isActive
                      ? 'border-primary text-foreground font-medium'
                      : 'text-muted-foreground hover:text-foreground border-transparent'
                  )}
                >
                  {section.title}
                </Link>
              )
            })}
          </nav>
        </div>
      </section>

      <div
        className={cn(
          'mx-auto grid w-full max-w-[1280px] gap-10 px-4 pb-24 sm:px-6 lg:grid-cols-[15rem_minmax(0,1fr)] xl:px-8',
          props.aside && 'xl:grid-cols-[15rem_minmax(0,1fr)_13rem]'
        )}
      >
        <aside className='hidden lg:block'>
          <div className='sticky top-20 max-h-[calc(100svh-6rem)] overflow-y-auto py-10 pr-2'>
            <DocsSidebarNav
              section={props.section}
              activeSlug={props.activeSlug}
            />
          </div>
        </aside>

        <div className='min-w-0 pt-6 lg:pt-10'>
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger
              render={
                <Button variant='outline' size='sm' className='mb-6 lg:hidden'>
                  <PanelLeft />
                  {t('Docs menu')}
                </Button>
              }
            />
            <SheetContent side='left' className='w-72 gap-0'>
              <SheetHeader>
                <SheetTitle lang='zh-CN'>{props.section.title}</SheetTitle>
              </SheetHeader>
              <div className='overflow-y-auto px-4 pb-8'>
                <DocsSidebarNav
                  section={props.section}
                  activeSlug={props.activeSlug}
                  onNavigate={() => setMenuOpen(false)}
                />
              </div>
            </SheetContent>
          </Sheet>
          {props.children}
        </div>

        {props.aside && (
          <aside className='hidden xl:block'>
            <div className='sticky top-20 max-h-[calc(100svh-6rem)] overflow-y-auto py-10'>
              {props.aside}
            </div>
          </aside>
        )}
      </div>
    </PublicLayout>
  )
}
