import { CONTRACT_ADDRESSES } from '@/lib/contracts';
import exchangeAbi from '@/artifacts/contracts/Exchange.sol/Exchange.json';
import { BrowserProvider, Contract } from 'ethers';
const useExchange = (provider: BrowserProvider) => {
  const exchange = new Contract(CONTRACT_ADDRESSES.EXCHANGE, exchangeAbi.abi, provider);
  return {
    exchange,
  };
};

export default useExchange;
