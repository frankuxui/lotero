import { TooltipContext } from './tooltipContext'
import { useTooltip } from './useTooltip'
import type { TooltipProps } from './TooltipProps'
import { TooltipTrigger } from './tooltipTrigger'
import { TooltipContent } from './tooltipContent'

export function Tooltip ({ children, ...options }: TooltipProps) {
  const tooltip = useTooltip(options)

  return (
    <TooltipContext.Provider value={tooltip}>
      {children}
    </TooltipContext.Provider>
  )
}

Tooltip.displayName = 'Tooltip'

Tooltip.Trigger = TooltipTrigger
Tooltip.Content = TooltipContent
