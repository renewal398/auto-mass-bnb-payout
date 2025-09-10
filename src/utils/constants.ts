// Type definitions
export interface NativeCurrency {
  name: string;
  symbol: string;
  decimals: number;
}

export interface Network {
  chainId: number;
  name: string;
  rpcUrl: string;
  blockExplorer: string;
  nativeCurrency: NativeCurrency;
}

export interface Token {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logo: string;
  isNative: boolean;
  description: string;
}

export interface AbiInput {
  internalType: string;
  name: string;
  type: string;
  indexed?: boolean;
}

export interface AbiOutput {
  internalType: string;
  name: string;
  type: string;
}

export interface AbiComponent {
  internalType: string;
  name: string;
  type: string;
}

export interface AbiInputWithComponents extends AbiInput {
  components?: AbiComponent[];
  indexed?: boolean;
}

export interface AbiFunction {
  inputs?: AbiInputWithComponents[];
  outputs?: AbiOutput[];
  name?: string;
  stateMutability: string;
  type: string;
  anonymous?: boolean;
  indexed?: boolean;
}

export type NetworksType = {
  BSC_TESTNET: Network;
  BSC_MAINNET: Network;
};

export type CommonTokensType = {
  [chainId: number]: Token[];
};

export type ContractAddressesType = {
  [chainId: number]: string | undefined;
};

