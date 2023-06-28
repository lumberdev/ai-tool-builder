"use client";
type MenuButtonProps = {
  label: string;
  handleClick: (args: any) => any;
  backgroundColor: string;
  color: string;
  radius?: number;
};

export const MenuButton = ({
  label,
  handleClick,
  backgroundColor,
  color,
  radius,
}: MenuButtonProps) => {
  return (
    <button
      type="button"
      className="p-2 focus:outline-none focus:ring focus:ring-violet-300 active:!bg-gray-700"
      style={{
        backgroundColor: backgroundColor,
        color: color,
        borderRadius: `${radius}px`,
      }}
      onClick={handleClick}
    >
      {label}
    </button>
  );
};
