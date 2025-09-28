import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

export default buildModule('ExchangeModule', m => {
  const feeAccount = m.getParameter('feeAccount', m.getAccount(0));
  // 100n：1%。 n：0.01%
  const feePercentage = m.getParameter('feePercentage', 100n);

  const exchange = m.contract('Exchange', [feeAccount, feePercentage], {
    id: 'Exchange',
  });

  return { exchange };
});
