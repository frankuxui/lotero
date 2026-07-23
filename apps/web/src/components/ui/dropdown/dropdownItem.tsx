import * as React from "react";
import { useDropdownContext } from "./dropdownContext";

type ClickHandler = React.MouseEventHandler<HTMLElement>;

type WithCommon = {
  className?: string;
  onClick?: ClickHandler;
};

export type DropdownItemProps<T extends WithCommon = WithCommon> = {
  children: React.ReactElement<T>;
} & Partial<T>;

export function DropdownItem<T extends WithCommon = WithCommon>({ children, ...rest }: DropdownItemProps<T>) {
  const ctx = useDropdownContext();
  const { setIsOpen } = ctx;

  const composedOnClick: ClickHandler = (ev) => {
    children.props.onClick?.(ev as unknown as React.MouseEvent<HTMLElement, MouseEvent>);
    (rest.onClick as ClickHandler | undefined)?.(ev);
    setIsOpen(false);
  };

  const mergedClass = [children.props.className, rest.className].filter(Boolean).join(" ") || undefined;

  return React.cloneElement(children, {
    ...(children.props as T),
    ...(rest as unknown as T),
    className: mergedClass,
    onClick: composedOnClick,
    "data-dropdown-item": "true"
  });
}
