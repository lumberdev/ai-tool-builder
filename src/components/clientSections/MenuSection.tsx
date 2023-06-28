"use client";

import { Menu } from "~/components/menu";
import { KeyboardAdjustedComponent } from "../utilComponents/keyboardDetector";
import { useContextMenuStoreData } from "~/store/hooks";

export const MenuSection = () => {
  const { menuActions } = useContextMenuStoreData();

  return (
    <KeyboardAdjustedComponent>
      <Menu menuItems={menuActions} backgroundColor="red" />
    </KeyboardAdjustedComponent>
  );
};
