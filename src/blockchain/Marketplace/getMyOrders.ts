import { BigNumber, Contract, ethers } from "ethers";
import Marketplace from "../../../artifacts/contracts/Marketplace.sol/Marketplace.json";
import { MARKETPLACE_ADDRESS } from "../../../config";
import { OrderEntity } from "../../types";
import { readIPFSField } from "../../utils/readIPFSField";
import { getListingById } from "./getListingById";

/**
 * Get all my orders. Including both purchases and sales.
 * @returns an array of orders.
 */
const getMyOrders = async (ethRate: string): Promise<OrderEntity[]> => {
  let orders: OrderEntity[] = [];

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const account = await window.ethereum.request({ method: "eth_accounts" });
  const signer = provider.getSigner(account[0]);

  const marketplaceContract: Contract = new ethers.Contract(
    MARKETPLACE_ADDRESS,
    Marketplace.abi,
    signer
  );

  const data = await marketplaceContract.getMyOrders();

  if (!data.length) {
    return orders;
  }

  for await (const order of data) {
    let [orderId, invoice, seller, buyer, listingIds, itemIds] = order;

    // Convert listingIds to readable
    listingIds = listingIds.map((id: BigNumber) => id.toNumber());

    // Convert itemIds to readable
    itemIds = itemIds.map((id: BigNumber) => id.toNumber());

    // Convert values to readable
    orderId = orderId.toNumber();
    invoice = ethers.utils.formatUnits(String(invoice), "ether");

    // Get name & image off first listing in order
    const { token } = (await getListingById(listingIds[0], ethRate)) || {};

    // Read values from IPFS metadata
    const name = await readIPFSField({
      cid: token?.tokenHash!,
      property: "name",
    });
    const image = await readIPFSField({
      cid: token?.tokenHash!,
      property: "image",
    });

    const newOrder: OrderEntity = {
      orderId,
      invoice,
      seller,
      buyer,
      listingIds,
      itemIds,
      name,
      image,
    };

    orders.push(newOrder);
  }

  return orders;
};

export { getMyOrders };
