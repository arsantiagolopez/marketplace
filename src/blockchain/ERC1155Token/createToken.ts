import { JsonRpcSigner } from "@ethersproject/providers";
import {
  Contract,
  ContractReceipt,
  ContractTransaction,
  ethers,
  Event,
} from "ethers";
import { Result } from "ethers/lib/utils";
import ERC1155Token from "../../../artifacts/contracts/ERC1155Token.sol/ERC1155Token.json";
import { TOKEN_ADDRESS } from "../../../config";

interface CreateTokenProps {
  signer: JsonRpcSigner;
  tokenURI: string;
  quantity: number;
}

/**
 * Create an ERC1155 token of given URI and quantity.
 * @param signer Ethers Web3Provider signer.
 * @param tokenURI Name identifier of the token to create.
 * @param quantity Initial quantity of token.
 * @returns a number value of the created token ID.
 */
const createToken = async ({
  signer,
  tokenURI,
  quantity,
}: CreateTokenProps): Promise<number> => {
  const tokenContract: Contract = new ethers.Contract(
    TOKEN_ADDRESS,
    ERC1155Token.abi,
    signer
  );
  const transaction: ContractTransaction = await tokenContract.createToken(
    tokenURI,
    quantity
  );
  const receipt: ContractReceipt = await transaction.wait();

  // Get token's ID from created token
  const event: Event | undefined = receipt.events?.find(
    ({ event }) => event === "TokenCreated"
  );
  const value: Result = event?.args && event.args[0];
  const tokenId: number = value.toNumber();

  return tokenId;
};

export { createToken };
