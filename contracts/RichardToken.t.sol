// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import {RichardToken} from "./RichardToken.sol";
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
    // setup本质的作用是隔离，让每个测试用例都保持纯净状态
    function setUp() public {
        token = new RichardToken();
    }
    // 测试函数必须test开头，否则不会被测试, 测试函数必须public，否则不会被测试, 测试函数必须view，否则不会被测试
    // =============== 测试初始变量 ============
    // 测试供应量
    function testInitialSupply() public view{
        uint256 supply = token.getTotalSupply();
        assertEq(token.balanceOf(address(this)), supply, "initial supply should be owned by deployer");
        assertEq(token.totalSupply(), supply, "total supply should be 10000");
    }
    // 测试名称
    function testName() public view{
        assertEq(token.NAME(), "RichardToken", "name should be RichardToken");
    }
    // 测试符号
    function testSymbol() public view{
        assertEq(token.SYMBOL(), "RTK", "symbol should be RTK");
    }
    // 测试小数位
    function testDecimals() public view{
        assertEq(uint256(token.DECIMALS()), uint256(18), "decimals should be 18");
    }
    // 测试初始供应量是否分配给部署者
    function testInitialSupplyAssignedToDeployer() public view{
        uint256 supply = token.totalSupply();
        assertEq(token.balanceOf(address(this)), supply, "initial supply should be owned by deployer");
    }
    // =============== 测试转账 ============
    // 测试转账是否成功
    function testTransfer() public {
        // 100个token
        uint256 amount = 100 * 10 ** token.DECIMALS();
        // 可以通过console.log();打印变量值, console.log()是一个库函数，需要import {console} from "forge-std/console.sol";
        console.log("amount", amount , "token.DECIMALS()", token.DECIMALS());
        // 转账给地址1
        token.transfer(address(1), amount);
        // 测试转账是否成功
        assertEq(token.balanceOf(address(1)), amount, "transfer should be successful");
    }
    // 测试转账到零地址是否失败
    function testTransferToZeroAddressReverts() public {
        // vm模拟EVM行为：expectRevert 期待一个错误信息，如果错误信息与预期不符，则测试失败
        vm.expectRevert(bytes("Transfer to zero address"));
        token.transfer(address(0), 1);
    }
    // 测试转账金额为0
    function testTransferAmountZeroReverts() public {
        vm.expectRevert(bytes("Transfer amount must be greater than 0"));
        // 向第一个账户转0个token
        token.transfer(address(1), 0);
    }
    // 测试转账余额不足
    function testTransferInsufficientBalanceReverts() public {
        // 创建一个新地址，它没有代币余额
        address alice = address(0xA11CE);
        
        // 使用 vm.prank 模拟 alice 调用转账函数
        vm.prank(alice);
        vm.expectRevert(bytes("Insufficient balance"));
        // alice 尝试转账1个代币，但她余额为0，应该失败
        token.transfer(address(1), 1);
    }
}


// contract RichardTokenTest is Test {
//     RichardToken internal token;

//     address internal alice = address(0xA11CE);
//     address internal bob = address(0xB0B);

//     function setUp() public {
//         token = new RichardToken();
//     }

//     function testInitialSupplyAssignedToDeployer() public {
//         uint256 supply = token.getTotalSupply();
//         assertEq(token.balanceOf(address(this)), supply, "initial supply should be owned by deployer");
//     }

//     function testTransfer() public {
//         uint256 amount = 100 * 10 ** token.DECIMALS();
//         token.transfer(alice, amount);
//         assertEq(token.balanceOf(alice), amount, "alice should receive tokens");
//         assertEq(
//             token.balanceOf(address(this)),
//             token.getTotalSupply() - amount,
//             "deployer balance should decrease"
//         );
//     }

//     function testTransferToZeroAddressReverts() public {
//         vm.expectRevert(bytes("Transfer to zero address"));
//         token.transfer(address(0), 1);
//     }

//     function testTransferAmountZeroReverts() public {
//         vm.expectRevert(bytes("Transfer amount must be greater than 0"));
//         token.transfer(alice, 0);
//     }

//     function testTransferInsufficientBalanceReverts() public {
//         vm.prank(alice);
//         vm.expectRevert(bytes("Insufficient balance"));
//         token.transfer(bob, 1);
//     }

//     function testApproveAndTransferFrom() public {
//         uint256 amount = 5 * 10 ** token.DECIMALS();
//         bool ok = token.approve(alice, amount);
//         assertTrue(ok, "approve should succeed");
//         assertEq(token.getAllowance(address(this), alice), amount, "allowance set");

//         vm.prank(alice);
//         bool moved = token.transferFrom(address(this), bob, amount);
//         assertTrue(moved, "transferFrom should succeed");
//         assertEq(token.balanceOf(bob), amount, "bob received amount");
//         assertEq(token.getAllowance(address(this), alice), 0, "allowance should be reduced to 0");
//     }

//     function testTransferFromInsufficientAllowanceReverts() public {
//         uint256 amount = 5 * 10 ** token.DECIMALS();
//         token.approve(alice, amount - 1);
//         vm.prank(alice);
//         vm.expectRevert(bytes("Insufficient allowance"));
//         token.transferFrom(address(this), bob, amount);
//     }

//     function testIncreaseAndDecreaseAllowance() public {
//         uint256 base = 10 * 10 ** token.DECIMALS();
//         token.approve(alice, base);
//         assertEq(token.getAllowance(address(this), alice), base);

//         bool upOk = token.increaseAllowance(alice, base);
//         assertTrue(upOk);
//         assertEq(token.getAllowance(address(this), alice), base * 2, "allowance increased");

//         bool downOk = token.decreaseAllowance(alice, base);
//         assertTrue(downOk);
//         assertEq(token.getAllowance(address(this), alice), base, "allowance decreased");
//     }

//     function testApproveToZeroAddressReverts() public {
//         vm.expectRevert(bytes("Approve to zero address"));
//         token.approve(address(0), 1);
//     }

//     function testApproveToSelfReverts() public {
//         vm.expectRevert(bytes("Approve to self"));
//         token.approve(address(this), 1);
//     }
// }