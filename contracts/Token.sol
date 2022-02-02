//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract Token is ERC721URIStorage {
  using Counters for Counters.Counter;
  Counters.Counter private tokenIds;
  address private contractAddress;

  constructor(address _marketplaceAddress) ERC721("Tri Payments", "TRI") {
    contractAddress = _marketplaceAddress;
  }

  /**
   * @dev Creates unique token for every listing.
   * @param _tokenURI Token URI.
   * @return The listing ID.
   */
  function createToken(string memory _tokenURI) public returns (uint256) {
    tokenIds.increment();
    uint256 tokenId = tokenIds.current();

    _mint(msg.sender, tokenId);
    _setTokenURI(tokenId, _tokenURI);
    setApprovalForAll(contractAddress, true);

    return tokenId;
  }
}
