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
import { cn } from '@/lib/utils'

export type BrandBackdropVariant = 'page' | 'panel' | 'center'

type BrandBackdropProps = {
  variant?: BrandBackdropVariant
  className?: string
}

/**
 * Decorative brand surface shared with the custom homepage: flowing
 * gradient, hairline grid, grain and a readability veil. Place it inside a
 * `relative isolate` container; it never receives pointer events.
 */
export function BrandBackdrop(props: BrandBackdropProps) {
  return (
    <div
      aria-hidden='true'
      data-variant={props.variant ?? 'page'}
      className={cn('omni-backdrop', props.className)}
    >
      <div className='omni-flow'>
        <i className='b1' />
        <i className='b2' />
        <i className='b3' />
        <i className='b4' />
      </div>
      <div className='omni-gridtex' />
      <div className='omni-veil' />
      <div className='omni-grain' />
      <div className='omni-fade' />
    </div>
  )
}
