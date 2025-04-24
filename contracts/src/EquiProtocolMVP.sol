// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract EquiProtocolMVP {
    address public treasury;
    uint256 public feePercentage = 5; // Fee percentage (e.g., 5%)

    event PaymentProcessed(
        address indexed user,
        address indexed merchant,
        uint256 amount,
        uint256 fee,
        uint256 timestamp // Added timestamp to the event
    );

    constructor(address _treasury) {
        require(_treasury != address(0), "Invalid treasury address");
        treasury = _treasury;
    }

    function approvePayment(address merchant) external payable {
        require(msg.value > 0, "Payment must be greater than zero");
        // Payment approval logic (if needed)
    }

    function executePayment(address merchant, uint256 amount) external {
        require(amount > 0, "Amount must be greater than zero");
        require(address(this).balance >= amount, "Insufficient contract balance");

        uint256 fee = (amount * feePercentage) / 100;
        uint256 merchantAmount = amount - fee;

        payable(merchant).transfer(merchantAmount);
        payable(treasury).transfer(fee);

        emit PaymentProcessed(msg.sender, merchant, amount, fee, block.timestamp); // Include timestamp
    }
}
