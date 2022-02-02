import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import { Tri } from "../typechain";

describe("Tri Contract Unit Tests", () => {
  let tri: Tri;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let seller: string;
  let buyer: string;

  // Checkpoints
  before(async () => {
    [owner, addr1] = await ethers.getSigners();
  });

  // Run before each test
  beforeEach(async () => {
    const TriFactory = await ethers.getContractFactory("Tri");
    tri = await TriFactory.deploy();
    await tri.deployed();

    // Get signers' addresses
    seller = owner.address;
    buyer = tri.connect(addr1).address;
  });

  // // Deployment
  // describe("Deployment", () => {
  //   it("Should display the correct version", async () => {
  //     const version = await tri.version();
  //     expect(version).to.equal(1);
  //   });
  // });

  // Functions
  describe("Functions", () => {
    it("Should create a seller", async () => {
      if (buyer && seller) {
      }

      await tri.createSeller("Testing Solutions");

      // const test = (await tri.sellers(seller)).name;

      // console.log("******* TEST NAME: ", test);
    });

    // it("Should prevent address from creating multiple accounts", async () => {
    //   if (buyer && seller) {
    //   }

    //   await tri.createSeller("Testing Solutions");

    //   await tri.createSeller("Duplicate Testing Solutions");
    // });
  });
});
