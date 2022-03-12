import {
  Contract,
  ContractReceipt,
  ContractTransaction,
  ethers,
  Event,
} from "ethers";
import { Result } from "ethers/lib/utils";
import Marketplace from "../../../artifacts/contracts/Marketplace.sol/Marketplace.json";
import { MARKETPLACE_ADDRESS, TOKEN_ADDRESS } from "../../../config";
import { ListingEntity, PricesEntity, TokenEntity } from "../../types";
import { readIPFSField } from "../../utils/readIPFSField";
import { createToken } from "../ERC1155Token";

interface Props {
  /* Price of supported currencies */
  prices: PricesEntity;
  /* Listing name */
  name: string;
  /* Initial listing stock */
  quantity: number;
  /* IPFS metadata hash */
  hash: string;
  /* Item IDs included with listing */
  itemIds: number[];
}

const createListing = async ({
  prices,
  name,
  quantity,
  hash,
  itemIds,
}: Props): Promise<ListingEntity> => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const account = await window.ethereum.request({ method: "eth_accounts" });
  const signer = provider.getSigner(account[0]);

  // Create ERC1155 Token
  const tokenId = await createToken({
    signer,
    tokenURI: name,
    quantity,
  });

  let { eth: price } = prices;

  // Max supported number of decimals is 9
  if (price.length > 11) {
    price = String(Number(price).toFixed(9));
    prices = { ...prices, eth: price };
  }

  // Convert BigNumber to wei value
  const weiPrice = ethers.utils.parseUnits(price, "ether");

  // Create listing from marketplace contract
  const marketplaceContract: Contract = new ethers.Contract(
    MARKETPLACE_ADDRESS,
    Marketplace.abi,
    signer
  );
  const transaction: ContractTransaction =
    await marketplaceContract.createListing(
      tokenId,
      TOKEN_ADDRESS,
      hash,
      weiPrice,
      itemIds
    );
  const receipt: ContractReceipt = await transaction.wait();

  // Get values from created listing
  const event: Event | undefined = receipt.events?.find(
    ({ event }) => event === "ListingCreated"
  );

  let [listingId, _, tokenContract, tokenHash, __, seller, isActive]: Result =
    event?.args as TokenEntity[];

  // Convert values to readable
  listingId = listingId.toNumber();

  // Read values from IPFS metadata
  const image = await readIPFSField({ cid: tokenHash, property: "image" });
  const description = await readIPFSField({
    cid: tokenHash,
    property: "description",
  });

  const listing: ListingEntity = {
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

  return listing;
};

export { createListing };
