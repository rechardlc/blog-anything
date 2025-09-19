// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
// 实现ERC20代币标准
contract RichardToken {
    using SafeMath for uint256;
    string public name = "RichardToken";
    string public symbol = "RTK";
    uint8 public decimals = 18;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    // 转账事件，记录日志，记录转账的from、to、value
    event Transfer(address indexed from, address indexed to, uint256 value);
    // 构造函数，初始化代币总量，初始化发行者账户的余额
    constructor() {
        totalSupply = 100000000 * 10 ** decimals;
        // 初始化发行者账户的余额，地址来自部署合约的账户
        balanceOf[msg.sender] = totalSupply;
    }

    // 转账函数，转账的from、to、value
    function transfer(address to, uint256 value) public returns (bool success) {
        require(to != address(0), "Invalid recipient address");
        require(balanceOf[msg.sender] >= value, "Insufficient balance");
        return _transfer(msg.sender, to, value);
    }
    // 转账函数，转账的from、to、value
    function _transfer(address from, address to, uint256 value) internal returns (bool success) {
        require(to != address(0), "Invalid recipient address");
        require(balanceOf[from] >= value, "Insufficient balance");
        balanceOf[from] = balanceOf[from].sub(value);
        balanceOf[to] = balanceOf[to].add(value);
        emit Transfer(from, to, value);
        return true;
    }
}