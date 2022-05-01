import WalletSelector from "./WalletSelector";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { CheckIcon } from "@heroicons/react/solid";
import Loading from "../Loading";

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

const Template = (args: any) => {
  const loading = <Loading size="sm" />;
  const selectedIcon = <CheckIcon width={20} />;
  const dropdownIcon = <ChevronDownIcon />;

  return (
    <WalletSelector
      loading={loading}
      selectedIcon={selectedIcon}
      dropdownIcon={dropdownIcon}
      {...args}
    />
  );
};
export const Wallet = Template.bind({});
