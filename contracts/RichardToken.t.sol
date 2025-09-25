// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import {RichardToken} from "./richardToken.sol";
import {Test} from "forge-std/Test.sol";

import {console} from "forge-std/console.sol";

/**
 * 测试 RichardToken 合约的覆盖点（建议）：
 * 1) 初始状态
 *    - NAME/SYMBOL/DECIMALS 是否符合预期
 *    - totalSupply 数值是否正确
 *    - 部署者是否持有全部初始供应，并触发一次 Transfer(0x0 -> deployer, supply)
 * 2) transfer 转账
 *    - 正常转账的余额变化与 Transfer 事件
 *    - 向零地址转账应 revert（"Transfer to zero address"）
 *    - 金额为 0 应 revert（"Transfer amount must be greater than 0"）
 *    - 余额不足应 revert（"Insufficient balance"）
 * 3) approve/allowance 授权
 *    - 正常 approve 设置额度与 Approval 事件
 *    - 向零地址 approve 应 revert（"Approve to zero address"）
 *    - 向自身 approve 应 revert（"Approve to self"）
 *    - increaseAllowance/decreaseAllowance 增减后额度正确与事件
 *    - decreaseAllowance 使额度低于 0 应 revert（"Decreased allowance below zero"）
 * 4) transferFrom 授权转账
 *    - 授权足额时正常转账、余额变化、授权被扣减、事件准确
 *    - 授权不足应 revert（"Insufficient allowance"）
 *    - from/to 为零地址的非法参数应按合约要求 revert
 * 5) 事件准确性
 *    - Transfer 与 Approval 事件的 indexed 参数与取值
 *    - 构造函数首个 Transfer 事件的 from = address(0)
 * 6) 只读接口
 *    - getBalance/getAllowance/getTotalSupply 返回与状态一致
 * 7) 安全与边界
 *    - CEI 模式：先扣减授权再转账，失败时状态不改变
 *    - nonReentrant 修饰符在可达路径下的基本有效性
 */

