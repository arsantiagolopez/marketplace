import {
  Contract,
  ContractReceipt,
  ContractTransaction,
  ethers,
  Event,
} from "ethers";
import { Result } from "ethers/lib/utils";
import Marketplace from "../../../artifacts/contracts/Marketplace.sol/Marketplace.json";
import { MARKETPLACE_ADDRESS } from "../../../config";
import { ItemEntity, ListingEntity, OrderEntity } from "../../types";

interface Props {
  /* Listings array */
  listings: ListingEntity[];
  /* Items array */
  items?: ItemEntity[];
  /* Total price to pay seller */
  total: number;
}

const createOrder = async ({
  listings,
  items,
  total,
}: Props): Promise<OrderEntity> => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const account = await window.ethereum.request({ method: "eth_accounts" });
  const signer = provider.getSigner(account[0]);

  // Convert total BigNumber to wei value
  const weiTotal = ethers.utils.parseUnits(String(total), "ether");

  // Get id values from listings & items
  const listingIds = listings.map(({ listingId }) => listingId);
  const itemIds = items ? items.map(({ itemId }) => itemId) : [];

  // Create listing from marketplace contract
  const marketplaceContract: Contract = new ethers.Contract(
    MARKETPLACE_ADDRESS,
    Marketplace.abi,
    signer
  );
  const transaction: ContractTransaction =
    await marketplaceContract.createOrder(listingIds, itemIds, {
      value: weiTotal,
    });
  const receipt: ContractReceipt = await transaction.wait();

  // Get values from created listing
  const event: Event | undefined = receipt.events?.find(
    ({ event }) => event === "OrderCreated"
  );

  let [orderId, _, seller, buyer]: Result = event?.args as OrderEntity[];

  // Convert values to readable
  orderId = orderId.toNumber();

  const order: OrderEntity = {
    orderId,
    invoice: String(total),
    seller,
    buyer,
    listingIds,
    itemIds: itemIds ?? undefined,
  };

  console.log("* completed order: ", order);

  return order;
};

export { createOrder };
