import * as React from 'react'
import type { UseTooltipReturn } from './useTooltip'

export const TooltipContext = React.createContext<UseTooltipReturn | null>(null)

export function useTooltipContext () {
  const ctx = React.useContext(TooltipContext)
  if (!ctx) {
    throw new Error('Tooltip components must be wrapped in <Tooltip />')
  }
  return ctx
}
