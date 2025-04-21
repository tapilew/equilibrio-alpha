// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import {Script} from "forge-std/Script.sol";

contract Config is Script {
    struct NetworkConfig {
        address fundMeAddress;
        uint256 deployerKey;
        string rpcUrl;
    }

    function getConfig() public pure returns (NetworkConfig memory) {
        return
            NetworkConfig({
                fundMeAddress: 0x5FC8d32690cc91D4c39d9d3abcBD16989F875707,
                deployerKey: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80,
                rpcUrl: "http://localhost:8545"
            });
    }
}
