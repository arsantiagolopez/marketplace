//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract Tri {
  // Global

  uint256 public version;
  mapping(address => Seller) public sellers;
  mapping(address => bool) public isSeller;

  constructor() {
    version = 1;
  }

  // Entities

  struct Seller {
    address seller;
    string name;
    Listing[] listings;
  }

  struct Buyer {
    address buyer;
    string firstName;
    string lastName;
    Listing[] orders;
  }

  struct Listing {
    uint256 id;
    Item[] items;
    Discount discount;
    string imageHash;
  }

  struct Item {
    uint256 id;
    string name;
    uint256 price;
    string imageHash;
  }

  struct Discount {
    uint8 percent;
    string code;
  }

  struct Order {
    uint256 orderNumber;
    address seller;
    address buyer;
    Listing[] listings;
  }

  struct Invoice {
    uint256 orderNumber;
    uint256 total;
  }

  // Events

  event SellerCreated(address indexed seller, string name);

  event ItemCreated(uint256 id, string name, uint256 price, string imageHash);

  event ListingCreated(
    uint256 id,
    Item[] items,
    Discount discount,
    string imageHash
  );

  event OrderPlaced(
    address indexed seller,
    address indexed buyer,
    Listing[] listings
  );

  // Modifiers

  // // Defining function modifier 'onlyBuyer'
  // modifier onlyBuyer(){
  //     require(msg.sender == buyer ||
  //             msg.sender == arbiter);
  //     _;
  // }

  // // Defining function modifier 'onlySeller'
  // modifier onlySeller(){
  //     require(msg.sender == seller);
  //     _;
  // }

  // Methods

  /**
   * @dev Registers a seller to their unique address.
   * @param _name The public name of the store.
   */
  function createSeller(string memory _name) public {
    require(msg.sender != address(0x0), "Must be a valid address.");
    require(bytes(_name).length > 3, "Name must be at least 3 letters.");
    require(!isSeller[msg.sender], "Address is alredy a seller.");

    // Indirectly create Seller struct to bypass empty array declaration
    sellers[msg.sender].seller = msg.sender;
    sellers[msg.sender].name = _name;

    // Set seller flag upon creation
    isSeller[msg.sender] = true;

    emit SellerCreated(msg.sender, _name);
  }

  // Get seller account info
  // function myAccount() public return()

  // Get a seller's listings

  // Place an order

  // Create an item

  // Create a listing

  // Create a discount
}
