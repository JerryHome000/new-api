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
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import {
  type MouseEvent,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'

import { CopyButton } from '@/components/copy-button'
import { ErrorState } from '@/components/error-state'
import { Markdown } from '@/components/ui/markdown'
import { Skeleton } from '@/components/ui/skeleton'

import { useDocsVars } from '../hooks/use-docs-vars'
import { fillDocsTemplate, slugifyHeading } from '../lib/docs-template'
import type { DocsHeading, DocsPage } from '../types'

type DocsArticleProps = {
  page: DocsPage
  onHeadingsChange: (headings: DocsHeading[]) => void
}

type CodeBlockSlot = {
  slot: HTMLElement
  code: string
}

/** Finds a heading by an anchor that may still be percent-encoded. */
function findAnchorTarget(hash: string): HTMLElement | null {
  if (!hash) return null
  try {
    return document.getElementById(decodeURIComponent(hash))
  } catch {
    return document.getElementById(hash)
  }
}

/**
 * Adds what the rendered Markdown lacks for docs reading: heading anchors,
 * a toolbar slot on every code block, and same-tab behaviour for site links.
 */
function enhanceDocsContent(root: HTMLElement) {
  const seen = new Map<string, number>()
  const headings: DocsHeading[] = []
  root.querySelectorAll<HTMLHeadingElement>('h2, h3').forEach((element) => {
    const text = element.textContent?.trim() ?? ''
    element.id = slugifyHeading(text, seen)
    headings.push({
      id: element.id,
      text,
      level: element.tagName === 'H3' ? 3 : 2,
    })
  })

  root.querySelectorAll<HTMLAnchorElement>('a[href]').forEach((link) => {
    const href = link.getAttribute('href') ?? ''
    if (href.startsWith('#') || /^\/(?!\/)/.test(href)) {
      link.removeAttribute('target')
      link.removeAttribute('rel')
    }
  })

  const codeBlocks: CodeBlockSlot[] = []
  root.querySelectorAll<HTMLPreElement>('pre').forEach((pre) => {
    const code = pre.querySelector('code')
    const language =
      [...(code?.classList ?? [])]
        .find((name) => name.startsWith('language-'))
        ?.slice('language-'.length) ?? 'text'

    const wrapper = document.createElement('div')
    wrapper.className = 'docs-code'
    const bar = document.createElement('div')
    bar.className = 'docs-code-bar'
    const label = document.createElement('span')
    label.textContent = language
    const slot = document.createElement('span')
    slot.className = 'docs-code-slot'
    bar.append(label, slot)

    pre.replaceWith(wrapper)
    wrapper.append(bar, pre)
    codeBlocks.push({ slot, code: (code ?? pre).textContent ?? '' })
  })

  return { headings, codeBlocks }
}

/** Loads one Markdown page, fills site values and renders it as docs prose. */
export function DocsArticle(props: DocsArticleProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const vars = useDocsVars()
  const containerRef = useRef<HTMLDivElement>(null)
  const [codeBlocks, setCodeBlocks] = useState<CodeBlockSlot[]>([])
  const onHeadingsChange = props.onHeadingsChange

  const query = useQuery({
    queryKey: ['docs-page', props.page.slug],
    queryFn: async () => (await props.page.load()).default,
    staleTime: Infinity,
  })

  const markdown = useMemo(
    () => (query.data ? fillDocsTemplate(query.data, vars) : ''),
    [query.data, vars]
  )

  // A stable element keeps React from re-rendering the Markdown on unrelated
  // state changes, which would reset its innerHTML and drop the enhancements.
  const content = useMemo(
    () => <Markdown className='docs-prose'>{markdown}</Markdown>,
    [markdown]
  )

  useLayoutEffect(() => {
    const root = containerRef.current
    if (!root || !markdown) {
      setCodeBlocks([])
      onHeadingsChange([])
      return
    }

    const enhanced = enhanceDocsContent(root)
    setCodeBlocks(enhanced.codeBlocks)
    onHeadingsChange(enhanced.headings)

    const target = findAnchorTarget(window.location.hash.slice(1))
    if (target) {
      target.scrollIntoView()
    } else {
      window.scrollTo({ top: 0 })
    }
  }, [markdown, onHeadingsChange])

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return
    }
    const link = (event.target as HTMLElement).closest('a')
    const href = link?.getAttribute('href')
    if (!href) return

    if (href.startsWith('#')) {
      event.preventDefault()
      findAnchorTarget(href.slice(1))?.scrollIntoView({ behavior: 'smooth' })
      window.history.replaceState(window.history.state, '', href)
      return
    }
    if (/^\/(?!\/)/.test(href)) {
      event.preventDefault()
      void navigate({ href })
    }
  }

  if (query.isPending) {
    return (
      <div className='space-y-4' aria-busy='true'>
        <Skeleton className='h-5 w-2/3' />
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-5/6' />
        <Skeleton className='h-40 w-full' />
      </div>
    )
  }

  if (query.isError) {
    return (
      <ErrorState
        title={t('Failed to load this page')}
        onRetry={() => void query.refetch()}
      />
    )
  }

  return (
    // Delegated handler for links inside the rendered Markdown.
    // oxlint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div ref={containerRef} lang='zh-CN' onClick={handleClick}>
      {content}
      {codeBlocks.map((block, index) =>
        createPortal(
          <CopyButton
            value={block.code}
            size='sm'
            className='size-7'
            iconClassName='size-3.5'
          />,
          block.slot,
          String(index)
        )
      )}
    </div>
  )
}
