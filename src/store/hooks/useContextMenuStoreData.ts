import { useContextMenuStore } from "..";

export const useContextMenuStoreData = () => {
  const { changeCurrentSelection, menuContext, changeContext, ...rest } =
    useContextMenuStore();
  const handleChangeCurrentSelection = (
    arg: string,
    ind0: number,
    ind1: number,
    nodeBlockIndex: number
  ) => {
    const start = ind0 <= ind1 ? ind0 : ind1;
    const end = start === ind0 ? ind1 : ind0;
    if (arg.length > 0) {
      changeContext("promptBuilderSwap");
    } else {
      changeContext("promptBuilderAdd");
    }
    changeCurrentSelection(arg, start, end, nodeBlockIndex);
  };
  return { menuContext, changeContext, handleChangeCurrentSelection, ...rest };
};
