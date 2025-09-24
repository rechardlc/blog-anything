## 开发注意点：

1. 在 0.8+ 编译器中已内置算术溢出、下溢检查，无需 SafeMath，可以直接使用 `+ - * /`
   - 0.8以下的版本：算术溢出、下溢：当计算结果超出类型范围时，会出现初始化现象，解决方案：使用SafeMath库
2. 测试断言推荐统一为 `uint256`；将 `uint8` 转为 `uint256`，`uint8` 容易触发断言重载歧义

```solidity
// 声明时：uint8，节省存储的一种方式
uint8 public constant DECIMALS = 18;
// 断言时转化为 uint256
assertEq(uint256(token.DECIMALS()), uint256(18), "decimals should be 18");
```
