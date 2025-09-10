export interface WalletProvider {
  request(args: { method: string; params?: any[] }): Promise<any>;
  on?(eventName: string, handler: (...args: any[]) => void): void;
  removeListener?(eventName: string, handler: (...args: any[]) => void): void;
  selectedAddress?: string | null;
  chainId?: string;
  isMetaMask?: boolean;
}

export interface MetaMaskEthereumProvider extends WalletProvider {
  isMetaMask: true;
  selectedAddress: string | null;
  chainId: string;
  on(eventName: string, handler: (...args: any[]) => void): void;
  removeListener(eventName: string, handler: (...args: any[]) => void): void;
}

declare global {
  interface Window {
    ethereum?: WalletProvider | MetaMaskEthereumProvider;
  }
}
