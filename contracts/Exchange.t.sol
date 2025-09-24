// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import {Exchange} from "./Exchange.sol";
import {Test} from "forge-std/Test.sol";

contract ExchangeTest is Test {
    Exchange internal exchange;
    function setUp() public {
        exchange = new Exchange(address(0), 10000);
    }
}
