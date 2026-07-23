import * as React from 'react'
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useHover,
  useFocus,
  useDismiss,
  useRole,
  useInteractions
} from '@floating-ui/react'
import type { TooltipOptions } from './TooltipProps'

export interface UseTooltipReturn {
  open: boolean
  setOpen: (_open: boolean) => void
  refs: any
  floatingStyles: React.CSSProperties
  getFloatingProps: any
  getReferenceProps: any
  context: any
}

export function useTooltip ({
  initialOpen = false,
  placement = 'top',
  open: controlledOpen,
  onOpenChange
}: TooltipOptions = {}): UseTooltipReturn {
  const [ uncontrolledOpen, setUncontrolledOpen ] = React.useState(initialOpen)

  const open = controlledOpen ?? uncontrolledOpen
  const setOpen = onOpenChange ?? setUncontrolledOpen

  const data = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(5),
      flip({
        crossAxis: placement.includes('-'),
        fallbackAxisSideDirection: 'start',
        padding: 5
      }),
      shift({ padding: 5 })
    ],
    strategy: 'fixed',

  })

  const context = data.context

  const hover = useHover(context, {
    move: false,
    enabled: controlledOpen == null
  })
  const focus = useFocus(context, {
    enabled: controlledOpen == null
  })
  const dismiss = useDismiss(context)
  const role = useRole(context, { role: 'tooltip' })

  const interactions = useInteractions([ hover, focus, dismiss, role ])

  return React.useMemo(
    () => ({
      open,
      setOpen,
      ...interactions,
      ...data
    }),
    [ open, setOpen, interactions, data ]
  )
}
