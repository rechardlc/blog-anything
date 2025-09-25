import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

export default buildModule('TokenModule', m => {
  //
  const token = m.contract('RichardToken', [], { id: 'Token' });

  return { token };
});
