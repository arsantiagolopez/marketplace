import { Contract, ethers } from "ethers";
import Marketplace from "../../../artifacts/contracts/Marketplace.sol/Marketplace.json";
import { MARKETPLACE_ADDRESS } from "../../../config";
import { ListingEntity } from "../../types";
import { readIPFSField } from "../../utils/readIPFSField";
import { usePrices } from "../../utils/usePrices";

/**
 * Get all my listings.
 * @returns an array of listings.
 */
const getMyListings = async (ethRate: string): Promise<ListingEntity[]> => {
  let listings: ListingEntity[] = [];

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const account = await window.ethereum.request({ method: "eth_accounts" });
  const signer = provider.getSigner(account[0]);

  const marketplaceContract: Contract = new ethers.Contract(
    MARKETPLACE_ADDRESS,
    Marketplace.abi,
    signer
  );

  const data = await marketplaceContract.getMyListings();

  if (!data.length) {
    return listings;
  }

  for (const listing of data) {
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

  console.log(listings);

  return listings;
};

export { getMyListings };
