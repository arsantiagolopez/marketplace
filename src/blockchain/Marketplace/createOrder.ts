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
import { CartItem, OrderEntity } from "../../types";
import { readIPFSField } from "../../utils/readIPFSField";

interface Props {
  /* Array of final listings and items */
  cartItems: CartItem[];
  /* Total price to pay seller */
  total: number;
}

const createOrder = async ({
  cartItems,
  total,
}: Props): Promise<OrderEntity> => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const account = await window.ethereum.request({ method: "eth_accounts" });
  const signer = provider.getSigner(account[0]);

  // Convert total BigNumber to wei value
  const weiTotal = ethers.utils.parseUnits(String(total), "ether");

  // Get individual listings, possible duplicates
  let listingIds: number[] = [];
  let itemIds: number[] = [];

  cartItems.map(({ listing, items, quantity }) => {
    const { listingId } = listing;
    // Push quantity of listings
    listingIds.push(...Array(quantity).fill(listingId));

    for (const item of items) {
      const { itemId } = item;
      // Push quantity of items
      itemIds.push(...Array(quantity).fill(itemId));
    }
  });

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

  // Get image & name from first listing in order
  const listing = cartItems[0].listing;

  // Read values from IPFS metadata
  const name = await readIPFSField({
    cid: listing.token.tokenHash,
    property: "name",
  });
  const image = await readIPFSField({
    cid: listing.token.tokenHash,
    property: "image",
  });

  const order: OrderEntity = {
    orderId,
    invoice: String(total),
    seller,
    buyer,
    listingIds,
    itemIds: itemIds ?? undefined,
    name,
    image,
  };

  return order;
};

export { createOrder };

// @todo
