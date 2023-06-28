import type { Meta, StoryObj } from "@storybook/react";
import { SimpleInput } from "~/components/Tools";

const meta: Meta<typeof SimpleInput> = {
  title: "FormToolBar/SimpleInput",
  component: SimpleInput,
  tags: ["autodocs"],
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof SimpleInput>;

export const Primary: Story = {
  args: { dispatchData: (e) => console.log(e) },
};
