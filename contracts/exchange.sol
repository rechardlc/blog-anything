// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

import "./richardToken.sol";

contract Exchange {
    using SafeMath for uint256;
    
    // 收费账户地址
    address public immutable feeAccount;
    // 收费比例 (基点，10000 = 100%)
    uint256 public immutable feePercentage;
    
    // ETH 地址常量
    address public constant ETHER = address(0);
    
    // 用户代币余额映射 [代币地址][用户地址] => 余额
    mapping(address => mapping(address => uint256)) public tokens;
    
    // 订单结构体 - 优化存储布局
    struct Order {
        uint256 id;                    // 订单ID
        address user;                  // 订单创建者
        address tokenGet;              // 要获得的代币
        uint256 tokenGetAmount;        // 要获得的代币数量
        address tokenGive;             // 要给出的代币
        uint256 tokenGiveAmount;       // 要给出的代币数量
        uint256 timestamp;             // 创建时间
        bool filled;                   // 是否已成交
        bool cancelled;                // 是否已取消
    }
    
    // 订单映射（使用哈希作为键）
    mapping(bytes32 => Order) public orders;
    
    // 重入攻击保护
    bool private locked;

    constructor(address _feeAccount, uint256 _feePercentage) {
        require(_feeAccount != address(0), "Invalid fee account");
        require(_feePercentage <= 10000, "Fee percentage too high"); // 最大 100%
        feeAccount = _feeAccount;
        feePercentage = _feePercentage;
    }
    
    // 重入攻击保护修饰符
    modifier nonReentrant() {
        require(!locked, "Reentrant call");
        locked = true;
        _;
        locked = false;
    }
    
    // 生成订单哈希 - 使用多个随机因子，无需 nonce
    function generateOrderHash(
        address _user,
        address _tokenGet,
        uint256 _tokenGetAmount,
        address _tokenGive,
        uint256 _tokenGiveAmount
    ) private view returns (bytes32) {
        return keccak256(abi.encodePacked(
            _user,
            _tokenGet,
            _tokenGetAmount,
            _tokenGive,
            _tokenGiveAmount,
            block.timestamp,
            block.difficulty,
            block.coinbase,
            block.number,
            msg.sender,
            address(this)
        ));
    }
    
    // 事件定义 - 优化 gas
    event Deposit(address indexed token, address indexed user, uint256 amount, uint256 balance);
    event Withdraw(address indexed token, address indexed user, uint256 amount, uint256 balance);
    event OrderCreated(
        bytes32 indexed orderHash, 
        address indexed user, 
        address tokenGet, 
        uint256 tokenGetAmount, 
        address tokenGive, 
        uint256 tokenGiveAmount, 
        uint256 timestamp
    );
    event OrderCancelled(
        bytes32 indexed orderHash,
         address indexed user,
         uint256 timestamp
         );
    event OrderFilled(
        bytes32 indexed orderHash, 
        address indexed user, 
        address indexed filler, 
        uint256 amount,
        uint256 timestamp
    );

    // ETH 存款 - 添加重入保护
    function depositEther() public payable nonReentrant {
        require(msg.value > 0, "Amount must be greater than 0");
        tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].add(msg.value);
        emit Deposit(ETHER, msg.sender, msg.value, tokens[ETHER][msg.sender]);
    }
    
    // 代币存款 - 优化 gas 和安全性
    function depositToken(address _token, uint256 _amount) public nonReentrant {
        require(_token != ETHER, "Use depositEther for ETH");
        require(_token != address(0), "Invalid token address");
        require(_amount > 0, "Amount must be greater than 0");
        
        // 先更新余额，再转账（防止重入攻击）
        tokens[_token][msg.sender] = tokens[_token][msg.sender].add(_amount);
        
        // 执行转账
        require(RichardToken(_token).transferFrom(msg.sender, address(this), _amount), "Transfer failed");
        
        emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }
    
    // ETH 提取 - 优化安全性
    function withdrawEther(uint256 _amount) public nonReentrant {
        require(_amount > 0, "Amount must be greater than 0");
        require(tokens[ETHER][msg.sender] >= _amount, "Insufficient balance");
        
        // 先更新余额
        tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].sub(_amount);
        
        // 使用 call 而不是 transfer，避免 gas 限制问题
        (bool success, ) = payable(msg.sender).call{value: _amount}("");
        require(success, "ETH transfer failed");
        
        emit Withdraw(ETHER, msg.sender, _amount, tokens[ETHER][msg.sender]);
    }
    
    // 代币提取 - 优化安全性
    function withdrawToken(address _token, uint256 _amount) public nonReentrant {
        require(_token != ETHER, "Use withdrawEther for ETH");
        require(_token != address(0), "Invalid token address");
        require(_amount > 0, "Amount must be greater than 0");
        require(tokens[_token][msg.sender] >= _amount, "Insufficient balance");
        
        // 先更新余额
        tokens[_token][msg.sender] = tokens[_token][msg.sender].sub(_amount);
        
        // 执行转账
        require(RichardToken(_token).transfer(msg.sender, _amount), "Transfer failed");
        
        emit Withdraw(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

    // 查询余额 - 优化 gas
    function balanceOf(address _token, address _user) public view returns (uint256) {
        return tokens[_token][_user];
    }
    
    // 创建订单 - 使用纯哈希 ID 系统： 创建者(exchange 本身)
    function makeOrder(
        address _tokenGet, 
        uint256 _tokenGetAmount, 
        address _tokenGive, 
        uint256 _tokenGiveAmount
    ) public {
        require(_tokenGet != address(0), "Invalid tokenGet address");
        require(_tokenGive != address(0), "Invalid tokenGive address");
        require(_tokenGetAmount > 0, "TokenGet amount must be greater than 0");
        require(_tokenGiveAmount > 0, "TokenGive amount must be greater than 0");
        require(_tokenGet != _tokenGive, "Cannot trade same token");
        
        // 检查用户是否有足够的代币来创建订单
        require(tokens[_tokenGive][msg.sender] >= _tokenGiveAmount, "Insufficient balance for order");
        
        // 生成唯一的订单哈希
        bytes32 orderHash = generateOrderHash(
            msg.sender,
            _tokenGet,
            _tokenGetAmount,
            _tokenGive,
            _tokenGiveAmount
        );
        
        // 检查哈希是否已存在（极低概率）
        require(orders[orderHash].user == address(0), "Order hash collision");
        
        // 创建订单
        Order memory newOrder = Order({
            id: 0, // 不再使用数字 ID
            user: msg.sender,
            tokenGet: _tokenGet,
            tokenGetAmount: _tokenGetAmount,
            tokenGive: _tokenGive,
            tokenGiveAmount: _tokenGiveAmount,
            timestamp: block.timestamp,
            filled: false,
            cancelled: false
        });
        
        // 存储订单
        orders[orderHash] = newOrder;
        
        emit OrderCreated(orderHash, msg.sender, _tokenGet, _tokenGetAmount, _tokenGive, _tokenGiveAmount, block.timestamp);
    }
    
    // 取消订单 - 使用哈希 ID
    function cancelOrder(bytes32 _orderHash) public {
        require(orders[_orderHash].user != address(0), "Order not found");
        Order storage order = orders[_orderHash];
        require(order.user == msg.sender, "Not order owner");
        require(!order.filled, "Order already filled");
        require(!order.cancelled, "Order already cancelled");
        
        order.cancelled = true;
        emit OrderCancelled(_orderHash, msg.sender, block.timestamp);
    }
    
    // 成交订单 - 使用哈希 ID
    function fillOrder(bytes32 _orderHash) public nonReentrant {
        require(orders[_orderHash].user != address(0), "Order not found");
        require(orders[_orderHash].tokenGiveAmount > 0, "Order tokenGiveAmount is 0");
        
        Order storage order = orders[_orderHash];
        require(!order.filled, "Order already filled");
        require(!order.cancelled, "Order cancelled");
        require(order.user != msg.sender, "Cannot fill own order");

                // 计算手续费
        uint256 feeAmount = order.tokenGetAmount.mul(feePercentage).div(10000);
        
        // 流动池子是否有足够的代币
        require(tokens[order.tokenGive][order.user] >= order.tokenGiveAmount, "Order owner insufficient balance");
        require(tokens[order.tokenGet][msg.sender] >= order.tokenGetAmount.add(feeAmount), "Filler insufficient balance");
        
        // 计算成交比例: 1 RTK: 100ETH 关系， 固定关系,后期左流动池子，动态换算
        // 手续费账户增加
        tokens[order.tokenGet][feeAccount] = tokens[order.tokenGet][feeAccount].add(feeAmount);
        // 发起者减少
        // tokens[order.tokenGet][msg.sender] = tokens[order.tokenGet][msg.sender].sub(feeAmount);

        // 执行交易： order是以发起者为对象
        // 先更新余额，再转账（防止重入攻击）
        // get是获取的币，give是减少的币
        // 创建者的币，tokenget币应该是增加
        tokens[order.tokenGet][order.user] = tokens[order.tokenGet][order.user].add(order.tokenGetAmount);
        // 发起者是币，tokenGet币应该是减少
        tokens[order.tokenGet][msg.sender] = tokens[order.tokenGet][msg.sender].sub(order.tokenGetAmount.add(feeAmount));
        // 币币交换
        tokens[order.tokenGive][order.user] = tokens[order.tokenGive][order.user].sub(order.tokenGiveAmount);
        // 发起者是币，tokenGive币应该是减少
        tokens[order.tokenGive][msg.sender] = tokens[order.tokenGive][msg.sender].add(order.tokenGiveAmount);        
        // 更新订单状态
        order.filled = true;
        emit OrderFilled(_orderHash, order.user, msg.sender, order.tokenGetAmount, block.timestamp);
    }
    
    // 获取订单信息（通过哈希）
    function getOrder(bytes32 _orderHash) public view returns (
        uint256 id,
        address user,
        address tokenGet,
        uint256 tokenGetAmount,
        address tokenGive,
        uint256 tokenGiveAmount,
        uint256 timestamp,
        bool filled,
        bool cancelled
    ) {
        require(orders[_orderHash].user != address(0), "Order not found");
        Order storage order = orders[_orderHash];
        return (
            order.id,
            order.user,
            order.tokenGet,
            order.tokenGetAmount,
            order.tokenGive,
            order.tokenGiveAmount,
            order.timestamp,
            order.filled,
            order.cancelled
        );
    }
    
    // 检查订单是否存在
    function orderExists(bytes32 _orderHash) public view returns (bool) {
        return orders[_orderHash].user != address(0);
    }
}