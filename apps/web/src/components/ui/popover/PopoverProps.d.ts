import type { Placement } from '@floating-ui/react'
import type React from 'react'

export type PopoverTriggerMode = 'click' | 'hover'

export interface PopoverOptions {
  initialOpen?: boolean
  placement?: Placement
  modal?: boolean
  open?: boolean
  onOpenChange?: (_open: boolean) => void
  trigger?: PopoverTriggerMode
}

export interface PopoverProps extends PopoverOptions {
  children: React.ReactNode
}
