import type { Placement } from '@floating-ui/react'
import type React from 'react'

export type TooltipPlacement = Placement

export interface TooltipOptions {
  initialOpen?: boolean
  placement?: Placement
  open?: boolean
  onOpenChange?: (_open: boolean) => void
}

export interface TooltipProps extends TooltipOptions {
  children: React.ReactNode
}
