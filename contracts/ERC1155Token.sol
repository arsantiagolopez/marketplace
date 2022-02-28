//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "hardhat/console.sol";

contract ERC1155Token is ERC1155 {
  using Counters for Counters.Counter;
  Counters.Counter private tokenCount;

  address private contractAddress;
  mapping(uint256 => string) public tokenURIs;

  constructor(address _marketplaceAddress) ERC1155("") {
    contractAddress = _marketplaceAddress;
  }

  event TokenCreated(uint256 tokenId);

  /**
    @dev Get custom URL with token metadata.
    @param _tokenId Token ID.
    @return the URI associated to the token ID.
   */
  function uri(uint256 _tokenId) public view override returns (string memory) {
    return
      string(
        abi.encodePacked(
          // Base URI set on constructor
          super.uri(_tokenId),
          // Token URI
          tokenURIs[_tokenId],
          // Extension
          "/metadata.json"
        )
      );
  }

  /**
    @dev Mint tokens.
    @param _to User to assign tokens to.
    @param _id Token ID to mint.
    @param _amount Quantity to mint.
   */
  function mint(
    address _to,
    uint256 _id,
    uint256 _amount
  ) internal {
    _mint(_to, _id, _amount, "");
  }

  /**
    @dev Destroy tokens.
    @param _to User whose tokens should be destroyed.
    @param _id Token ID to destroy.
    @param _amount Quantity to destroy.
   */
  function burn(
    address _to,
    uint256 _id,
    uint256 _amount
  ) internal {
    require(msg.sender == _to, "Not token owner.");
    _burn(_to, _id, _amount);
  }

  /**
    @dev Create token of given quantity.
    @param _tokenURI Token name identifier.
    @param _quantity Amount of tokens to create.
    @return the token ID.
   */
  function createToken(string memory _tokenURI, uint256 _quantity)
    external
    returns (uint256)
  {
    uint256 tokenId = tokenCount.current();
    tokenCount.increment();

    // Mint new item with given quantity
    mint(msg.sender, tokenId, _quantity);

    // Map tokenId to tokenURI
    tokenURIs[tokenId] = _tokenURI;

    // Whitelist Marketplace to move tokens on behalf of owner
    setApprovalForAll(contractAddress, true);

    // Emit event on token creation
    emit TokenCreated(tokenId);

    return tokenId;
  }
}

// @todo: Add MACRO properties to items: Protein, carbs, fats AS TO give any metaverse user that buys it an extension of health/life like video games
