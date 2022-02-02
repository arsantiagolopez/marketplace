import { ethers } from "hardhat";

// Deploy contracts
async function main() {
  const Marketplace = await ethers.getContractFactory("Tri");
  const marketplace = await Marketplace.deploy();
  await marketplace.deployed();
  console.log("Marketplace contract deployed to: ", marketplace.address);

  const Token = await ethers.getContractFactory("Tri");
  const token = await Token.deploy();
  await token.deployed();
  console.log("Token contract deployed to: ", token.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
