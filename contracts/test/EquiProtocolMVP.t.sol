// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "../src/EquiProtocolMVP.sol";
import "forge-std/Test.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Mock USDC token for testing
contract MockUSDC is ERC20 {
    constructor() ERC20("USD Coin", "USDC") {
        _mint(msg.sender, 1000000 * 10**6); // Mint 1M USDC (6 decimals)
    }
    
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

contract EquiProtocolMVPTest is Test {
    EquiProtocolMVP public equiProtocol;
    MockUSDC public usdc;
    address public treasury = address(0x123);
    address public user = address(0x456);
    address public merchant = address(0x789);
    
    event PaymentProcessed(
        address indexed sender,
        address indexed recipient,
        uint256 amount,
        uint256 timestamp,
        string merchantName,
        string merchantTaxId,
        string merchantAddress,
        string paymentReference,
        string description
    );

    function setUp() public {
        // Deploy mock USDC
        usdc = new MockUSDC();
        
        // Deploy the protocol with mock USDC
        equiProtocol = new EquiProtocolMVP(address(usdc), treasury);
        
        // Fund the user with USDC
        usdc.transfer(user, 1000 * 10**6); // 1000 USDC
        
        // Register merchant
        equiProtocol.registerMerchant(
            merchant,
            "Test Merchant",
            "TAX123456",
            "123 Business St"
        );
    }

    function testPaymentFlow() public {
        // User approves USDC spending
        vm.startPrank(user);
        usdc.approve(address(equiProtocol), 100 * 10**6); // Approve 100 USDC
        
        // User approves the payment
        equiProtocol.approvePayment(
            merchant,
            100 * 10**6,
            "INV-001",
            "Test payment"
        );
        vm.stopPrank();

        // Expect the PaymentProcessed event
        vm.expectEmit(true, true, true, true);
        emit PaymentProcessed(
            user,
            merchant,
            100 * 10**6,
            block.timestamp,
            "Test Merchant",
            "TAX123456",
            "123 Business St",
            "INV-001",
            "Test payment"
        );

        // Execute the payment
        vm.prank(user);
        equiProtocol.executePayment(
            merchant,
            100 * 10**6,
            "INV-001",
            "Test payment"
        );

        // Verify balances
        assertEq(usdc.balanceOf(user), 900 * 10**6);     // User balance after payment
        assertEq(usdc.balanceOf(merchant), 100 * 10**6); // Merchant receives full amount
        assertEq(usdc.balanceOf(treasury), 0);           // Treasury receives nothing
    }
    
    function testMerchantRegistration() public {
        address newMerchant = address(0x999);
        
        // Register new merchant
        equiProtocol.registerMerchant(
            newMerchant,
            "New Merchant",
            "TAX789012",
            "456 Business Ave"
        );
        
        // Verify merchant is registered
        assertTrue(equiProtocol.registeredMerchants(newMerchant));
        assertEq(equiProtocol.getMerchantsCount(), 2); // Original merchant + new merchant
        
        // Verify merchant info
        (
            string memory name,
            string memory taxId,
            string memory businessAddress
        ) = equiProtocol.getMerchantInfo(newMerchant);
        
        assertEq(name, "New Merchant");
        assertEq(taxId, "TAX789012");
        assertEq(businessAddress, "456 Business Ave");
    }
    
    function testCustomerManagement() public {
        address customer = address(0x555);
        
        // Add customer to merchant
        vm.prank(merchant);
        equiProtocol.addCustomer(merchant, customer);
        
        // Verify customer is added
        assertTrue(equiProtocol.isCustomerOfMerchant(merchant, customer));
    }
}
