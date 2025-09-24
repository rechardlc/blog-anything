// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title RichardToken
 * @dev ERC20标准 代币合约实现
 * @notice 这是一个优化的 ERC20 代币合约，具有更高的安全性和 gas 效率
 */
contract RichardToken {
    
    // 代币基本信息 - 使用 constant 优化 gas
    string public constant NAME = "RichardToken";
    string public constant SYMBOL = "RTK";
    uint8 public constant DECIMALS = 18;
    
    // 总供应量 - 使用 immutable 优化 gas
    uint256 public immutable totalSupply;

    // 余额映射
    mapping(address => uint256) public balanceOf;
    
    // 授权映射
    mapping(address => mapping(address => uint256)) public allowance;
    
    // 重入攻击保护
    bool private locked;
    
    // 事件定义 - 优化 gas
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    // 构造函数 - 优化 gas 和安全性
    constructor() {
        // 这个是一个科学计数法
        uint256 initialSupply = 10000 * 10 ** DECIMALS;
        totalSupply = initialSupply;
        balanceOf[msg.sender] = initialSupply;
        emit Transfer(address(0), msg.sender, initialSupply);
    }
    
    // 重入攻击保护修饰符
    modifier nonReentrant() {
        require(!locked, "Reentrant call");
        locked = true;
        _;
        locked = false;
    }

    // 转账函数 - 优化 gas 和安全性
    function transfer(address to, uint256 value) public nonReentrant returns (bool success) {
        require(to != address(0), "Transfer to zero address");
        require(value > 0, "Transfer amount must be greater than 0");
        return _transfer(msg.sender, to, value);
    }
    
    // 授权转账函数 - 优化 gas 和安全性
    function transferFrom(address from, address to, uint256 value) public nonReentrant returns (bool success) {
        require(from != address(0), "Transfer from zero address");
        require(to != address(0), "Transfer to zero address");
        require(value > 0, "Transfer amount must be greater than 0");
        require(balanceOf[from] >= value, "Insufficient balance");
        require(allowance[from][msg.sender] >= value, "Insufficient allowance");
        
        // 先更新授权额度，再执行转账（CEI 模式）
        allowance[from][msg.sender] = allowance[from][msg.sender] - value;
        return _transfer(from, to, value);
    }
    // 授权函数 - 优化 gas 和安全性
    function approve(address spender, uint256 value) public returns (bool success) {
        require(spender != address(0), "Approve to zero address");
        require(spender != msg.sender, "Approve to self");
        
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }
    
    // 增加授权额度 - ERC20 标准扩展
    function increaseAllowance(address spender, uint256 addedValue) public returns (bool success) {
        require(spender != address(0), "Approve to zero address");
        require(spender != msg.sender, "Approve to self");
        
        uint256 newAllowance = allowance[msg.sender][spender] + addedValue;
        allowance[msg.sender][spender] = newAllowance;
        emit Approval(msg.sender, spender, newAllowance);
        return true;
    }
    
    // 减少授权额度 - ERC20 标准扩展
    function decreaseAllowance(address spender, uint256 subtractedValue) public returns (bool success) {
        require(spender != address(0), "Approve to zero address");
        require(allowance[msg.sender][spender] >= subtractedValue, "Decreased allowance below zero");
        
        uint256 newAllowance = allowance[msg.sender][spender] - subtractedValue;
        allowance[msg.sender][spender] = newAllowance;
        emit Approval(msg.sender, spender, newAllowance);
        return true;
    }
    // 内部转账函数 - 优化 gas 和安全性
    function _transfer(address from, address to, uint256 value) internal returns (bool success) {
        require(balanceOf[from] >= value, "Insufficient balance");
        
        balanceOf[from] = balanceOf[from] - value;
        balanceOf[to] = balanceOf[to] + value;
        
        // 触发转账事件
        emit Transfer(from, to, value);
        return true;
    }
    
    // 查询余额 - 优化 gas
    function getBalance(address account) public view returns (uint256) {
        return balanceOf[account];
    }
    
    // 查询授权额度 - 优化 gas
    function getAllowance(address owner, address spender) public view returns (uint256) {
        return allowance[owner][spender];
    }
    
    // 查询总供应量 - 优化 gas
    function getTotalSupply() public view returns (uint256) {
        return totalSupply;
    }
}

// web3开发，一定要考虑边界问题！！！