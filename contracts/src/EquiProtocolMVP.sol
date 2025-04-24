// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract EquiProtocolMVP is ReentrancyGuard, AccessControl {
    bytes32 public constant TREASURY_ROLE = keccak256("TREASURY_ROLE");
    bytes32 public constant MERCHANT_ROLE = keccak256("MERCHANT_ROLE");
    
    IERC20 public usdc;
    address public treasury;
    
    // Mapping para pagos aprobados
    mapping(address => mapping(address => uint256)) public approvedPayments;
    
    // Mapping para negocios registrados
    mapping(address => bool) public registeredMerchants;
    
    // Mapping para clientes de cada negocio
    mapping(address => mapping(address => bool)) public merchantCustomers;
    
    // Mapping para información de facturación de comerciantes
    mapping(address => string) public merchantTaxIds;
    mapping(address => string) public merchantNames;
    mapping(address => string) public merchantAddresses;
    
    // Mapping para almacenar descripciones de pagos
    mapping(address => mapping(address => string)) public paymentDescriptions;
    
    // Array para mantener lista de negocios (para consultas)
    address[] public merchantsList;
    
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
    
    event MerchantRegistered(
        address indexed merchant,
        string name,
        string taxId,
        string businessAddress,
        uint256 timestamp
    );
    
    event CustomerAdded(
        address indexed merchant,
        address indexed customer,
        uint256 timestamp
    );
    
    constructor(address _usdc, address _treasury) {
        require(_usdc != address(0), "Invalid USDC address");
        require(_treasury != address(0), "Invalid treasury address");
        
        usdc = IERC20(_usdc);
        treasury = _treasury;
        
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(TREASURY_ROLE, _treasury);
    }
    
    function registerMerchant(
        address merchant,
        string memory name,
        string memory taxId,
        string memory businessAddress
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(merchant != address(0), "Invalid merchant address");
        require(!registeredMerchants[merchant], "Merchant already registered");
        require(bytes(name).length > 0, "Name is required");
        require(bytes(taxId).length > 0, "Tax ID is required");
        require(bytes(businessAddress).length > 0, "Business address is required");
        
        registeredMerchants[merchant] = true;
        merchantsList.push(merchant);
        merchantNames[merchant] = name;
        merchantTaxIds[merchant] = taxId;
        merchantAddresses[merchant] = businessAddress;
        _setupRole(MERCHANT_ROLE, merchant);
        
        emit MerchantRegistered(merchant, name, taxId, businessAddress, block.timestamp);
    }
    
    function addCustomer(address merchant, address customer) external onlyRole(MERCHANT_ROLE) {
        require(registeredMerchants[merchant], "Merchant not registered");
        require(customer != address(0), "Invalid customer address");
        require(!merchantCustomers[merchant][customer], "Customer already added");
        
        merchantCustomers[merchant][customer] = true;
        
        emit CustomerAdded(merchant, customer, block.timestamp);
    }
    
    function approvePayment(
        address recipient,
        uint256 amount,
        string memory paymentReference,
        string memory description
    ) external {
        require(recipient != address(0), "Invalid recipient");
        require(amount > 0, "Amount must be greater than 0");
        require(registeredMerchants[recipient], "Recipient not registered as merchant");
        require(bytes(paymentReference).length > 0, "Payment reference is required");
        
        // Transfer USDC from sender to this contract
        require(usdc.transferFrom(msg.sender, address(this), amount), "USDC transfer failed");
        
        approvedPayments[msg.sender][recipient] = amount;
        paymentDescriptions[msg.sender][recipient] = description;
    }
    
    function executePayment(
        address recipient,
        uint256 amount,
        string memory paymentReference,
        string memory description
    ) external nonReentrant {
        require(approvedPayments[msg.sender][recipient] >= amount, "Insufficient approved amount");
        require(registeredMerchants[recipient], "Recipient not registered as merchant");
        require(bytes(paymentReference).length > 0, "Payment reference is required");
        require(
            keccak256(bytes(paymentDescriptions[msg.sender][recipient])) == keccak256(bytes(description)),
            "Description mismatch"
        );
        
        approvedPayments[msg.sender][recipient] -= amount;
        
        // Transfer USDC to recipient (100% of the amount)
        require(usdc.transfer(recipient, amount), "Recipient transfer failed");
        
        emit PaymentProcessed(
            msg.sender,
            recipient,
            amount,
            block.timestamp,
            merchantNames[recipient],
            merchantTaxIds[recipient],
            merchantAddresses[recipient],
            paymentReference,
            description
        );
    }
    
    function updateTreasury(address newTreasury) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(newTreasury != address(0), "Invalid treasury address");
        treasury = newTreasury;
    }
    
    function updateUSDC(address newUSDC) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(newUSDC != address(0), "Invalid USDC address");
        usdc = IERC20(newUSDC);
    }
    
    function getMerchantsCount() external view returns (uint256) {
        return merchantsList.length;
    }
    
    function getMerchantAtIndex(uint256 index) external view returns (address) {
        require(index < merchantsList.length, "Index out of bounds");
        return merchantsList[index];
    }
    
    function isCustomerOfMerchant(address merchant, address customer) external view returns (bool) {
        return merchantCustomers[merchant][customer];
    }
    
    function getMerchantInfo(address merchant) external view returns (
        string memory name,
        string memory taxId,
        string memory businessAddress
    ) {
        require(registeredMerchants[merchant], "Merchant not registered");
        return (
            merchantNames[merchant],
            merchantTaxIds[merchant],
            merchantAddresses[merchant]
        );
    }
}
