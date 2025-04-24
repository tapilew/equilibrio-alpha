// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "forge-std/Test.sol";
import "../src/EquiProtocolMVP.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Mock USDC para pruebas
contract MockUSDC is ERC20 {
    constructor() ERC20("USD Coin", "USDC") {
        _mint(msg.sender, 1000000 * 10 ** 6); // 1 millón de USDC
    }

    function decimals() public pure override returns (uint8) {
        return 6; // USDC usa 6 decimales
    }
}

contract EquiProtocolMVPTest is Test {
    EquiProtocolMVP public equiProtocol;
    MockUSDC public usdc;
    address public user = address(0x578938E218Eb43312946c7B3BcE9009b6beE0f43);
    address public treasury =
        address(0x1234567890AbcdEF1234567890aBcdef12345678);
    string public baseURI = "https://example.com/"; // URI base para los NFTs

    function setUp() public {
        // Crear y desplegar el mock USDCconsole.log("Setting up test environment...");
        console.log("Deploying MockUSDC contract...");
        console.log("Deploying EquiProtocolMVP contract...");
        console.log("Setting fee percentage to 2%...");
        console.log("Adding MockUSDC as supported token...");
        console.log("Transferring 1000 USDC to user for testing...");

        console.log("Testing receive payment function...");
        console.log("Simulating user transaction...");
        console.log("Approving USDC spending...");
        console.log("Expecting PaymentProcessed event emission...");
        console.log("Calling receivePayment function...");
        console.log("Verifying user balance after transaction...");
        console.log("Verifying merchant balance after transaction...");
        console.log("Verifying treasury balance after transaction...");
        usdc = new MockUSDC();

        // Desplegar EquiProtocol con la dirección de la tesorería y base URI
        equiProtocol = new EquiProtocolMVP(treasury, baseURI);

        // Configurar el porcentaje de comisión (por ejemplo, 2%)
        equiProtocol.setFeePercentage(2);

        // Agregar el token MockUSDC como soportado
        equiProtocol.addSupportedToken(address(usdc));

        // Dar USDC al usuario para pruebas
        usdc.transfer(user, 1000 * 10 ** 6); // 1000 USDC
    }

    function testReceivePayment() public {
        address merchant = address(0xABCD);
        uint256 amount = 100 * 10 ** 6; // 100 USDC
        uint256 fee = (amount * equiProtocol.feePercentage()) / 100; // 2% de comisión
        uint256 netAmount = amount - fee; // Monto neto después de la comisión

        // Actuar como el usuario
        vm.startPrank(user);

        // Aprobar el gasto
        usdc.approve(address(equiProtocol), amount);

        // Configurar la expectativa del evento
        vm.expectEmit(true, true, true, true);
        emit EquiProtocolMVP.PaymentProcessed(
            user, // Payer
            merchant, // Merchant
            address(usdc), // Token
            amount, // Amount
            netAmount, // Net amount
            fee, // Fee
            block.timestamp, // Timestamp
            "TestInvoice123", // Invoice ID
            "Test Item Details" // Item details
        );

        // Llamar a la función que emite el evento
        equiProtocol.receivePayment(
            address(usdc),
            payable(merchant),
            amount,
            "TestInvoice123",
            "Test Item Details"
        );

        vm.stopPrank();

        // Verificar balances
        assertEq(usdc.balanceOf(user), 900 * 10 ** 6); // 900 USDC
        assertEq(
            usdc.balanceOf(merchant),
            netAmount,
            "Merchant balance mismatch"
        );
        assertEq(usdc.balanceOf(treasury), fee, "Treasury balance mismatch");
    }
}
