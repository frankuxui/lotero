import * as React from 'react'
import {
  FloatingPortal,
  FloatingFocusManager,
  useMergeRefs
} from '@floating-ui/react'
import { usePopoverContext } from './popoverContext'

interface PopoverContentProps extends React.HTMLProps<HTMLDivElement> {
  style?: React.CSSProperties
  className?: string
}

export const PopoverContent = React.forwardRef<
  HTMLDivElement,
  PopoverContentProps
>(function PopoverContent ({ style, ...props }, propRef) {
  const { context: floatingContext, modal, ...ctx } = usePopoverContext()
  const ref = useMergeRefs([ ctx.refs.setFloating, propRef ])

  if (!floatingContext.open) return null

  return (
    <FloatingPortal>
      <FloatingFocusManager context={floatingContext} modal={modal}>
        <div
          ref={ref}
          style={{ ...ctx.floatingStyles, ...style }}
          aria-labelledby={ctx.labelId}
          aria-describedby={ctx.descriptionId}
          {...ctx.getFloatingProps(props)}
        >
          {props.children}
        </div>
      </FloatingFocusManager>
    </FloatingPortal>
  )
})
