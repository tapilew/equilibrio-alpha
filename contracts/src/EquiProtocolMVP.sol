// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./InvoiceNFT.sol";

contract EquiProtocolMVP {
    // Tokens soportados
    mapping(address => bool) public supportedTokens;

    // Dirección de tesorería para recolectar comisiones
    address public treasury;

    // Porcentaje de comisión (en base 100, e.g., 2 = 2%)
    uint256 public feePercentage = 2;

    // Contrato de InvoiceNFT
    InvoiceNFT public invoiceNFT;

    // Base URI para el NFT
    string public baseURI;

    // Evento de pago con datos detallados
    event PaymentProcessed(
        address indexed payer,
        address indexed merchant,
        address indexed token,
        uint256 amount,
        uint256 netAmount,
        uint256 fee,
        uint256 timestamp,
        string invoiceId,
        string itemDetails
    );

    // Constructor con 2 argumentos: Dirección de tesorería y Base URI para el NFT
    constructor(address _treasury, string memory _baseURI) {
        require(_treasury != address(0), unicode"Tesorería inválida");
        treasury = _treasury;
        baseURI = _baseURI;
    }

    // Función para agregar tokens soportados
    function addSupportedToken(address token) external {
        require(
            token != address(0),
            unicode"Token no puede ser la dirección cero"
        );
        supportedTokens[token] = true;
    }

    // Función para eliminar tokens soportados
    function removeSupportedToken(address token) external {
        require(supportedTokens[token], "Token no soportado");
        supportedTokens[token] = false;
    }

    // Función para actualizar el porcentaje de comisión
    function setFeePercentage(uint256 _feePercentage) external {
        require(
            _feePercentage <= 100,
            unicode"Porcentaje de comisión inválido"
        );
        feePercentage = _feePercentage;
    }

    // Función para recibir pagos
    function receivePayment(
        address token,
        address payable merchant,
        uint256 amount,
        string memory invoiceId,
        string memory itemDetails
    ) public {
        require(supportedTokens[token], "Token no soportado");

        uint256 fee = (amount * feePercentage) / 100;
        uint256 netAmount = amount - fee;

        // Transferir el monto total del usuario al contrato
        bool transferFromSuccess = IERC20(token).transferFrom(
            msg.sender,
            address(this),
            amount
        );
        require(transferFromSuccess, "Transferencia desde el usuario fallida");

        // Transferir la comisión a la tesorería
        bool transferFeeSuccess = IERC20(token).transfer(treasury, fee);
        require(
            transferFeeSuccess,
            unicode"Transferencia de la comisión fallida"
        );

        // Transferir el monto neto al comerciante
        bool transferNetSuccess = IERC20(token).transfer(merchant, netAmount);
        require(transferNetSuccess, "Transferencia al comerciante fallida");

        // Emitir el evento de pago procesado
        emit PaymentProcessed(
            msg.sender,
            merchant,
            token,
            amount,
            netAmount,
            fee,
            block.timestamp,
            invoiceId,
            itemDetails
        );
    }
}
