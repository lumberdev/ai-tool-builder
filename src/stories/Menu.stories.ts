import type { Meta, StoryObj } from "@storybook/react";
import { Menu } from "~/components/menu";

const meta: Meta<typeof Menu> = {
  title: "Design/Menu",
  component: Menu,
  tags: ["autodocs"],
  argTypes: {
    backgroundColor: {
      control: "color",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Menu>;

export const Primary: Story = {
  args: {
    menuItems: [
      { title: "example", action: () => {}, show: true },
      { title: "else", action: () => {}, show: true },
      { title: "run", action: () => {}, show: true },
    ],
  },
};