// 必须继承Test
contract RichardTokenTest is Test {
  RichardToken internal token;

  // 为了在本测试合约中可见并用于 vm.expectEmit + emit 期望
  event Transfer(address indexed from, address indexed to, uint256 value);

  // setup本质的作用是隔离，让每个测试用例都保持纯净状态
  function setUp() public {
    token = new RichardToken();
  }

  // 测试函数必须test开头，否则不会被测试, 测试函数必须public，否则不会被测试, 测试函数必须view，否则不会被测试
  // ============== 测试初始状态函数 ================
  // 测试供应量
  function testInitialSupply() public view {
    uint256 supply = token.getTotalSupply();
    require(
      token.balanceOf(address(this)) == supply,
      'initial supply should be owned by deployer'
    );
    require(token.totalSupply() == supply, 'total supply should be 10000');
  }

  // 测试名称
  function testName() public view {
    require(
      keccak256(bytes(token.NAME())) == keccak256(bytes('RichardToken')),
      'name should be RichardToken'
    );
  }

  // 测试符号
  function testSymbol() public view {
    require(
      keccak256(bytes(token.SYMBOL())) == keccak256(bytes('RTK')),
      'symbol should be RTK'
    );
  }

  // 测试小数位
  function testDecimals() public view {
    require(uint256(token.DECIMALS()) == uint256(18), 'decimals should be 18');
  }

  // 测试转账
  function testTransfer() public {
    address alice = address(0xA11CE);
    uint256 amount = 100 * 10 ** token.DECIMALS();
    token.transfer(alice, amount);
    require(token.balanceOf(alice) == amount, 'transfer should be successful');
  }

  // 测试部署者是否持有全部初始供应
  function testInitialSupplyAssignedToDeployer() public view {
    uint256 supply = token.getTotalSupply();
    require(
      token.balanceOf(address(this)) == supply,
      'initial supply should be owned by deployer'
    );
  }

  // ================ 测试转账功能 ==============
  // 测试正常转账的余额变化与transfer事件
  function testTransferSuccess() public {
    uint256 amount = 100 * 10 ** token.DECIMALS();
    token.transfer(address(1), amount);
    require(
      token.balanceOf(address(1)) == amount,
      'transfer should be successful'
    );
    require(
      token.balanceOf(address(this)) == token.getTotalSupply() - amount,
      'deployer balance should decrease'
    );
  }

  // 测试tranfer事件触发
  function testTransferEmitsEvent() public {
    address to = address(0xBEEF);
    uint256 amount = 100 * 10 ** token.DECIMALS();

    // 检查 topic1(from)、topic2(to)、不检查 topic3、检查 data；并限定事件来源为 token
    vm.expectEmit(true, true, false, true, address(token));
    emit Transfer(address(this), to, amount);

    token.transfer(to, amount);

    // 可选的余额断言（更完整）
    require(token.balanceOf(to) == amount, 'balance of to should be amount');
    require(
      token.balanceOf(address(this)) == token.getTotalSupply() - amount,
      'balance of deployer should be total supply minus amount'
    );
  }

  // 构造函数应触发首个 Transfer(0x0 -> deployer, supply)
  function testConstructorEmitsInitialTransfer() public {
    uint256 expected = 10000 * 10 ** token.DECIMALS();

    // 期望构造阶段事件（来源地址无需限定）
    vm.expectEmit(true, true, false, true);
    emit Transfer(address(0), address(this), expected);

    RichardToken fresh = new RichardToken();
    require(
      fresh.balanceOf(address(this)) == expected,
      'initial supply to deployer'
    );
  }

  // 授权路径：transferFrom 应触发 Transfer(from,to,value)
  function testTransferFromEmitsEvent() public {
    address spender = address(0xA11CE);
    address to = address(0xB0B);
    uint256 amount = 5 * 10 ** token.DECIMALS();

    token.approve(spender, amount);

    vm.prank(spender);
    vm.expectEmit(true, true, false, true, address(token));
    emit Transfer(address(this), to, amount);

    bool ok = token.transferFrom(address(this), to, amount);
    require(ok, 'transferFrom should succeed');
    require(token.balanceOf(to) == amount, 'bob should receive amount');
  }

  // 转给零地址应 revert（不会产生成功的 Transfer 事件）
  function testTransferToZeroAddressReverts() public {
    vm.expectRevert(bytes('Transfer to zero address'));
    token.transfer(address(0), 1);
  }

  // 金额为 0 应 revert（不会产生成功的 Transfer 事件）
  function testTransferZeroAmountReverts() public {
    vm.expectRevert(bytes('Transfer amount must be greater than 0'));
    token.transfer(address(0xBEEF), 0);
  }

  // 余额不足应 revert（不会产生成功的 Transfer 事件）
  function testTransferInsufficientBalanceReverts() public {
    address alice = address(0xA11CE);
    vm.prank(alice);
    vm.expectRevert(bytes('Insufficient balance'));
    token.transfer(address(0xB0B), 1);
  }

  // ========= Fuzz Tests =========
  // 随机地址与金额：验证余额不变量与供应量一致性
  function testFuzz_Transfer_BalancesHold(address to, uint256 amount) public {
    vm.assume(to != address(0));
    vm.assume(to != address(this));

    uint256 senderBal = token.balanceOf(address(this));
    if (senderBal == 0) return;
    amount = bound(amount, 1, senderBal);

    uint256 toBefore = token.balanceOf(to);
    uint256 meBefore = senderBal;

    bool ok = token.transfer(to, amount);
    require(ok, 'transfer should succeed');

    require(
      token.getTotalSupply() == token.totalSupply(),
      'supply view mismatch'
    );
    require(token.balanceOf(address(this)) == meBefore - amount, 'sender down');
    require(token.balanceOf(to) == toBefore + amount, 'to up');
  }

  // 随机授权与受益人：验证 transferFrom 的余额与授权扣减
  function testFuzz_TransferFrom_BalancesAndAllowance(
    address spender,
    address to,
    uint256 amount
  ) public {
    vm.assume(spender != address(0));
    vm.assume(to != address(0));
    vm.assume(spender != address(this));
    vm.assume(to != address(this));

    uint256 senderBal = token.balanceOf(address(this));
    if (senderBal == 0) return;
    amount = bound(amount, 1, senderBal);

    token.approve(spender, amount);

    uint256 toBefore = token.balanceOf(to);
    vm.prank(spender);
    bool ok = token.transferFrom(address(this), to, amount);
    require(ok, 'transferFrom should succeed');

    require(
      token.getAllowance(address(this), spender) == 0,
      'allowance reduced'
    );
    require(token.balanceOf(to) == toBefore + amount, 'to up');
  }
}
