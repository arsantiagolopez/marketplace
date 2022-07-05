import { Contract, ethers } from "ethers";
import Marketplace from "../../../artifacts/contracts/Marketplace.sol/Marketplace.json";
import { MARKETPLACE_ADDRESS } from "../../../config";
import { ListingEntity } from "../../types";
import { readIPFSField } from "../../utils/readIPFSField";
import { usePrices } from "../../utils/usePrices";

/**
 * Get listing by ID.
 * @returns a listing entity.
 */
const getListingById = async (
  id: number,
  ethRate: string
): Promise<ListingEntity | undefined> => {
  let listing: ListingEntity | undefined;

  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const marketplaceContract: Contract = new ethers.Contract(
    MARKETPLACE_ADDRESS,
    Marketplace.abi,
    provider
  );

  const data = await marketplaceContract.listings(id);
  const itemIdsData = await marketplaceContract.getListingItemIdsById(id);

  let [listingId, token, isActive] = data;
  let [tokenId, tokenContract, tokenHash, price, seller] = token;

  // Return undefined if listing doesn't exist
  if (seller === "0x0000000000000000000000000000000000000000") {
    return undefined;
  }

  // Convert values to readable
  listingId = listingId.toNumber();
  tokenId = tokenId.toNumber();
  price = ethers.utils.formatUnits(String(price), "ether");

  let itemIds: number[] = [];

  for (let itemId of itemIdsData) {
    itemId = itemId.toNumber();
    itemIds.push(itemId);
  }

  // Read values from IPFS metadata
  const name = await readIPFSField({ cid: tokenHash, property: "name" });
  const image = await readIPFSField({ cid: tokenHash, property: "image" });
  const description = await readIPFSField({
    cid: tokenHash,
    property: "description",
  });

  // Convert price to PricesEntity
  const { convertPrice } = usePrices({ ethRate: ethRate! });

  const prices = {
    eth: price,
    usd: convertPrice(price, "USD"),
  };

  listing = {
    listingId,
    name,
    image,
    description,
    token: {
      tokenId,
      tokenContract,
      tokenHash,
      prices,
      seller,
    },
    isActive,
    itemIds,
  } as ListingEntity;

  return listing;
};

export { getListingById };
