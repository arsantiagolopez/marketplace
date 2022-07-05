import {
  Contract,
  ContractReceipt,
  ContractTransaction,
  ethers,
  Event,
} from "ethers";
import Marketplace from "../../../artifacts/contracts/Marketplace.sol/Marketplace.json";
import { MARKETPLACE_ADDRESS } from "../../../config";

/**
 * Register user as a seller.
 * @returns a success boolean.
 */
const createSeller = async (): Promise<boolean> => {
  let success = true;

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const account = await window.ethereum.request({ method: "eth_accounts" });
  const signer = provider.getSigner(account[0]);
  const walletAddress = await signer.getAddress();

  const marketplaceContract: Contract = new ethers.Contract(
    MARKETPLACE_ADDRESS,
    Marketplace.abi,
    signer
  );

  // Check if seller already registered
  const [, isRegistered] = await marketplaceContract.sellers(walletAddress);

  if (isRegistered) {
    return success;
  }

  // Create the seller
  const transaction: ContractTransaction =
    await marketplaceContract.createSeller();
  const receipt: ContractReceipt = await transaction.wait();

  // Get emitted event from seller creation
  const event: Event | undefined = receipt.events?.find(
    ({ event }) => event === "SellerCreated"
  );
  const [, exists] = event?.args as any[];

  if (!exists) {
    success = false;
  }

  return success;
};

export { createSeller };
