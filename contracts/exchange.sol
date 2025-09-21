// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "openzeppelin-solidity/contracts/math/SafeMath.sol";


contract Exchange {
    using SafeMath for uint256;
    // 收费账户地址
    address public immutable feeAccount;
    // 收费比例
    uint256 public immutable feePercentage;
    constructor(address _feeAccount, uint256 _feePercentage) {
        feeAccount = _feeAccount;
        feePercentage = _feePercentage;
    }
}