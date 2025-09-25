// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Exchange} from "./exchange.sol";
import {RichardToken} from "./richardToken.sol";
import {Test} from "forge-std/Test.sol";
import {Vm} from "forge-std/Vm.sol";

contract ExchangeTest is Test {
    // 常量
    address internal constant ETHER = address(0);

    // 被测合约与依赖
    Exchange internal exchange;
    RichardToken internal token;
    RichardToken internal tokenB; // 第二个代币，用于撮合对

    // 账户
    address internal feeAccount;
    uint256 internal feePercentage;
    address internal maker; // 挂单者
    address internal filler; // 吃单者

    // 事件（复制被测合约中的签名以供 expectEmit 使用）
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
    event OrderCancelled(bytes32 indexed orderHash, address indexed user, uint256 timestamp);
    event OrderFilled(
        bytes32 indexed orderHash,
        address indexed user,
        address indexed filler,
        uint256 amount,
        uint256 timestamp
    );

    function setUp() public {
        feeAccount = address(0xFEE);
        feePercentage = 100; // 1%
        token = new RichardToken();
        tokenB = new RichardToken();
        exchange = new Exchange(feeAccount, feePercentage);

        maker = address(0xA11CE);
        filler = address(0xB0B);

        // 赋予测试账户 ETH
        vm.deal(maker, 100 ether);
        vm.deal(filler, 100 ether);

        // 将部分代币转给 maker 和 filler，便于测试
        // 测试合约部署时初始代币在本合约地址
        uint256 amount = 10_000 * (10 ** token.DECIMALS());
        // 从本合约转给 maker、filler
        token.transfer(maker, amount / 2);
        token.transfer(filler, amount / 4);
        // 为 tokenB 也分配一些余额
        tokenB.transfer(filler, amount / 2);
        tokenB.transfer(maker, amount / 4);
    }

    // ===== 存取款 =====
    function test_DepositEtherAndWithdrawEther() public {
        uint256 depositAmount = 5 ether;

        vm.prank(maker);
        vm.expectEmit(true, true, false, true, address(exchange));
        emit Deposit(ETHER, maker, depositAmount, depositAmount);
        exchange.depositEther{value: depositAmount}();
        assertEq(exchange.balanceOf(ETHER, maker), depositAmount);

        uint256 withdrawAmount = 2 ether;
        vm.prank(maker);
        vm.expectEmit(true, true, false, true, address(exchange));
        emit Withdraw(ETHER, maker, withdrawAmount, depositAmount - withdrawAmount);
        exchange.withdrawEther(withdrawAmount);
        assertEq(exchange.balanceOf(ETHER, maker), depositAmount - withdrawAmount);
    }

    function test_DepositTokenAndWithdrawToken() public {
        uint256 depositAmount = 1_000 * (10 ** token.DECIMALS());

        // 授权并存入
        vm.prank(maker);
        token.approve(address(exchange), depositAmount);
        vm.prank(maker);
        vm.expectEmit(true, true, false, true, address(exchange));
        emit Deposit(address(token), maker, depositAmount, depositAmount);
        exchange.depositToken(address(token), depositAmount);
        assertEq(exchange.balanceOf(address(token), maker), depositAmount);

        // 提取
        uint256 withdrawAmount = 400 * (10 ** token.DECIMALS());
        vm.prank(maker);
        vm.expectEmit(true, true, false, true, address(exchange));
        emit Withdraw(address(token), maker, withdrawAmount, depositAmount - withdrawAmount);
        exchange.withdrawToken(address(token), withdrawAmount);
        assertEq(exchange.balanceOf(address(token), maker), depositAmount - withdrawAmount);
    }

    function test_WithdrawEther_RevertWhen_InsufficientBalance() public {
        vm.prank(maker);
        vm.expectRevert(bytes("Insufficient balance"));
        exchange.withdrawEther(1 ether);
    }

    function test_DepositToken_RevertWhen_TokenIsEther() public {
        vm.prank(maker);
        vm.expectRevert(bytes("Use depositEther for ETH"));
        exchange.depositToken(ETHER, 1);
    }

    // ===== 订单生命周期：创建、撤销、成交 =====
    function test_MakeAndCancelOrder() public {
        uint256 giveAmount = 300 * (10 ** token.DECIMALS()); // maker 给出 token (A)
        uint256 getAmount = 500 * (10 ** tokenB.DECIMALS()); // maker 想得到 tokenB

        // maker 先将 token(A) 存入交易所
        vm.prank(maker);
        token.approve(address(exchange), giveAmount);
        vm.prank(maker);
        exchange.depositToken(address(token), giveAmount);

        // 监听日志，获取订单哈希
        vm.recordLogs();
        vm.prank(maker);
        exchange.makeOrder(address(tokenB), getAmount, address(token), giveAmount);
        Vm.Log[] memory entries = vm.getRecordedLogs();
        // 最后一条应为 OrderCreated
        bytes32 orderHash = entries[entries.length - 1].topics[1];

        // 取消订单
        vm.prank(maker);
        vm.expectEmit(true, true, false, true, address(exchange));
        emit OrderCancelled(orderHash, maker, block.timestamp);
        exchange.cancelOrder(orderHash);
        // getOrder 校验 cancelled 标志
        (
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            bool cancelled
        ) = exchange.getOrder(orderHash);
        assertTrue(cancelled, "order should be cancelled");
    }

    function test_FillOrder_EndToEnd() public {
        uint256 giveAmount = 200 * (10 ** token.DECIMALS());   // maker 给出 token(A)
        uint256 getAmount = 500 * (10 ** tokenB.DECIMALS());   // maker 想得到 tokenB

        // maker：准备 token(A) 余额（授权+存入）
        vm.prank(maker);
        token.approve(address(exchange), giveAmount);
        vm.prank(maker);
        exchange.depositToken(address(token), giveAmount);

        // filler：准备 tokenB 余额（授权+存入），数量需包含手续费
        uint256 feeAmount = (getAmount * feePercentage) / 10000;
        vm.prank(filler);
        tokenB.approve(address(exchange), getAmount + feeAmount);
        vm.prank(filler);
        exchange.depositToken(address(tokenB), getAmount + feeAmount);

        // maker 创建订单
        vm.recordLogs();
        vm.prank(maker);
        exchange.makeOrder(address(tokenB), getAmount, address(token), giveAmount);
        Vm.Log[] memory logs1 = vm.getRecordedLogs();
        bytes32 orderHash = logs1[logs1.length - 1].topics[1];

        // 成交订单（由 filler 吃单）
        vm.prank(filler);
        vm.expectEmit(true, true, true, true, address(exchange));
        emit OrderFilled(orderHash, maker, filler, getAmount, block.timestamp);
        exchange.fillOrder(orderHash);

        // 校验交易后余额（交易所在账本）
        // maker 在交易所的 tokenB 增加 getAmount
        assertEq(exchange.balanceOf(address(tokenB), maker), getAmount);
        // filler 在交易所的 tokenB 减少 getAmount + fee（余额应为 0）
        assertEq(exchange.balanceOf(address(tokenB), filler), 0);
        // 手续费账户收到 fee（以 tokenB 计）
        assertEq(exchange.balanceOf(address(tokenB), feeAccount), feeAmount);

        // token(A) 方向：maker 的 token(A) 减少 giveAmount，filler 增加 giveAmount
        assertEq(exchange.balanceOf(address(token), maker), 0);
        assertEq(exchange.balanceOf(address(token), filler), giveAmount);
    }

    function test_MakeOrder_RevertWhen_InsufficientBalance() public {
        // maker 未存入 tokenB，直接以 tokenB 作为 give 挂单应失败
        // 使用不同代币以避免 "Cannot trade same token" 检查先触发
        vm.prank(maker);
        vm.expectRevert(bytes("Insufficient balance for order"));
        exchange.makeOrder(address(token), 1, address(tokenB), 1);
    }
}
