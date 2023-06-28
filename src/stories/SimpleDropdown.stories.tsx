import type { Meta, StoryObj } from "@storybook/react";
import { SimpleDropDown } from "~/components/Tools";

const meta: Meta<typeof SimpleDropDown> = {
  title: "FormToolBar/SimpleDropDown",
  component: SimpleDropDown,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SimpleDropDown>;

export const Primary: Story = {
  args: { dispatchData: (e) => console.log(e) },
};
