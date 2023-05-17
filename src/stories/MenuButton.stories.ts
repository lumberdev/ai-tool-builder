import type { Meta, StoryObj } from "@storybook/react";
import { MenuButton } from "~/storybook-components";

const meta: Meta<typeof MenuButton> = {
  title: "Design/MenuButton",
  component: MenuButton,
  tags: ["autodocs"],
  argTypes: {
    backgroundColor: {
      control: "color",
    },
    color: {
      control: "color",
    },
  },
};

export default meta;
type Story = StoryObj<typeof MenuButton>;

export const Primary: Story = {
  args: {
    label: "Button",
    radius: 8,
  },
};
