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

import { BrandBackdrop } from '@/components/layout'
import { cn } from '@/lib/utils'

type ErrorLayoutProps = {
  /** HTTP-style status shown as the display numeral. */
  code?: ReactNode
  title: ReactNode
  description?: ReactNode
  /** Action buttons. */
  children?: ReactNode
  className?: string
}

/** Full-viewport error surface on the shared brand backdrop. */
export function ErrorLayout(props: ErrorLayoutProps) {
  return (
    <div
      className={cn(
        'bg-background relative isolate h-svh w-full overflow-hidden',
        props.className
      )}
    >
      <BrandBackdrop variant='center' />
      <div className='relative m-auto flex h-full w-full max-w-xl flex-col items-center justify-center gap-3 px-6 text-center'>
        {props.code !== undefined && (
          <h1 className='omni-serif omni-rise text-[clamp(7rem,22vw,12rem)] leading-[0.85]'>
            {props.code}
          </h1>
        )}
        <p
          data-delay='1'
          className='omni-rise mt-2 text-xl font-medium tracking-tight sm:text-2xl'
        >
          {props.title}
        </p>
        {props.description && (
          <div
            data-delay='2'
            className='omni-rise text-muted-foreground text-sm leading-relaxed sm:text-base'
          >
            {props.description}
          </div>
        )}
        {props.children && (
          <div
            data-delay='3'
            className='omni-rise mt-6 flex flex-wrap justify-center gap-3'
          >
            {props.children}
          </div>
        )}
      </div>
    </div>
  )
}
