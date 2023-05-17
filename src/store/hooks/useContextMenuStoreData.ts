import { useContextMenuStore } from "..";

export const useContextMenuStoreData = () => {
  const { changeCurrentSelection, menuContext, changeContext, ...rest } =
    useContextMenuStore();
  const handleChangeCurrentSelection = (arg: string) => {
    if (arg.length > 0) {
      changeContext("promptBuilderSwap");
    } else {
      changeContext("promptBuilderAdd");
    }
    changeCurrentSelection(arg);
  };
  return { menuContext, changeContext, handleChangeCurrentSelection, ...rest };
};
