import { MenuButton } from "./MenuButton";

type MenuProps = {
  menuItems: Array<{
    title: string;
    action: (args: any) => any;
    show: boolean;
    color?: string;
    background?: string;
  }>;
  backgroundColor: string;
};

export const Menu = ({ menuItems, backgroundColor }: MenuProps) => {
  const MenuItems = menuItems.map(
    (item) =>
      item.show && (
        <li key={item.title}>
          <MenuButton
            label={item.title}
            handleClick={item.action}
            color={item.background ?? "black"}
            backgroundColor={item.color ?? "transparent"}
            radius={8}
          />
        </li>
      )
  );

  return (
    <div className="h-[64px] w-full px-4" style={{ backgroundColor }}>
      <ul className="flex h-full w-full items-center justify-center gap-4">
        {MenuItems}
      </ul>
    </div>
  );
};
