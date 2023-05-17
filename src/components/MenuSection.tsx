"use client";

import { Menu } from "~/storybook-components";
import { KeyboardAdjustedComponent } from "./keyboardDetector";
import { useContextMenuStoreData } from "~/store/hooks";

export const MenuSection = () => {
  const { menuActions } = useContextMenuStoreData();

  return (
    <KeyboardAdjustedComponent>
      <Menu menuItems={menuActions} backgroundColor="red" />
    </KeyboardAdjustedComponent>
  );
};
