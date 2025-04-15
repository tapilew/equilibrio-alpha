// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/TuriCashDAO.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Mock USDC token for testing
contract MockUSDC is ERC20 {
    constructor() ERC20("USD Coin", "USDC") {
        _mint(msg.sender, 1000000 * 10 ** 6); // Mint 1M USDC (6 decimals)
    }

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}

contract TuriCashDAOTest is Test {
    TuriCashDAO public dao;
    MockUSDC public usdc;
    address public owner;
    address public merchant;
    address public customer;

    function setUp() public {
        owner = address(this);
        merchant = address(0x1);
        customer = address(0x2);

        // Deploy mock USDC
        usdc = new MockUSDC();

        // Deploy DAO
        dao = new TuriCashDAO(address(usdc));

        // Fund customer with USDC
        usdc.transfer(customer, 10000 * 10 ** 6); // 10,000 USDC
    }

    function testRecordTransaction() public {
        // Customer approves DAO to spend USDC
        vm.startPrank(customer);
        usdc.approve(address(dao), 1000 * 10 ** 6); // 1,000 USDC
        vm.stopPrank();

        // Record transaction
        dao.recordTransaction(merchant, 1000 * 10 ** 6);

        // Check transaction was recorded
        assertEq(dao.getTransactionCount(merchant), 1);

        // Check merchant volume
        assertEq(dao.merchantTotalVolume(merchant), 982 * 10 ** 6); // 98.2% of 1000

        // Check community fund
        assertEq(dao.communityFund(), 18 * 10 ** 6); // 1.8% of 1000
    }

    function testWithdrawCommunityFund() public {
        // First record a transaction to fund the community fund
        vm.startPrank(customer);
        usdc.approve(address(dao), 1000 * 10 ** 6);
        vm.stopPrank();

        dao.recordTransaction(merchant, 1000 * 10 ** 6);

        // Now withdraw from community fund
        address recipient = address(0x3);
        dao.withdrawCommunityFund(18 * 10 ** 6, recipient);

        // Check community fund is empty
        assertEq(dao.communityFund(), 0);

        // Check recipient received the funds
        assertEq(usdc.balanceOf(recipient), 18 * 10 ** 6);
    }

    function testFailWithdrawCommunityFundNotOwner() public {
        // First record a transaction to fund the community fund
        vm.startPrank(customer);
        usdc.approve(address(dao), 1000 * 10 ** 6);
        vm.stopPrank();

        dao.recordTransaction(merchant, 1000 * 10 ** 6);

        // Try to withdraw as non-owner
        vm.startPrank(merchant);
        vm.expectRevert("Ownable: caller is not the owner");
        dao.withdrawCommunityFund(18 * 10 ** 6, merchant);
        vm.stopPrank();
    }
}
