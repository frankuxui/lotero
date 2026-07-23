import * as React from "react";
import { DropdownProvider } from "./dropdownProvider";
import { DropdownTrigger } from "./dropdownTrigger";
import { DropdownContent } from "./dropdownContent";
import { DropdownClose } from "./dropdownClose";
import { DropdownItem } from "./dropdownItem";

export function Dropdown({ children }: { children: React.ReactNode }) {
  return <DropdownProvider>{children}</DropdownProvider>;
}

Dropdown.Trigger = DropdownTrigger;
Dropdown.Content = DropdownContent;
Dropdown.Close = DropdownClose;
Dropdown.Item = DropdownItem;
