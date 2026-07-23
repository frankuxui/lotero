import * as React from 'react'
import { usePopoverContext } from './popoverContext'

interface PopoverCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: (_event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const PopoverClose = React.forwardRef<
  HTMLButtonElement,
  PopoverCloseProps
>(function PopoverClose (props, ref) {
  const { setOpen } = usePopoverContext()
  const { onClick, ...restProps } = props

  return (
    <button
      type="button"
      ref={ref}
      {...restProps}
      onClick={(e) => {
        onClick?.(e)
        setOpen(false)
      }}
    />
  )
})
