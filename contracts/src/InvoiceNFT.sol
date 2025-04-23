// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract InvoiceNFT is ERC721URIStorage {
    uint256 private _tokenIdCounter;
    string private _baseURIExtended;

    constructor(string memory newBaseURI) ERC721("InvoiceNFT", "INFT") {
        _setBaseURI(newBaseURI); // Usamos el nuevo nombre de la variable
    }

    function _setBaseURI(string memory newBaseURI) internal {
        _baseURIExtended = newBaseURI;
    }

    function _getBaseURI() internal view returns (string memory) {
        return _baseURIExtended;
    }

    function mint(address to) public returns (uint256) {
        uint256 tokenId = _tokenIdCounter;
        _safeMint(to, tokenId);
        _setTokenURI(
            tokenId,
            string(abi.encodePacked(_getBaseURI(), uint2str(tokenId)))
        );
        _tokenIdCounter++;
        return tokenId;
    }

    // Utilidad para convertir uint a string
    function uint2str(uint256 _i) internal pure returns (string memory str) {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint256 k = len - 1;
        while (_i != 0) {
            bstr[k--] = bytes1(uint8(48 + (_i % 10)));
            _i /= 10;
        }
        str = string(bstr);
    }
}
