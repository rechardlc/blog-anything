// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
// 实现ERC20代币标准
contract RichardToken {
    using SafeMath for uint256;
    // constant 常量，不可变量, 节约gas，提高效率
    string public constant NAME = "RichardToken";
    string public constant SYMBOL = "RTK";
    uint8 public constant DECIMALS = 18;
    // immutable 不可变量，只能初始化一次，合约部署后，totalSupply的值就不能再修改了，节约gas，提高效率
    // 在constructor中只能赋值，不能读取值
    uint256 public immutable totalSupply;

    mapping(address => uint256) public balanceOf; // 类似一个数据库，只不过存在链上的
    // 授权的金额, 结构是 owner => spender => value
    mapping(address => mapping(address => uint256)) public allowance; // 类似一个数据库，只不过存在链上的
    // 转账事件，记录日志，记录转账的from、to、value
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    // 构造函数，初始化代币总量，初始化发行者账户的余额
    constructor() {
        totalSupply = 100000000 * 10 ** DECIMALS;
        // 初始化发行者账户的余额，地址来自部署合约的账户
        // 直接使用计算值，而不是读取 immutable 变量
        balanceOf[msg.sender] = 100000000 * 10 ** DECIMALS;
    }

    // 转账函数，转账的from、to、value
    function transfer(address to, uint256 value) public returns (bool success) {
        return _transfer(msg.sender, to, value);
    }
    function transferFrom(address from, address to, uint256 value) public returns (bool success) {
        if(!verifyAddress(from, string("Invalid from address"))) {
            return false;
        }
        if(!verifyAddress(to, string("Invalid to address"))) {
            return false;
        }
        // 检查from账户是否有足够的余额
        require(balanceOf[from] >= value, "Insufficient balance");
        require(allowance[from][msg.sender] >= value, "Insufficient allowance");
        // 从form账户扣钱
        allowance[from][msg.sender] = allowance[from][msg.sender].sub(value);
        return _transfer(from, to, value);
    }
    // 授权函数
    function approve(address spender, uint256 value) public returns (bool success) {
        // msg.sender 是当前合约的调用者
        // spender 是授权的地址
        // value 是授权的金额
        if(!verifyAddress(spender, string("Invalid spender address"))) {
            return false;
        }
        allowance[msg.sender][spender] = value;
        // 触发授权事件
        emit Approval(msg.sender, spender, value);
        return true;
    }
        // 转账函数，转账的from、to、value
    // internal修饰符 内部函数，只能被当前合约调用，不能被外部调用
    function _transfer(address from, address to, uint256 value) internal returns (bool success) {
        // 使用SafeMath库的sub和add函数，防止溢出，节约gas，提高效率
        balanceOf[from] = balanceOf[from].sub(value);
        // 使用SafeMath库的sub和add函数，防止溢出，节约gas，提高效率
        balanceOf[to] = balanceOf[to].add(value);
        // 触发转账事件
        emit Transfer(from, to, value);
        // 返回true，表示转账成功
        return true;
    }
    // calldata 是只读的，不能修改：传递参数时，需要明确指定类型：eg（ string("Invalid spender address")）
    // internal 内部函数，只能被当前合约调用，不能被外部调用
    // pure 纯函数，不会修改状态变量，不会消耗gas
    function verifyAddress(address addr, string memory message) internal pure returns (bool success) {
        require(addr != address(0), message);
        return addr != address(0);
    }
    function verifyValue(uint256 value, string calldata message) internal pure returns (bool success) {
        require(value > 0, message);
        return value > 0;
    }
}

// web3开发，一定要考虑边界问题！！！