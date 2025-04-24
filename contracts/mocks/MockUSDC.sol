// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @title MockUSDC
/// @notice Simple mintable ERC20 to emulate USDC on testnets.
contract MockUSDC is ERC20 {
    constructor() ERC20("Mock USDC", "mUSDC") {}

    /// @notice Mint tokens for testing.
    /// @param to     The recipient.
    /// @param amount Amount with 18 decimals.
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
