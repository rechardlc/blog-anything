// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

import "./richardToken.sol";
contract Exchange {
    using SafeMath for uint256;
    // 收费账户地址
    address public immutable feeAccount;
    // 收费比例
    uint256 public immutable feePercentage;

    address public constant ETHER = address(0);

    mapping(address => mapping(address => uint256)) public tokens;
    
    constructor(address _feeAccount, uint256 _feePercentage) {
        feeAccount = _feeAccount;
        feePercentage = _feePercentage;
    }
    
    event Deposit(address token, address user, uint256 amount, uint256 balance);
    event Withdraw(address token, address user, uint256 amount, uint256 balance);

    function depositEther() public payable {
        tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].add(msg.value);
        emit Deposit(ETHER, msg.sender, msg.value, tokens[ETHER][msg.sender]);
    }
    // 存款代币
    function depositToken(address _token, uint256 _amount) public {
        require(_token != ETHER, "Not allowed to deposit Ether");
        require(_amount > 0, "Amount must be greater than 0");
        require(RichardToken(_token).transferFrom(msg.sender, address(this), _amount), "Transfer failed");
        tokens[_token][msg.sender] = tokens[_token][msg.sender].add(_amount);
        emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }
    // 提现ETH
    function withdrawEther(uint256 amount) public {
        require(tokens[ETHER][msg.sender] >= amount, "Insufficient balance");
        require(amount > 0, "Amount must be greater than 0");
        tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].sub(amount);
        // payable(msg.sender) 是 payable 类型的地址，可以接收ETH,为了安全，以太坊安全地址
        payable(msg.sender).transfer(amount);
        emit Withdraw(ETHER, msg.sender, amount, tokens[ETHER][msg.sender]);
    }
    // 提现代币
    function withdrawToken(address _token, uint256 _amount) public {
        require(_token != ETHER, "Not allowed to withdraw Ether");
        require(_amount > 0, "Amount must be greater than 0");
        require(tokens[_token][msg.sender] >= _amount, "Insufficient balance");
        tokens[_token][msg.sender] = tokens[_token][msg.sender].sub(_amount);
        // msg.sender 是当前合约的调用者, 调用者的地址
        require(RichardToken(_token).transfer(msg.sender, _amount), "Transfer failed");
        emit Withdraw(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }
}