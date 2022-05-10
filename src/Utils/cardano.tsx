import Loader from "./loader";

const L = Loader;
export const fromHex = (hex: string) => Buffer.from(hex, "hex");

export const getBench32FromHex = async (hexWallet: string): Promise<string> => {
  await L.load();
  const cardanoAddress = L.Cardano.Address.from_bytes(fromHex(hexWallet));
  return cardanoAddress.to_bech32();
};

export const getStakeAddress = async (hexWallet: string): Promise<string> => {
  /**
   * This next block gets the spending address and finds
   * the stake address that is the one used by
   * blockfrost to find the assets in the wallet
   */

  await L.load();
  const cardanoAddress = L.Cardano.Address.from_bytes(fromHex(hexWallet));
  const baseAddress = L.Cardano.BaseAddress.from_address(cardanoAddress);
  const stakeCred = baseAddress.stake_cred();
  const rewardAddressBytes = new Uint8Array(29);
  rewardAddressBytes.set([0xe1], 0);
  rewardAddressBytes.set(stakeCred.to_bytes().slice(4, 32), 1);
  const rAddress = L.Cardano.Address.from_bytes(rewardAddressBytes);
  const rewardAddress = L.Cardano.RewardAddress.from_address(rAddress);
  const bech32RewardAddress = rewardAddress.to_address().to_bech32();
  return bech32RewardAddress;
};