// Constants
export const NETWORKS: NetworksType = { 
  BSC_TESTNET: { 
    chainId: 97, 
    name: "BSC Testnet", 
    rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545/", 
    blockExplorer: "https://testnet.bscscan.com", 
    nativeCurrency: { 
      name: "tBNB", 
      symbol: "tBNB", 
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
 
export const COMMON_TOKENS: CommonTokensType = { 
  97: [ 
    // BSC Testnet 
    { 
      symbol: "tBNB", 
      name: "Testnet BNB", 
      address: "native", // Special identifier for native tBNB 
      decimals: 18, 
      logo: "🟡", 
      isNative: true, 
      description: "Native currency of BSC Testnet", 
    }, 
    { 
      symbol: "BUSD", 
      name: "Binance USD (Testnet)", 
      address: "0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee", 
      decimals: 18, 
      logo: "💵", 
      isNative: false, 
      description: "Testnet version of Binance USD", 
    }, 
    { 
      symbol: "USDT", 
      name: "Tether USD (Testnet)", 
      address: "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd", 
      decimals: 18, 
      logo: "💚", 
      isNative: false, 
      description: "Testnet version of Tether USD", 
    }, 
    { 
      symbol: "USDC", 
      name: "USD Coin (Testnet)", 
      address: "0x64544969ed7EBf5f083679233325356EbE738930", 
      decimals: 18, 
      logo: "🔵", 
      isNative: false, 
      description: "Testnet version of USD Coin", 
    }, 
  ], 
  56: [ 
    // BSC Mainnet 
    { 
      symbol: "BNB", 
      name: "Binance Coin", 
      address: "native", // Special identifier for native BNB 
      decimals: 18, 
      logo: "🟡", 
      isNative: true, 
      description: "Native currency of BSC Mainnet", 
    }, 
    { 
      symbol: "BUSD", 
      name: "Binance USD", 
      address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56", 
      decimals: 18, 
      logo: "💵", 
      isNative: false, 
      description: "Binance USD stablecoin", 
    }, 
    { 
      symbol: "USDT", 
      name: "Tether USD", 
      address: "0x55d398326f99059fF775485246999027B3197955", 
      decimals: 18, 
      logo: "💚", 
      isNative: false, 
      description: "Tether USD stablecoin", 
    }, 
    { 
      symbol: "USDC", 
      name: "USD Coin", 
      address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d", 
      decimals: 18, 
      logo: "🔵", 
      isNative: false, 
      description: "USD Coin stablecoin", 
    }, 
  ], 
}; 
 
export const CONTRACT_ADDRESSES: ContractAddressesType = { 
  97: import.meta.env.VITE_CONTRACT_ADDRESS_TESTNET, 
  56: import.meta.env.VITE_CONTRACT_ADDRESS_MAINNET, 
}; 
 
export const CONTRACT_ABI: AbiFunction[] = [ 
  { 
    inputs: [ 
      { internalType: "address", name: "_feeCollector", type: "address" }, 
    ], 
    stateMutability: "nonpayable", 
    type: "constructor", 
  }, 
  { 
    anonymous: false, 
    inputs: [ 
      { 
        indexed: false, 
        internalType: "uint256", 
        name: "oldFee", 
        type: "uint256", 
      }, 
      { 
        indexed: false, 
        internalType: "uint256", 
        name: "newFee", 
        type: "uint256", 
      }, 
    ], 
    name: "FeeUpdated", 
    type: "event", 
  }, 
  { 
    anonymous: false, 
    inputs: [ 
      { 
        indexed: true, 
        internalType: "address", 
        name: "sender", 
        type: "address", 
      }, 
      { 
        indexed: true, 
        internalType: "address", 
        name: "token", 
        type: "address", 
      }, 
      { 
        indexed: false, 
        internalType: "uint256", 
        name: "totalAmount", 
        type: "uint256", 
      }, 
      { 
        indexed: false, 
        internalType: "uint256", 
        name: "recipientCount", 
        type: "uint256", 
      }, 
      { 
        indexed: false, 
        internalType: "uint256", 
        name: "timestamp", 
        type: "uint256", 
      }, 
    ], 
    name: "MassPayoutExecuted", 
    type: "event", 
  }, 
  { 
    anonymous: false, 
    inputs: [ 
      { 
        indexed: true, 
        internalType: "address", 
        name: "recipient", 
        type: "address", 
      }, 
      { 
        indexed: true, 
        internalType: "address", 
        name: "token", 
        type: "address", 
      }, 
      { 
        indexed: false, 
        internalType: "uint256", 
        name: "amount", 
        type: "uint256", 
      }, 
      { indexed: false, internalType: "bool", name: "success", type: "bool" }, 
    ], 
    name: "PayoutCompleted", 
    type: "event", 
  }, 
  { 
    inputs: [ 
      { 
        components: [ 
          { internalType: "address", name: "recipient", type: "address" }, 
          { internalType: "uint256", name: "amount", type: "uint256" }, 
        ], 
        internalType: "struct MassPayouts.PayoutData[]", 
        name: "payouts", 
        type: "tuple[]", 
      }, 
    ], 
    name: "massPayoutBNB", 
    outputs: [], 
    stateMutability: "payable", 
    type: "function", 
  }, 
  { 
    inputs: [ 
      { internalType: "address", name: "token", type: "address" }, 
      { 
        components: [ 
          { internalType: "address", name: "recipient", type: "address" }, 
          { internalType: "uint256", name: "amount", type: "uint256" }, 
        ], 
        internalType: "struct MassPayouts.PayoutData[]", 
        name: "payouts", 
        type: "tuple[]", 
      }, 
    ], 
    name: "massPayoutToken", 
    outputs: [], 
    stateMutability: "payable", 
    type: "function", 
  }, 
  { 
    inputs: [ 
      { 
        components: [ 
          { internalType: "address", name: "recipient", type: "address" }, 
          { internalType: "uint256", name: "amount", type: "uint256" }, 
        ], 
        internalType: "struct MassPayouts.PayoutData[]", 
        name: "payouts", 
        type: "tuple[]", 
      }, 
    ], 
    name: "calculateBNBTotal", 
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }], 
    stateMutability: "view", 
    type: "function", 
  }, 
  { 
    inputs: [], 
    name: "serviceFee", 
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }], 
    stateMutability: "view", 
    type: "function", 
  }, 
];
