// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "../src/EquiProtocolMVP.sol"; // Corrected import path

import "forge-std/Test.sol";

contract EquiProtocolMVPTest is Test {
    EquiProtocolMVP public equiProtocol;
    address public treasury = address(0x123);

    function setUp() public {
        // Deploy the contract with the correct constructor parameter
        equiProtocol = new EquiProtocolMVP(treasury);
    }

    function testPaymentFlow() public {
        address user = address(0x456);
        address merchant = address(0x789);

        // Fund the user for testing
        vm.deal(user, 10 ether);

        // User approves the payment
        vm.prank(user);
        equiProtocol.approvePayment{value: 1 ether}(merchant);

        // Expect the PaymentProcessed event
        vm.expectEmit(true, true, true, true);
        emit EquiProtocolMVP.PaymentProcessed(user, merchant, 1 ether, 0.05 ether, block.timestamp);

        // Execute the payment
        vm.prank(user);
        equiProtocol.executePayment(merchant, 1 ether);

        // Verify balances
        assertEq(user.balance, 9 ether); // User balance after payment
        assertEq(merchant.balance, 0.95 ether); // Merchant balance after fee
        assertEq(treasury.balance, 0.05 ether); // Treasury receives the fee
    }
}
