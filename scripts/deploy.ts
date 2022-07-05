import fs from "fs";
import { ethers, network } from "hardhat";
import { ERC1155Token, Marketplace } from "../typechain";

// Deploy contracts
const main = async () => {
  // This is just a convenience check
  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which gets automatically created and destroyed every time. Use the Hardhat option '--network localhost'"
    );
  }

  let marketplace: Marketplace;
  let token: ERC1155Token;

  const Marketplace = await ethers.getContractFactory("Marketplace");
  marketplace = await Marketplace.deploy();
  await marketplace.deployed();
  console.log("Marketplace contract deployed to: ", marketplace.address);

  const Token = await ethers.getContractFactory("ERC1155Token");
  token = await Token.deploy(marketplace.address);
  await token.deployed();
  console.log("Token contract deployed to: ", token.address);

  const config = `
  export const MARKETPLACE_ADDRESS = "${marketplace.address}"
  export const TOKEN_ADDRESS = "${token.address}"
  `;

  // Create config file with addresses
  const data = JSON.stringify(config);
  fs.writeFileSync("config.js", JSON.parse(data));
};

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
