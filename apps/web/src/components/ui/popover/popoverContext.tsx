import * as React from 'react'
import type { UsePopoverReturn } from './usePopover'

export const PopoverContext = React.createContext<UsePopoverReturn | null>(null)

export function usePopoverContext () {
  const ctx = React.useContext(PopoverContext)
  if (!ctx) {
    throw new Error('Popover components must be wrapped in <Popover />')
  }
  return ctx
}
