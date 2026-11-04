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
import { ArrowRight, FileQuestion } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { CopyButton } from '@/components/copy-button'
import { EmptyState } from '@/components/empty-state'
import { PageHero, PublicLayout } from '@/components/layout'
import { Button } from '@/components/ui/button'

import { DocsArticle } from './components/docs-article'
import { DocsPager } from './components/docs-pager'
import { DocsShell } from './components/docs-shell'
import { DocsToc } from './components/docs-toc'
import { DOCS_FEATURED_TOOLS, DOCS_HOME_PAGE, DOCS_SECTIONS } from './constants'
import { useDocsVars } from './hooks/use-docs-vars'
import { flattenDocs, locateDocsPage, normalizeDocsSlug } from './lib/docs-nav'
import type { DocsHeading } from './types'

const DOCS_PAGE_COUNT = flattenDocs(DOCS_SECTIONS).length

function ignoreHeadings() {}

function BaseUrlCard() {
  const { t } = useTranslation()
  const vars = useDocsVars()
  const rows = [
    { label: 'Anthropic', value: vars.baseUrl },
    { label: 'OpenAI', value: `${vars.baseUrl}/v1` },
  ]

  return (
    <div className='omni-glass rounded-xl p-5'>
      <p className='omni-mono-label text-muted-foreground'>{t('Base URL')}</p>
      <dl className='mt-3 divide-y divide-[var(--omni-ul)]'>
        {rows.map((row) => (
          <div key={row.label} className='flex items-center gap-3 py-2.5'>
            <dt className='omni-mono-label text-muted-foreground w-20 shrink-0'>
              {row.label}
            </dt>
            <dd className='min-w-0 flex-1 truncate font-mono text-sm'>
              {row.value}
            </dd>
            <CopyButton value={row.value} size='sm' className='size-7' />
          </div>
        ))}
      </dl>
      <div className='mt-4 flex flex-wrap gap-2'>
        <Button render={<Link to='/docs/$' params={{ _splat: 'guide' }} />}>
          {t('Quick start')}
          <ArrowRight />
        </Button>
        <Button
          variant='outline'
          render={<Link to='/docs/$' params={{ _splat: 'api' }} />}
        >
          {t('API reference')}
        </Button>
      </div>
    </div>
  )
}

/** /docs: entry page with the section map and tool shortcuts. */
export function DocsHome() {
  const { t } = useTranslation()
  const vars = useDocsVars()

  return (
    <PublicLayout showMainContainer={false}>
      <PageHero
        eyebrow={t('Docs')}
        meta={t('{{count}} pages', { count: DOCS_PAGE_COUNT })}
        title={
          <>
            {vars.siteName} <span className='omni-serif'>Docs</span>
          </>
        }
        description={t(
          'Set up your account, connect coding tools and call the API: everything you need to start building.'
        )}
        aside={<BaseUrlCard />}
      />

      <div className='mx-auto w-full max-w-[1280px] px-4 py-14 sm:px-6 xl:px-8'>
        <div
          lang='zh-CN'
          className='border-border/60 grid border-t sm:grid-cols-2 lg:grid-cols-4'
        >
          {DOCS_SECTIONS.map((section, index) => (
            <Link
              key={section.id}
              to='/docs/$'
              params={{ _splat: section.groups[0].pages[0].slug }}
              className='group border-border/60 hover:bg-muted/40 flex flex-col gap-3 border-b px-1 py-6 transition-colors sm:px-5 sm:odd:border-r lg:border-r lg:last:border-r-0'
            >
              <span className='omni-mono-label text-muted-foreground'>
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className='flex items-center gap-2 text-lg font-semibold'>
                {section.title}
                <ArrowRight className='text-primary size-4 opacity-0 transition-opacity group-hover:opacity-100' />
              </span>
              <span className='text-muted-foreground text-sm leading-relaxed'>
                {section.description}
              </span>
            </Link>
          ))}
        </div>

        <div className='mt-14'>
          <p className='omni-eyebrow'>
            <span className='omni-dot' />
            <b>{t('Supported tools')}</b>
          </p>
          <div className='mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7'>
            {DOCS_FEATURED_TOOLS.map((tool) => (
              <Link
                key={tool.slug}
                to='/docs/$'
                params={{ _splat: tool.slug }}
                className='border-border/60 hover:border-primary/70 flex flex-col gap-1 rounded-lg border px-4 py-3.5 transition-colors'
              >
                <span className='text-sm font-medium'>{tool.name}</span>
                <span className='omni-mono-label text-muted-foreground'>
                  {tool.kind}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className='mt-14 max-w-3xl'>
          <DocsArticle
            page={DOCS_HOME_PAGE}
            onHeadingsChange={ignoreHeadings}
          />
        </div>
      </div>
    </PublicLayout>
  )
}

type DocsPageViewProps = {
  splat?: string
}

/** /docs/<slug>: one documentation page inside the docs shell. */
export function DocsPageView(props: DocsPageViewProps) {
  const { t } = useTranslation()
  const [headings, setHeadings] = useState<DocsHeading[]>([])
  const location = locateDocsPage(DOCS_SECTIONS, normalizeDocsSlug(props.splat))

  if (!location) {
    return (
      <PublicLayout showMainContainer={false}>
        <div className='mx-auto w-full max-w-[1280px] px-4 pt-32 pb-24 sm:px-6 xl:px-8'>
          <EmptyState
            icon={FileQuestion}
            title={t('Page not found')}
            action={
              <Button variant='outline' render={<Link to='/docs' />}>
                {t('Back to docs')}
              </Button>
            }
          />
        </div>
      </PublicLayout>
    )
  }

  const entry = location.entry

  return (
    <DocsShell
      section={entry.section}
      activeSlug={entry.page.slug}
      aside={<DocsToc headings={headings} />}
    >
      <article>
        <header lang='zh-CN' className='mb-8'>
          <p className='omni-mono-label text-muted-foreground'>
            {entry.section.title}
            {entry.group.title && ` · ${entry.group.title}`}
          </p>
          <h1 className='omni-display mt-3 text-[clamp(2rem,4vw,2.75rem)]'>
            {entry.page.title}
          </h1>
        </header>
        <DocsArticle
          key={entry.page.slug}
          page={entry.page}
          onHeadingsChange={setHeadings}
        />
        <DocsPager previous={location.previous} next={location.next} />
      </article>
    </DocsShell>
  )
}
