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

  // Deployment
  describe("Deployment", () => {
    it("Should display the current version", async () => {
      expect(await marketplace.version()).to.equal(1);
    });

    it("Should create a unique token", async () => {
      const tokenUri = "bacon";

      expect(await token.createToken(tokenUri, 5))
        .to.emit(token, "TokenCreated")
        .withArgs(0);
    });
  });

  // Seller methods
  describe("Seller", () => {
    let tokenCount = 0;
    let itemCount = 0;
    let listingCount = 0;
    const tokenUri = "testUri";
    const hash = "testHash";
    const price = ethers.utils.parseUnits("1", "ether");

    it("Should create a seller", async () => {
      expect(await marketplace.createSeller())
        .to.emit(marketplace, "SellerCreated")
        .withArgs(seller.address, true);
    });

    it("Should not seller to register after initial registration", async () => {
      // Seller has already been created above
      expect(async () => await marketplace.createSeller()).to.Throw;
    });

    it("Should create an item", async () => {
      await token.createToken(tokenUri, 1);

      const createItemArgs: [number, string, string, BigNumber] = [
        tokenCount,
        token.address,
        hash,
        price,
      ];

      expect(await marketplace.createItem(...createItemArgs))
        .to.emit(marketplace, "ItemCreated")
        .withArgs(itemCount, ...createItemArgs, seller.address);

      tokenCount++;
      itemCount++;
    });

    it("Should create a listing with NO items", async () => {
      await token.createToken(tokenUri, 1);

      const createListingArgs: [number, string, string, BigNumber] = [
        tokenCount,
        token.address,
        "First Test Listing",
        price,
      ];

      const itemIds: number[] = [];

      expect(await marketplace.createListing(...createListingArgs, itemIds))
        .to.emit(marketplace, "ListingCreated")
        .withArgs(listingCount, ...createListingArgs, seller.address, true, []);

      tokenCount++;
      listingCount++;
    });

    it("Should create a listing with ONE item", async () => {
      const itemId = itemCount - 1;

      await token.createToken(tokenUri, 1);

      const createListingArgs: [number, string, string, BigNumber] = [
        tokenCount,
        token.address,
        "Second Test Listing",
        price,
      ];

      const itemIds: number[] = [itemId];

      expect(await marketplace.createListing(...createListingArgs, itemIds))
        .to.emit(marketplace, "ListingCreated")
        .withArgs(listingCount, ...createListingArgs, seller.address, true, [
          itemId,
        ]);

      tokenCount++;
      listingCount++;
    });

    it("Should toggle active/inactive listing status", async () => {
      const listingId = listingCount - 1;

      // Listing status should be false
      expect(await marketplace.toggleListingStatus(listingId))
        .to.emit(marketplace, "ListingStatusUpdated")
        .withArgs(listingId, false);

      // Listing status should be back to true
      expect(await marketplace.toggleListingStatus(listingId))
        .to.emit(marketplace, "ListingStatusUpdated")
        .withArgs(listingId, true);
    });

    it("Should NOT be able to buy own listing", async () => {
      // Previously created listing with ID 0
      const listingIds: number[] = [0];
      const itemIds: number[] = [];

      const createOrderArgs: [number[], number[]] = [listingIds, itemIds];

      expect(
        async () =>
          await marketplace.createOrder(...createOrderArgs, {
            value: price,
          })
      ).to.Throw;
    });
  });

  // Buyer methods
  describe("Buyer", () => {
    let orderCount = 0;
    const price = ethers.utils.parseUnits("1", "ether");

    it("Should be able to buy a listing", async () => {
      // Previously created listing with ID 0
      const listingIds: number[] = [0];
      const itemIds: number[] = [];

      const createOrderArgs: [number[], number[]] = [listingIds, itemIds];

      expect(
        await marketplace.connect(buyer).createOrder(...createOrderArgs, {
          value: price,
        })
      )
        .to.emit(marketplace, "OrderCreated")
        .withArgs(
          orderCount,
          price,
          seller.address,
          buyer.address,
          listingIds,
          itemIds
        );

      orderCount++;
    });

    it("Should be able to buy a listing WITH items", async () => {
      // Previously created listing with ID 1
      const listingIds: number[] = [1];
      const itemIds: number[] = [0];
      const totalPrice = ethers.utils.parseUnits("2", "ether");

      const createOrderArgs: [number[], number[]] = [listingIds, itemIds];

      expect(
        await marketplace.connect(buyer).createOrder(...createOrderArgs, {
          value: totalPrice,
        })
      )
        .to.emit(marketplace, "OrderCreated")
        .withArgs(
          orderCount,
          totalPrice,
          seller.address,
          buyer.address,
          listingIds,
          itemIds
        );

      orderCount++;
    });

    it("Should NOT be able to buy an item with insufficient funds", async () => {
      // Previously created listing with ID 1
      const listingIds: number[] = [1];
      const itemIds: number[] = [];
      const insufficientPrice = ethers.utils.parseUnits("0.5", "ether");

      const createOrderArgs: [number[], number[]] = [listingIds, itemIds];

      expect(
        async () =>
          await marketplace.createOrder(...createOrderArgs, {
            value: insufficientPrice,
          })
      ).to.Throw;
    });

    it("Should NOT be able to create an item", async () => {
      const createItemArgs: [number, string, string, BigNumber] = [
        0,
        token.address,
        "hash",
        price,
      ];

      expect(async () => await marketplace.createItem(...createItemArgs)).to
        .Throw;
    });

    it("Should NOT be able to create a listing", async () => {
      const createListingArgs: [number, string, string, BigNumber, number[]] = [
        0,
        token.address,
        "hash",
        price,
        [],
      ];

      expect(async () => await marketplace.createListing(...createListingArgs))
        .to.Throw;
    });
  });

  // Admin methods
  describe("Admin", () => {
    it("Should pause and resume the marketplace status", async () => {
      // Marketplace is currently live
      expect(await marketplace.marketplaceStatus()).to.equal(true);

      // Pause marketplace
      await marketplace.setMarketplaceStatus(false);

      // Marketplace should be paused
      expect(await marketplace.marketplaceStatus()).to.equal(false);

      // Set marketplace back to live
      await marketplace.setMarketplaceStatus(true);
    });
  });
});
