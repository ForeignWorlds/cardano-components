// @ts-nocheck
import {
  createContext,
  FC,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  useCallback,
} from "react";
import { getBench32FromHex } from "./cardano";

const SELECTED_WALLET_KEY = "selectedWallet";

//Add utxos

export type WalletType = {
  isEnabled: boolean;
  windowName: string;
  name: string;
  icon: string;
  stakeAddress: string;
  address: string;
};

type WalletContextType = {
  isLoading: boolean;
  setWalletsState: Dispatch<
    SetStateAction<{
      [key: string]: WalletType;
    }>
  >;
  walletsState: { [key: string]: WalletType };
  selectDefaultWallet: (name: string) => void;
  selectedWallet: string;
  getUTXOs: () => Promise<string[]>;
  signTx: (transaction: string) => Promise<string>;
};

export const WalletContext = createContext<WalletContextType>({
  isLoading: true,
  setWalletsState: () => {},
  walletsState: {},
  selectDefaultWallet: () => {},
  getUTXOs: () => Promise.resolve(),
  signTx: (transaction: string) => Promise.resolve(),
  selectedWallet: "",
});

export const WalletProvider: FC = ({ children }) => {
  const [walletsState, setWalletsState] = useState<{
    [key: string]: WalletType;
  }>({});
  const [selectedWallet, setSelectedWallet] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const localWallet = localStorage.getItem(SELECTED_WALLET_KEY);
    setSelectedWallet(localWallet);
  }, [setSelectedWallet]);

  useEffect(() => {
    // Show the selected connected wallet
    const checkWallet = async () => {
      const connectWallet = async (
        walletName: string,
        state: { [key: string]: WalletType }
      ) => {
        if (window && window.cardano && window.cardano[walletName]) {
          const isEnabled = await window.cardano[walletName].isEnabled();

          // Set Stake Address
          let stakeAddress: string;
          let address: string;
          if (isEnabled) {
            const walletAPI = await window.cardano[walletName].enable();
            const hexWallet = (await walletAPI.getChangeAddress()) as string;
            address = await getBench32FromHex(hexWallet);
          }

          return {
            ...state,
            [walletName]: {
              isEnabled,
              windowName: walletName,
              name: window.cardano[walletName].name,
              icon: window.cardano[walletName].icon,
              stakeAddress,
              address,
            },
          };
        }
        return state;
      };
      const namiState = await connectWallet("nami", {});
      const ccVaultState = await connectWallet("ccvault", namiState);
      setWalletsState(() => ccVaultState);
      setIsLoading(false);
    };
    checkWallet();
  }, []);

  useEffect(() => {
    const localSelectedWallet = localStorage.getItem(SELECTED_WALLET_KEY);
    const isLocalSelectedEnabled =
      walletsState[localSelectedWallet] &&
      walletsState[localSelectedWallet].isEnabled;

    if (isLocalSelectedEnabled) {
      setSelectedWallet(localSelectedWallet);
    }
  }, [walletsState]);

  const selectDefaultWallet = async (walletName: string) => {
    const wallet = walletsState[walletName];
    setIsLoading(true);
    if (!wallet.isEnabled) {
      const walletAPI = await window.cardano[walletName].enable();
      if (walletAPI) {
        const hexWallet = (await walletAPI.getChangeAddress()) as string;
        const address = await getBench32FromHex(hexWallet);

        setWalletsState((currentState) => ({
          ...currentState,
          [walletName]: {
            ...walletsState[walletName],
            address: address,
            isEnabled: true,
          },
        }));
        localStorage.setItem(SELECTED_WALLET_KEY, walletName);
        setSelectedWallet(() => walletName);
      }
    } else {
      if (wallet.name !== selectedWallet) {
        localStorage.setItem(SELECTED_WALLET_KEY, walletName);
        setSelectedWallet(() => walletName);
      }
    }
    setIsLoading(false);
  };

  const getUTXOs = useCallback(async () => {
    const walletAPI = await window.cardano[selectedWallet].enable();
    const UTXOs = await walletAPI.getUtxos();
    return UTXOs;
  }, [selectedWallet]);

  const signTx = useCallback(
    async (transaction: string) => {
      try {
        const walletAPI = await window.cardano[selectedWallet].enable();
        const witnessSet = await walletAPI.signTx(transaction);
        return witnessSet;
      } catch (err) {
        throw new Error(err.message);
      }
      return UTXOs;
    },
    [selectedWallet]
  );

  return (
    <WalletContext.Provider
      value={{
        isLoading,
        setWalletsState,
        walletsState,
        selectDefaultWallet,
        selectedWallet,
        getUTXOs,
        signTx,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
