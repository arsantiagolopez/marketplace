import { Contract, ethers } from "ethers";
import ERC1155Token from "../../../artifacts/contracts/ERC1155Token.sol/ERC1155Token.json";
import { TOKEN_ADDRESS } from "../../../config";

interface Props {
  id: number;
  address?: string;
}

/**
 * Get amount of tokens in posession.
 * @param id Listing ID.
 * @returns a number of the quantity of token available.
 */
const getBalanceOfTokenById = async ({
  id,
  address,
}: Props): Promise<number> => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const walletAddress = await signer.getAddress();

  const tokenContract: Contract = new ethers.Contract(
    TOKEN_ADDRESS,
    ERC1155Token.abi,
    provider
  );

  // Get passed address's quantity or my address
  const quantity = await tokenContract.balanceOf(
    address ? address : walletAddress,
    id
  );

  // Convert BigNumber to int
  return quantity.toNumber();
};

export { getBalanceOfTokenById };
