//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./ERC1155Token.sol";

import "hardhat/console.sol";

contract Marketplace is ReentrancyGuard, Ownable {
  using Counters for Counters.Counter;
  Counters.Counter private itemCount;
  Counters.Counter private listingCount;
  Counters.Counter private orderCount;

  uint8 public version;
  address payable public admin;
  bool public marketplaceStatus;

  mapping(address => Seller) public sellers;
  mapping(uint256 => Token) public tokens;
  mapping(uint256 => Item) public items;
  mapping(uint256 => Listing) public listings;
  mapping(uint256 => Order) private orders;

  constructor() {
    // Initializes owner to msg.sender/admin
    admin = payable(msg.sender);
    version = 1;
    marketplaceStatus = true;
  }

  // Entities

  struct Seller {
    address sellerAddress;
    bool exists;
  }

  struct Token {
    uint256 tokenId;
    address tokenContract;
    string tokenHash;
    uint256 price;
    address payable seller;
    address payable owner;
  }

  struct Item {
    uint256 itemId;
    Token token;
  }

  struct Listing {
    uint256 listingId;
    Token token;
    bool isActive;
  }

  struct Order {
    uint256 orderId;
    uint256 invoice;
    address payable seller;
    address payable buyer;
    uint256[] listingIds;
    uint256[] itemIds;
  }

  // Events

  event SellerCreated(address sellerAddress, bool exists);

  event ItemCreated(
    uint256 itemId,
    uint256 tokenId,
    address tokenContract,
    string tokenHash,
    uint256 price,
    address payable seller,
    address payable owner
  );

  event ListingCreated(
    uint256 listingId,
    uint256 tokenId,
    address tokenContract,
    string tokenHash,
    uint256 price,
    address payable seller,
    address payable owner,
    bool isActive
  );

  event OrderCreated(
    uint256 orderId,
    uint256 invoice,
    address payable seller,
    address payable buyer,
    uint256[] listingIds,
    uint256[] itemIds
  );

  event ListingDeactivated(uint256 listingId);

  event ItemPriceUpdated(uint256 itemId, uint256 price);

  event ListingPriceUpdated(uint256 listingId, uint256 price);

  // Modifiers

  modifier isSeller() {
    require(sellers[msg.sender].exists, "Must be a seller.");
    _;
  }

  modifier isValidAddress(address _address) {
    require(_address != address(0), "Not a valid address.");
    _;
  }

  modifier isMarketplaceLive() {
    require(marketplaceStatus == true, "Marketplace isn't live.");
    _;
  }

  // Methods

  /**
    @dev Creates a seller profile for the user calling the method.
   */
  function createSeller() public {
    require(!sellers[msg.sender].exists, "Seller already registered.");

    sellers[msg.sender] = Seller(msg.sender, true);

    emit SellerCreated(msg.sender, true);
  }

  /**
    @dev Creates an item associated to an ERC1155 token.
    @param _tokenId Token ID.
    @param _tokenContract Token contract.
    @param _tokenHash IPFS hash containing image & metadata.
    @param _price Token price.
   */
  function createItem(
    uint256 _tokenId,
    address _tokenContract,
    string memory _tokenHash,
    uint256 _price
  )
    public
    isSeller
    isMarketplaceLive
    isValidAddress(_tokenContract)
    nonReentrant
  {
    require(_price > 0, "Item price is required");

    uint256 itemId = itemCount.current();
    itemCount.increment();

    Token memory newToken = Token(
      _tokenId,
      _tokenContract,
      _tokenHash,
      _price,
      payable(msg.sender),
      payable(msg.sender)
    );

    tokens[_tokenId] = newToken;
    items[itemId] = Item(itemId, newToken);

    emit ItemCreated(
      itemId,
      _tokenId,
      _tokenContract,
      _tokenHash,
      _price,
      payable(msg.sender),
      payable(msg.sender)
    );
  }

  /**
    @dev Creates a listing associated to an ERC1155 token.
    @param _tokenId Unique token ID.
    @param _tokenContract Unique token contract address.
    @param _tokenHash IPFS hash containing image & metadata.
    @param _price Listing price.
   */
  function createListing(
    uint256 _tokenId,
    address _tokenContract,
    string memory _tokenHash,
    uint256 _price
  )
    public
    isSeller
    isMarketplaceLive
    nonReentrant
    isValidAddress(_tokenContract)
  {
    require(_price > 0, "Listing price is required");

    uint256 listingId = listingCount.current();
    listingCount.increment();

    Token memory newToken = Token(
      _tokenId,
      _tokenContract,
      _tokenHash,
      _price,
      payable(msg.sender),
      payable(msg.sender)
    );

    tokens[_tokenId] = newToken;
    listings[listingId] = Listing(listingId, newToken, true);

    emit ListingCreated(
      listingId,
      _tokenId,
      _tokenContract,
      _tokenHash,
      _price,
      payable(msg.sender),
      payable(msg.sender),
      true
    );
  }

  /**
    @dev Create an order with listing and/or item tokens.
    @param _listingIds Listing IDs.
    @param _itemIds Extra item IDs.
   */
  function createOrder(uint256[] memory _listingIds, uint256[] memory _itemIds)
    public
    payable
    isMarketplaceLive
    nonReentrant
  {
    uint256 total = 0;
    address tokenContract;
    address payable seller;
    uint256 tokenLength = _listingIds.length + _itemIds.length;
    Token[] memory orderTokens = new Token[](tokenLength);

    // Get listing tokens
    for (uint256 i = 0; i < _listingIds.length; i++) {
      uint256 id = _listingIds[i];
      Token memory token = listings[id].token;
      orderTokens[i] = token;

      // Make sure listings are active
      require(listings[id].isActive, "Listing isn't for sale.");

      // Update listing status
      listings[id].isActive = false;

      total += token.price;

      // Get seller & contract values
      if (seller == address(0)) {
        seller = token.seller;
      }
      if (tokenContract == address(0)) {
        tokenContract = token.tokenContract;
      }
    }

    // Get item tokens
    for (uint256 i = 0; i < _itemIds.length; i++) {
      uint256 id = _itemIds[i];
      Token memory token = items[id].token;
      orderTokens[_listingIds.length + i] = token;

      total += token.price;
    }

    // Make sure submitted price matches the sum of all token prices
    require(msg.value == total, "Funds don't match total price.");

    // Token checks & transfer
    for (uint256 i = 0; i < tokenLength; i++) {
      Token memory token = orderTokens[i];

      // Make sure token isn't already yours
      require(token.owner != msg.sender, "Can't buy own listing.");

      // Make sure listings are all from the same seller
      require(token.seller == seller, "Listings from different sellers.");

      // Transfer ownership of tokens
      IERC1155(tokenContract).safeTransferFrom(
        seller,
        msg.sender,
        token.tokenId,
        1,
        ""
      );

      // Update token ownership
      tokens[token.tokenId].owner = payable(msg.sender);
    }

    // Transfer total funds from buyer to seller
    (bool success, ) = seller.call{ value: total }("");
    require(success, "Failed to transfer funds.");

    uint256 orderId = orderCount.current();
    orderCount.increment();

    // Create & store order
    orders[orderId] = Order(
      orderId,
      total,
      seller,
      payable(msg.sender),
      _listingIds,
      _itemIds
    );

    emit OrderCreated(
      orderId,
      total,
      seller,
      payable(msg.sender),
      _listingIds,
      _itemIds
    );
  }

  /**
    @dev Set a listing status to inactive.
    @param _listingId Listing ID.
   */
  function deactivateListing(uint256 _listingId)
    public
    nonReentrant
    isSeller
    isMarketplaceLive
  {
    Listing memory listing = listings[_listingId];

    // Only allow owner to update status
    require(listing.token.seller == msg.sender, "Not owner of listing.");
    // Make sure item inactive
    require(listing.isActive, "Item already inactive.");

    listing.isActive = false;

    emit ListingDeactivated(_listingId);
  }

  /**
    @dev Updates the price of an item.
    @param _itemId Item ID.
    @param _price Updated item price.
   */
  function updateItemPrice(uint256 _itemId, uint256 _price)
    public
    nonReentrant
    isSeller
  {
    Item memory item = items[_itemId];

    // Only allow owner to update price
    require(item.token.owner == msg.sender, "Not owner of listing.");

    item.token.price = _price;

    emit ItemPriceUpdated(_itemId, _price);
  }

  /**
    @dev Updates the price of a listing.
    @param _listingId Listing ID.
    @param _price Updated listing price.
   */
  function updateListingPrice(uint256 _listingId, uint256 _price)
    public
    nonReentrant
    isSeller
    isMarketplaceLive
  {
    Listing memory listing = listings[_listingId];

    // Only allow owner to update price
    require(listing.token.owner == msg.sender, "Not owner of listing.");

    listing.token.price = _price;

    emit ListingPriceUpdated(_listingId, _price);
  }

  /**
    @dev Get a list of all available listings.
   */
  function getMarketplaceListings() public view returns (Listing[] memory) {
    uint256 totalListings = listingCount.current();
    uint256 activeListingsLength = 0;
    uint256 activeListingsIndex = 0;

    for (uint256 i = 0; i < totalListings; i++) {
      if (listings[i].isActive) {
        activeListingsLength++;
      }
    }

    Listing[] memory activeListings = new Listing[](totalListings);

    for (uint256 i = 0; i < totalListings; i++) {
      if (listings[i].isActive) {
        activeListings[activeListingsIndex] = listings[i];
        activeListingsIndex++;
      }
    }

    return activeListings;
  }

  /**
    @dev Get a list of my created items.
    @return an array of items.
   */
  function getMyItems() public view isSeller returns (Item[] memory) {
    uint256 totalItems = itemCount.current();
    uint256 myItemsLength = 0;
    uint256 myItemsIndex = 0;

    for (uint256 i = 0; i < totalItems; i++) {
      bool isSoldByMe = items[i].token.seller == msg.sender;

      if (isSoldByMe) {
        myItemsLength++;
      }
    }

    Item[] memory myItems = new Item[](myItemsLength);

    for (uint256 i = 0; i < totalItems; i++) {
      bool isSoldByMe = items[i].token.seller == msg.sender;

      if (isSoldByMe) {
        myItems[myItemsIndex] = items[i];
        myItemsIndex++;
      }
    }

    return myItems;
  }

  /**
    @dev Get a list of my created listings.
    @return an array of listings.
   */
  function getMyListings() public view isSeller returns (Listing[] memory) {
    uint256 totalListings = listingCount.current();
    uint256 myListingsLength = 0;
    uint256 myListingsIndex = 0;

    for (uint256 i = 0; i < totalListings; i++) {
      bool isSoldByMe = listings[i].token.seller == msg.sender;

      if (isSoldByMe) {
        myListingsLength++;
      }
    }

    Listing[] memory myListings = new Listing[](myListingsLength);

    for (uint256 i = 0; i < totalListings; i++) {
      bool isSoldByMe = listings[i].token.seller == msg.sender;

      if (isSoldByMe) {
        myListings[myListingsIndex] = listings[i];
        myListingsIndex++;
      }
    }

    return myListings;
  }

  /**
    @dev Get a list of my order history.
    @return an array of bought orders.
   */
  function getMyOrders() public view returns (Order[] memory) {
    uint256 totalOrders = orderCount.current();
    uint256 myOrdersLength = 0;
    uint256 myOrdersIndex = 0;

    for (uint256 i = 0; i < totalOrders; i++) {
      bool isMyOrder = orders[i].buyer == msg.sender;

      if (isMyOrder) {
        myOrdersLength++;
      }
    }

    Order[] memory myOrders = new Order[](myOrdersLength);

    for (uint256 i = 0; i < totalOrders; i++) {
      bool isMyOrder = orders[i].buyer == msg.sender;

      if (isMyOrder) {
        myOrders[myOrdersIndex] = orders[i];
        myOrdersIndex++;
      }
    }

    return myOrders;
  }

  /**
    @dev Get a list of my sales history.
    @return an array of sold orders.
   */
  function getMySales() public view isSeller returns (Order[] memory) {
    uint256 totalSales = orderCount.current();
    uint256 mySalesLength = 0;
    uint256 mySalesIndex = 0;

    for (uint256 i = 0; i < totalSales; i++) {
      bool isMySale = orders[i].seller == msg.sender;

      if (isMySale) {
        mySalesLength++;
      }
    }

    Order[] memory mySales = new Order[](mySalesLength);

    for (uint256 i = 0; i < totalSales; i++) {
      bool isMySale = orders[i].buyer == msg.sender;

      if (isMySale) {
        mySales[mySalesIndex] = orders[i];
        mySalesIndex++;
      }
    }

    return mySales;
  }

  /**
    @dev Get a list of my purchased listings.
    @return an array of purchased listings.
   */
  function getMyPurchasedListings() public view returns (Listing[] memory) {
    uint256 totalListings = listingCount.current();
    uint256 myListingsLength = 0;
    uint256 myListingsIndex = 0;

    for (uint256 i = 0; i < totalListings; i++) {
      bool isOwnedByMe = listings[i].token.owner == msg.sender;
      bool isSoldByMe = listings[i].token.seller == msg.sender;

      if (isOwnedByMe && !isSoldByMe) {
        myListingsLength++;
      }
    }

    Listing[] memory myListings = new Listing[](myListingsLength);

    for (uint256 i = 0; i < totalListings; i++) {
      bool isOwnedByMe = listings[i].token.owner == msg.sender;
      bool isSoldByMe = listings[i].token.seller == msg.sender;

      if (isOwnedByMe && !isSoldByMe) {
        myListings[myListingsIndex] = listings[i];
        myListingsIndex++;
      }
    }

    return myListings;
  }

  // Destroy functions
  // Restock functions

  // Admin functions

  /**
    @dev Set the marketplace status to live or paused.
   */
  function setMarketplaceStatus(bool _status) external onlyOwner {
    marketplaceStatus = _status;
  }
}

// console.log("Inside sold by me...");
// console.log("myItemsIndex: ", myItemsIndex);
// console.log("items[i].itemId: ", items[i].itemId);
