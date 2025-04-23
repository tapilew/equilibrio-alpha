// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./InvoiceNFT.sol";

contract EquiProtocolMVP {
    IERC20 public usdc;
    InvoiceNFT public invoiceNFT;
    event PaymentProcessed(
        address indexed merchant,
        uint256 amount,
        uint256 timestamp
    );

    // Constructor con 2 argumentos: USDC Address y Base URI
    constructor(address _usdcAddress, string memory baseURI) {
        usdc = IERC20(_usdcAddress);
        invoiceNFT = new InvoiceNFT(baseURI); // Se pasa baseURI al contrato NFT
    }

    function receivePayment(address payable merchant, uint256 amount) external {
        require(
            usdc.transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );
        emit PaymentProcessed(merchant, amount, block.timestamp);

        // Mint NFT como validación de la factura
        invoiceNFT.mint(merchant);
    }
}
