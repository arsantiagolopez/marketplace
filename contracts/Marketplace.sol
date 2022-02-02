//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "hardhat/console.sol";

contract Marketplace is ReentrancyGuard {
  // Global
  using Counters for Counters.Counter;
  Counters.Counter private itemIds;
  Counters.Counter private listingIds;
  Counters.Counter private orderIds;

  mapping(uint256 => Item) private items;
  mapping(uint256 => Listing) public listings;
  mapping(uint256 => Order) private orders;

  address payable public owner;

  constructor() {
    owner = payable(msg.sender);
  }

  // Entities

  struct Item {
    uint256 itemId;
    string name;
    uint256 price;
    string imageHash;
  }

  struct Listing {
    uint256 listingId;
    uint256 tokenId;
    address tokenContract;
    address payable seller;
    string name;
    string description;
    uint256 price;
    string imageHash;
    mapping(uint256 => Item) items;
  }

  struct Order {
    uint256 orderId;
    address payable seller;
    address buyer;
    uint256 price;
    mapping(uint256 => Listing) listings;
  }

  // Events

  event ItemCreated(
    uint256 indexed itemId,
    string indexed name,
    uint256 indexed price,
    string imageHash
  );

  event ListingCreated(
    uint256 indexed listingId,
    uint256 tokenId,
    address tokenContract,
    address payable seller,
    string indexed name,
    string description,
    uint256 indexed price,
    string imageHash,
    uint256[] items
  );

  event OrderCreated(
    uint256 indexed orderId,
    address indexed seller,
    address indexed buyer,
    uint256 price,
    uint256[] listings
  );

  // Methods

  /**
   * @dev Creates an item to be added to listings.
   * @param _name Name of the item.
   * @param _price Price of the item.
   * @param _imageHash IPFS image hash associated with item.
   * @return Item ID.
   */
  function createItem(
    string memory _name,
    uint256 _price,
    string memory _imageHash
  ) public returns (uint256) {
    require(bytes(_name).length > 0, "Item name is required.");
    require(_price > 0, "Price is required");
    require(bytes(_imageHash).length > 0, "Must be a valid IPFS image hash.");

    itemIds.increment();
    uint256 itemId = itemIds.current();

    // Create & store item in items mapping
    items[itemId] = Item(itemId, _name, _price, _imageHash);

    // Emit event on item creation
    emit ItemCreated(itemId, _name, _price, _imageHash);

    return itemId;
  }

  /**
   * @dev Creates a marketplace listing.
   * @param _tokenId Unique token ID.
   * @param _tokenContract Unique token contract address.
   * @param _description Listing description.
   * @param _price Listing price.
   * @param _imageHash IPFS listing image hash.
   * @param _itemIds Item IDs associated with items in listing.
   * @return Listing ID.
   */
  function createListing(
    uint256 _tokenId,
    address _tokenContract,
    string memory _name,
    string memory _description,
    uint256 _price,
    string memory _imageHash,
    uint256[] memory _itemIds
  ) public returns (uint256) {
    require(bytes(_name).length > 0, "Listing name is required.");
    require(bytes(_description).length > 0, "Listing description is required.");
    require(_price > 0, "Listing price is required");
    require(bytes(_imageHash).length > 0, "Must be a valid IPFS image hash.");

    listingIds.increment();
    uint256 listingId = listingIds.current();

    uint256 totalPrice = _price;

    // Update price based on added items
    for (uint256 i = 0; i < _itemIds.length; i++) {
      uint256 itemId = _itemIds[i];
      Item memory item = items[itemId];

      // Update price
      totalPrice += item.price;

      // Associate itemId key to mapping
      listings[listingId].items[itemId] = item;
    }

    // Update remaining fields of Listing instance
    listings[listingId].listingId = listingId;
    listings[listingId].tokenId = _tokenId;
    listings[listingId].tokenContract = _tokenContract;
    listings[listingId].seller = payable(msg.sender);
    listings[listingId].name = _name;
    listings[listingId].description = _description;
    listings[listingId].price = totalPrice;
    listings[listingId].imageHash = _imageHash;

    // Emit event on listing creation
    emit ListingCreated(
      listingId,
      _tokenId,
      _tokenContract,
      payable(msg.sender),
      _name,
      _description,
      totalPrice,
      _imageHash,
      _itemIds
    );

    return listingId;
  }

  /**
   * @dev Creates an order in the marketplace.
   * @param _tokenContract Unique token contract address.
   * @param _tokenId Unique token ID.
   * @param _listingId Listing ID.
   * @param _price Listing price.
   * @param _seller Listing seller.
   */
  function transferToken(
    address _tokenContract,
    uint256 _tokenId,
    uint256 _listingId,
    uint256 _price,
    address payable _seller
  ) private {
    require(msg.value >= _price, "You don't have enough funds.");
    require(_seller == listings[_listingId].seller, "Unrightful seller.");

    // Transfer funds from buyer to seller
    (bool success, ) = _seller.call{ value: msg.value }("");
    require(success, "Failed to transfer funds. Token not transfered.");

    // Transfer ownership of listing token
    IERC721(_tokenContract).transferFrom(_seller, msg.sender, _tokenId);

    // Update local listings ownership
    listings[_listingId].seller = payable(msg.sender);
  }

  /**
   * @dev Place an order of selected listings.
   * @param _seller Seller address.
   * @param _listingIds Listing IDs in order.
   * @param _price Total price of order.
   */
  function createOrder(
    address payable _seller,
    uint256[] memory _listingIds,
    uint256 _price
  ) public payable nonReentrant returns (uint256) {
    require(msg.value == _price, "Funds must match the asking price.");

    // Exchange tokens & funds per listing in order
    for (uint256 i = 0; i < _listingIds.length; i++) {
      Listing storage listing = listings[_listingIds[i]];
      transferToken(
        listing.tokenContract,
        listing.tokenId,
        listing.listingId,
        listing.price,
        listing.seller
      );
    }

    // Increase orderId if transfer was successful
    orderIds.increment();
    uint256 orderId = orderIds.current();

    // Emit event on order creation
    emit OrderCreated(orderId, _seller, msg.sender, _price, _listingIds);

    return orderId;
  }
}

// Make sure seller can't buy their own item
// Change all numbers to Math library and to deal with USD
// On createOrder function: Make sure all items have the same owner, and orders of multiple listings must be from the same seller.
