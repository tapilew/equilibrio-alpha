// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import {Script, console} from "forge-std/Script.sol";
import {FundMe} from "../src/FundMe.sol";
import {Config} from "./Config.s.sol";

contract FundFundMe is Script {
    uint256 SEND_VALUE = 1 ether;

    function fundFundMe(address mostRecentlyDeployed) public {
        Config config = new Config();
        Config.NetworkConfig memory networkConfig = config.getConfig();

        vm.startBroadcast(networkConfig.deployerKey);
        FundMe(payable(mostRecentlyDeployed)).fund{value: SEND_VALUE}();
        console.log("Funded FundMe with %s", SEND_VALUE);
        vm.stopBroadcast();
    }

    function run() external {
        Config config = new Config();
        Config.NetworkConfig memory networkConfig = config.getConfig();
        fundFundMe(networkConfig.fundMeAddress);
    }
}

contract WithdrawFundMe is Script {
    function withdrawFundMe(address mostRecentlyDeployed) public {
        Config config = new Config();
        Config.NetworkConfig memory networkConfig = config.getConfig();

        vm.startBroadcast(networkConfig.deployerKey);
        FundMe(payable(mostRecentlyDeployed)).withdraw();
        console.log("Withdraw FundMe balance!");
        vm.stopBroadcast();
    }

    function run() external {
        Config config = new Config();
        Config.NetworkConfig memory networkConfig = config.getConfig();
        withdrawFundMe(networkConfig.fundMeAddress);
    }
}
