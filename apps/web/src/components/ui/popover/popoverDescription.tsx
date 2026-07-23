import * as React from 'react'
import { useId } from '@floating-ui/react'
import { usePopoverContext } from './popoverContext'

export const PopoverDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLProps<HTMLParagraphElement>
>(function PopoverDescription (props, ref) {
  const { setDescriptionId } = usePopoverContext()
  const id = useId()

  React.useLayoutEffect(() => {
    setDescriptionId(id)
    return () => setDescriptionId(undefined)
  }, [ id, setDescriptionId ])

  return <p ref={ref} id={id} {...props} />
})
