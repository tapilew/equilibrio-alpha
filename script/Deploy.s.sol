// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/TuriCashDAO.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // USDC address on Arbitrum Sepolia
        address usdcAddress = 0x75Faf114eaF76bd870A1242f1a5AD5510F1f8cd1;

        TuriCashDAO dao = new TuriCashDAO(usdcAddress);

        console.log("TuriCashDAO deployed at:", address(dao));
        console.log("USDC address:", usdcAddress);

        vm.stopBroadcast();
    }
}
