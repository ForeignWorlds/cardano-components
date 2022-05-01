import WalletSelector from "./WalletSelector";

export default {
  title: "Components/WalletSelector",
  component: WalletSelector,
  parameters: {
    docs: {
      description: {
        component: "A wallet selector with default icons",
      },
    },
  },
  args: {
    type: "primary",
  },
};

const Template = (args: any) => <WalletSelector {...args} />;
export const Wallet = Template.bind({});
