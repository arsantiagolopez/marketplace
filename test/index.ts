import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { ERC1155Token, Marketplace } from "../typechain";

describe("Tri Marketplace Unit Tests", () => {
  let marketplace: Marketplace;
  let token: ERC1155Token;
  let seller: SignerWithAddress;
  let buyer: SignerWithAddress;

  before(async () => {
    // Deploy marketplace
    const Marketplace = await ethers.getContractFactory("Marketplace");
    marketplace = await Marketplace.deploy();
    await marketplace.deployed();

    // Deploy token with marketplace address
    const Token = await ethers.getContractFactory("ERC1155Token");
    token = await Token.deploy(marketplace.address);
    await token.deployed();

    // Get signers & addresses
    [seller, buyer] = await ethers.getSigners();
  });

  // beforeEach(async () => {});

  // Deployment
  describe("Deployment", () => {
    it("Should display the current version", async () => {
      expect(await marketplace.version()).to.equal(1);
    });

    it("Should create a unique tokens", async () => {
      const tokenUri = "https://www.token.com/";
      expect(await token.createToken(tokenUri))
        .to.emit(token, "TokenCreated")
        .withArgs(1, tokenUri);
    });
  });

  describe("Seller", () => {
    let tokenCount = 0;
    const testImage = "https://www.image.com/test.jpg";
    const price = ethers.utils.parseUnits("1", "ether");

    it("Should create a seller", async () => {
      expect(await marketplace.createSeller())
        .to.emit(marketplace, "SellerCreated")
        .withArgs(seller.address, true);
    });

    it("Should not allow multiple seller registration", async () => {
      // Seller has already been created above
      expect(async () => await marketplace.createSeller()).to.Throw;
    });

    it("Should create an item", async () => {
      await token.createToken(`https://www.token.com/${tokenCount}`);
      tokenCount++;

      const createItemArgs: [number, string, string, BigNumber, string] = [
        tokenCount,
        token.address,
        "Test item",
        price,
        testImage,
      ];

      expect(await marketplace.createItem(...createItemArgs))
        .to.emit(marketplace, "ItemCreated")
        .withArgs(tokenCount, seller.address, ...createItemArgs);
    });

    it("Should create a listing", async () => {
      await token.createToken(`https://www.token.com/${tokenCount}`);
      tokenCount++;

      const createListingArgs: [
        number,
        string,
        string,
        BigNumber,
        string,
        string
      ] = [
        tokenCount,
        token.address,
        "Test Listing",
        price,
        testImage,
        "Test Description",
      ];

      expect(await marketplace.createListing(...createListingArgs))
        .to.emit(marketplace, "ListingCreated")
        .withArgs(tokenCount, seller.address, ...createListingArgs);
    });
  });

  describe("Buyer", async () => {
    it("Should create an order", async () => {});
  });
});
