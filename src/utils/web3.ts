import { ethers } from "ethers";

// Type definitions
interface NativeCurrency {
  name: string;
  symbol: string;
  decimals: number;
}

interface Network {
  chainId: number;
  name: string;
  rpcUrl: string;
  blockExplorer: string;
  nativeCurrency: NativeCurrency;
}

interface Networks {
  BSC_TESTNET: Network;
  BSC_MAINNET: Network;
}

interface EthereumProvider {
  request: (args: { method: string; params?: any[] }) => Promise<any>;
}

// Extend Window interface for ethereum
declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

export const NETWORKS: Networks = {
  BSC_TESTNET: {
    chainId: 97,
    name: "BSC Testnet",
    rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545/",
    blockExplorer: "https://testnet.bscscan.com",
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
    },
  },
  BSC_MAINNET: {
    chainId: 56,
    name: "BSC Mainnet",
    rpcUrl: "https://bsc-dataseed1.binance.org/",
    blockExplorer: "https://bscscan.com",
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
    },
  },
};

export const switchNetwork = async (chainId: number): Promise<void> => {
  if (!window.ethereum) throw new Error("No crypto wallet found");

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    });
  } catch (switchError: any) {
    if (switchError.code === 4902) {
      const network: Network =
        chainId === 56 ? NETWORKS.BSC_MAINNET : NETWORKS.BSC_TESTNET;
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: `0x${chainId.toString(16)}`,
            chainName: network.name,
            rpcUrls: [network.rpcUrl],
            nativeCurrency: network.nativeCurrency,
            blockExplorerUrls: [network.blockExplorer],
          },
        ],
      });
    } else {
      throw switchError;
    }
  }
};

export const getProvider = (): ethers.providers.Web3Provider | null => {
  if (window.ethereum) {
    return new ethers.providers.Web3Provider(window.ethereum);
  }
  return null;
};

export const getSigner = (): ethers.Signer | null => {
  const provider = getProvider();
  return provider ? provider.getSigner() : null;
};
