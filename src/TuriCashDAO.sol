// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title TuriCashDAO
 * @dev A simple contract for recording transactions and managing a community fund for Panama's tourism communities
 */
contract TuriCashDAO is Ownable {
    // Events
    event TransactionRecorded(
        address indexed merchant,
        uint256 amount,
        uint256 timestamp
    );
    event CommunityFundUpdated(uint256 newBalance, uint256 timestamp);
    event FeeCollected(uint256 amount, uint256 timestamp);

    // State variables
    IERC20 public usdc;
    uint256 public communityFund;
    uint256 public constant FEE_PERCENTAGE = 18; // 1.8%
    uint256 public constant FEE_DENOMINATOR = 1000; // For precise percentage calculation

    // Structs
    struct Transaction {
        address merchant;
        uint256 amount;
        uint256 timestamp;
    }

    // Mappings
    mapping(address => Transaction[]) public merchantTransactions;
    mapping(address => uint256) public merchantTotalVolume;

    /**
     * @dev Constructor
     * @param _usdcAddress The address of the USDC token
     */
    constructor(address _usdcAddress) Ownable(msg.sender) {
        usdc = IERC20(_usdcAddress);
    }

    /**
     * @dev Record a transaction and update the community fund
     * @param _merchant The address of the merchant
     * @param _amount The amount of the transaction in USDC
     */
    function recordTransaction(address _merchant, uint256 _amount) external {
        require(_merchant != address(0), "Invalid merchant address");
        require(_amount > 0, "Amount must be greater than 0");

        // Calculate fee
        uint256 fee = (_amount * FEE_PERCENTAGE) / FEE_DENOMINATOR;
        uint256 merchantAmount = _amount - fee;

        // Update state
        Transaction memory newTransaction = Transaction({
            merchant: _merchant,
            amount: merchantAmount,
            timestamp: block.timestamp
        });

        merchantTransactions[_merchant].push(newTransaction);
        merchantTotalVolume[_merchant] += merchantAmount;
        communityFund += fee;

        // Emit events
        emit TransactionRecorded(_merchant, merchantAmount, block.timestamp);
        emit FeeCollected(fee, block.timestamp);
        emit CommunityFundUpdated(communityFund, block.timestamp);
    }

    /**
     * @dev Get the number of transactions for a merchant
     * @param _merchant The address of the merchant
     * @return The number of transactions
     */
    function getTransactionCount(
        address _merchant
    ) external view returns (uint256) {
        return merchantTransactions[_merchant].length;
    }

    /**
     * @dev Get a transaction for a merchant by index
     * @param _merchant The address of the merchant
     * @param _index The index of the transaction
     * @return The transaction
     */
    function getTransaction(
        address _merchant,
        uint256 _index
    ) external view returns (Transaction memory) {
        require(
            _index < merchantTransactions[_merchant].length,
            "Index out of bounds"
        );
        return merchantTransactions[_merchant][_index];
    }

    /**
     * @dev Withdraw funds from the community fund (only owner)
     * @param _amount The amount to withdraw
     * @param _recipient The address to receive the funds
     */
    function withdrawCommunityFund(
        uint256 _amount,
        address _recipient
    ) external onlyOwner {
        require(_amount <= communityFund, "Insufficient funds");
        require(_recipient != address(0), "Invalid recipient address");

        communityFund -= _amount;
        usdc.transfer(_recipient, _amount);

        emit CommunityFundUpdated(communityFund, block.timestamp);
    }
}
