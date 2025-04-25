// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "../interfaces/IEquiPlugin.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract ElectronicInvoicePlugin is IEquiPlugin, AccessControl {
    bytes32 public constant INVOICE_MANAGER_ROLE = keccak256("INVOICE_MANAGER_ROLE");
    
    struct Invoice {
        bytes32 invoiceId;
        address seller;
        address buyer;
        uint256 amount;
        string invoiceNumber;
        uint256 timestamp;
        bool paid;
        bytes metadata;
    }
    
    mapping(bytes32 => Invoice) public invoices;
    mapping(address => bytes32[]) public sellerInvoices;
    
    event InvoiceCreated(
        bytes32 indexed invoiceId,
        address indexed seller,
        address indexed buyer,
        uint256 amount,
        string invoiceNumber
    );
    
    event InvoicePaid(bytes32 indexed invoiceId);
    
    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(INVOICE_MANAGER_ROLE, msg.sender);
    }
    
    function getMetadata() external view override returns (PluginMetadata memory) {
        return PluginMetadata({
            name: "Electronic Invoice Plugin",
            version: "1.0.0",
            description: "Plugin for managing electronic invoices",
            author: msg.sender,
            configuration: ""
        });
    }
    
    function initialize(bytes calldata) external pure override {
        // No initialization needed for this plugin
    }
    
    function execute(bytes calldata data) external override returns (bytes memory) {
        (
            address seller,
            address buyer,
            uint256 amount,
            string memory invoiceNumber,
            bytes memory metadata
        ) = abi.decode(data, (address, address, uint256, string, bytes));
        
        bytes32 invoiceId = keccak256(
            abi.encodePacked(
                seller,
                buyer,
                amount,
                invoiceNumber,
                block.timestamp,
                metadata
            )
        );
        
        require(invoices[invoiceId].invoiceId == bytes32(0), "Invoice already exists");
        
        invoices[invoiceId] = Invoice({
            invoiceId: invoiceId,
            seller: seller,
            buyer: buyer,
            amount: amount,
            invoiceNumber: invoiceNumber,
            timestamp: block.timestamp,
            paid: false,
            metadata: metadata
        });
        
        sellerInvoices[seller].push(invoiceId);
        
        emit InvoiceCreated(invoiceId, seller, buyer, amount, invoiceNumber);
        
        return abi.encode(invoiceId);
    }
    
    function validate(bytes calldata data) external pure override returns (bool) {
        (
            address seller,
            address buyer,
            uint256 amount,
            string memory invoiceNumber,
            // Unused parameter commented out to silence warning
            /*bytes memory metadata*/
        ) = abi.decode(data, (address, address, uint256, string, bytes));
        
        if (seller == address(0) || buyer == address(0) || amount == 0 || bytes(invoiceNumber).length == 0) {
            return false;
        }
        
        return true;
    }
    
    function markInvoiceAsPaid(bytes32 invoiceId) external onlyRole(INVOICE_MANAGER_ROLE) {
        require(invoices[invoiceId].invoiceId != bytes32(0), "Invoice does not exist");
        require(!invoices[invoiceId].paid, "Invoice already paid");
        
        invoices[invoiceId].paid = true;
        
        emit InvoicePaid(invoiceId);
    }
    
    function getSellerInvoices(address seller) external view returns (bytes32[] memory) {
        return sellerInvoices[seller];
    }
    
    function getInvoice(bytes32 invoiceId) external view returns (Invoice memory) {
        require(invoices[invoiceId].invoiceId != bytes32(0), "Invoice does not exist");
        return invoices[invoiceId];
    }
} 