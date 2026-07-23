import * as React from 'react'
import { useId } from '@floating-ui/react'
import { usePopoverContext } from './popoverContext'

export const PopoverHeading = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLProps<HTMLHeadingElement>
>(function PopoverHeading (props, ref) {
  const { setLabelId } = usePopoverContext()
  const id = useId()

  React.useLayoutEffect(() => {
    setLabelId(id)
    return () => setLabelId(undefined)
  }, [ id, setLabelId ])

  return <h2 ref={ref} id={id} {...props} />
})
