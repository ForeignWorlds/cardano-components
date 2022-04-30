import { useContext } from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  Button,
  MenuItem,
  Image,
  Flex,
} from "@chakra-ui/react";
import { WalletContext } from "../Context/walletContext";

type CardanoAPI = {
  [key: string]: unknown;
};

type Props = {
  loading: React.ReactNode;
  selectedIcon: React.ReactNode;
  dropdownIcon: React.ReactNode;
};

declare global {
  interface Window {
    cardano: {
      [key: string]: {
        enable: () => Promise<CardanoAPI>;
        name: string;
        icon: string;
        isEnabled: () => Promise<boolean>;
      };
    };
  }
}

const WalletSelector = ({
  loading,
  selectedIcon,
  dropdownIcon,
  ...rest
}: Props) => {
  const { isLoading, walletsState, selectDefaultWallet, selectedWallet } =
    useContext(WalletContext);

  return (
    <Flex {...rest}>
      <Menu>
        <MenuButton as={Button} rightIcon={dropdownIcon}>
          {isLoading ? (
            loading
          ) : selectedWallet && walletsState[selectedWallet] ? (
            <Flex flexDirection={"row"} alignItems={"center"}>
              <Image
                boxSize="2rem"
                borderRadius="full"
                src={walletsState[selectedWallet].icon}
                alt={walletsState[selectedWallet].name}
                mr="12px"
              />
              <span>Connected</span>
            </Flex>
          ) : (
            "Connect your Wallet"
          )}
        </MenuButton>
        <MenuList>
          {Object.keys(walletsState).map((walletName) => (
            <MenuItem
              minH="48px"
              key={walletsState[walletName].name}
              onClick={() => selectDefaultWallet(walletName)}
            >
              <Image
                boxSize="2rem"
                borderRadius="full"
                src={walletsState[walletName].icon}
                alt={walletsState[walletName].name}
                mr="12px"
              />
              {walletsState[walletName].isEnabled ? (
                <>
                  <span> {walletsState[walletName].name} Connected</span>
                  {selectedWallet === walletName && selectedIcon}
                </>
              ) : (
                <span>Connect {walletsState[walletName].name}</span>
              )}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Flex>
  );
};

export default WalletSelector;
