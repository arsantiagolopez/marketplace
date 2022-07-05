import { Contract, ethers } from "ethers";
import Marketplace from "../../../artifacts/contracts/Marketplace.sol/Marketplace.json";
import { MARKETPLACE_ADDRESS } from "../../../config";
import { ListingEntity } from "../../types";
import { readIPFSField } from "../../utils/readIPFSField";
import { usePrices } from "../../utils/usePrices";

/**
 * Get all listings in the Marketplace.
 * @returns an array of listings.
 */
const getAllListings = async (ethRate: string): Promise<ListingEntity[]> => {
  let listings: ListingEntity[] = [];

  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const marketplaceContract: Contract = new ethers.Contract(
    MARKETPLACE_ADDRESS,
    Marketplace.abi,
    provider
  );

  const data = await marketplaceContract.getAllListings();

  if (!data.length) {
    return listings;
  }

  if (data[0].token.seller === "0x0000000000000000000000000000000000000000") {
    return listings;
  }

  for await (const listing of data) {
    let [listingId, token, isActive] = listing;
    let [tokenId, tokenContract, tokenHash, price, seller] = token;

    // Convert values to readable
    listingId = listingId.toNumber();
    tokenId = tokenId.toNumber();
    price = ethers.utils.formatUnits(String(price), "ether");

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

    // Get itemIds from each listing
    const itemIdsData = await marketplaceContract.getListingItemIdsById(
      listingId
    );

    let itemIds: number[] = [];

    for (let itemId of itemIdsData) {
      itemId = itemId.toNumber();
      itemIds.push(itemId);
    }

    const newListing: ListingEntity = {
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
    };

    listings.push(newListing);
  }

  return listings;
};

export { getAllListings };
