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
    address user = address(0x1234);
    string public baseURI = "https://example.com/"; // URI base para los NFTs

    function setUp() public {
        // Crear y desplegar el mock USDC
        usdc = new MockUSDC();

        // Desplegar EquiProtocol con la dirección del mock USDC y base URI
        equiProtocol = new EquiProtocolMVP(address(usdc), baseURI); // 2 argumentos

        // Dar USDC al usuario para pruebas
        usdc.transfer(user, 1000 * 10 ** 6); // 1000 USDC
    }

    function testReceivePayment() public {
        address merchant = address(0xABCD);
        uint256 amount = 100 * 10 ** 6; // 100 USDC

        // Actuar como el usuario
        vm.startPrank(user);

        // Aprobar el gasto
        usdc.approve(address(equiProtocol), amount);

        // Configurar la expectativa del evento
        vm.expectEmit(true, false, false, true);
        emit EquiProtocolMVP.PaymentProcessed(
            merchant,
            amount,
            block.timestamp
        );

        // Llamar a la función que emite el evento
        equiProtocol.receivePayment(payable(merchant), amount);

        vm.stopPrank();

        // Verificar balances
        assertEq(usdc.balanceOf(user), 900 * 10 ** 6); // 900 USDC
        assertEq(usdc.balanceOf(address(equiProtocol)), amount); // 100 USDC
    }
}
