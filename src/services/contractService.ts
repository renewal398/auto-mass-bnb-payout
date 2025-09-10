import { ethers } from "ethers";

// Type definitions
interface PayoutData {
  recipient: string;
  amount: ethers.BigNumber;
}

interface ContractStats {
  contractBalance: ethers.BigNumber;
  currentServiceFee: ethers.BigNumber;
  currentFeeCollector: string;
}

interface TransactionOptions {
  value?: ethers.BigNumberish;
  gasLimit?: ethers.BigNumberish;
  gasPrice?: ethers.BigNumberish;
}

interface WalletProvider {
  request: (args: { method: string; params?: any[] }) => Promise<any>;
}

// Extend Window interface for ethereum
declare global {
  interface Window {
    ethereum?: WalletProvider;
  }
}

// Contract configuration
const CONTRACT_ADDRESS: string | undefined = import.meta.env.VITE_CONTRACT_ADDRESS_TESTNET;
const CONTRACT_ABI: string[] = [
  "function serviceFee() view returns (uint256)",
  "function calculateBNBTotal(tuple(address recipient, uint256 amount)[] payouts) view returns (uint256)",
  "function calculateTokenTotal(tuple(address recipient, uint256 amount)[] payouts) pure returns (uint256)",
  "function massPayoutBNB(tuple(address recipient, uint256 amount)[] payouts) payable",
  "function massPayoutToken(address token, tuple(address recipient, uint256 amount)[] payouts) payable",
  "function getContractStats() view returns (uint256 contractBalance, uint256 currentServiceFee, address currentFeeCollector)",
];

class ContractService {
  private provider: ethers.providers.Web3Provider | null;
  private signer: ethers.Signer | null;
  private contract: ethers.Contract | null;
  private contractAddress: string | undefined;

  constructor() {
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.contractAddress = CONTRACT_ADDRESS;
  }

  // Initialize the contract connection
  async initialize(walletProvider?: WalletProvider): Promise<boolean> {
    try {
      if (!this.contractAddress) {
        throw new Error("Contract address not found in environment variables");
      }

      // Use provided wallet or window.ethereum
      const provider = walletProvider || window.ethereum;
      if (!provider) {
        throw new Error("No wallet provider available");
      }

      this.provider = new ethers.providers.Web3Provider(provider);

      // Check if we're on the correct network (BSC Testnet = 97)
      const network = await this.provider.getNetwork();
      if (network.chainId !== 97) {
        throw new Error(
          `Wrong network. Please switch to BSC Testnet. Current: ${network.chainId}`
        );
      }

      this.signer = this.provider.getSigner();
      this.contract = new ethers.Contract(
        this.contractAddress,
        CONTRACT_ABI,
        this.signer
      );

      console.log("Contract service initialized");
      console.log("Contract Address:", this.contractAddress);
      console.log("Network:", network.name, `(${network.chainId})`);

      return true;
    } catch (error) {
      console.error("Failed to initialize contract service:", error);
      throw error;
    }
  }

  // Get service fee
  async getServiceFee(): Promise<ethers.BigNumber> {
    try {
      if (!this.contract) {
        await this.initialize();
      }

      if (!this.contract) {
        throw new Error("Contract not initialized");
      }

      const serviceFee: ethers.BigNumber = await this.contract.serviceFee();
      console.log("Service Fee (wei):", serviceFee.toString());
      console.log("Service Fee (BNB):", ethers.utils.formatEther(serviceFee));

      return serviceFee;
    } catch (error) {
      console.error("Failed to get service fee:", error);
      // Return default service fee if contract call fails
      return ethers.utils.parseEther("0.001");
    }
  }

  // Calculate total BNB needed (including service fee)
  async calculateBNBTotal(payouts: PayoutData[]): Promise<ethers.BigNumber> {
    try {
      if (!this.contract) {
        await this.initialize();
      }

      if (!this.contract) {
        throw new Error("Contract not initialized");
      }

      const total: ethers.BigNumber = await this.contract.calculateBNBTotal(payouts);
      console.log("Total BNB needed:", ethers.utils.formatEther(total));

      return total;
    } catch (error) {
      console.error("Failed to calculate BNB total:", error);

      // Fallback calculation
      const serviceFee = ethers.utils.parseEther("0.001");
      const payoutTotal = payouts.reduce((sum: ethers.BigNumber, payout: PayoutData) => {
        return sum.add(payout.amount);
      }, ethers.BigNumber.from(0));

      return payoutTotal.add(serviceFee);
    }
  }

  // Calculate total token amount needed
  async calculateTokenTotal(payouts: PayoutData[]): Promise<ethers.BigNumber> {
    try {
      if (!this.contract) {
        await this.initialize();
      }

      if (!this.contract) {
        throw new Error("Contract not initialized");
      }

      const total: ethers.BigNumber = await this.contract.calculateTokenTotal(payouts);
      return total;
    } catch (error) {
      console.error("Failed to calculate token total:", error);

      // Fallback calculation
      return payouts.reduce((sum: ethers.BigNumber, payout: PayoutData) => {
        return sum.add(payout.amount);
      }, ethers.BigNumber.from(0));
    }
  }

  // Execute BNB payout
  async executeBNBPayout(
    payouts: PayoutData[], 
    totalValue: ethers.BigNumber
  ): Promise<ethers.ContractTransaction> {
    try {
      if (!this.contract) {
        await this.initialize();
      }

      if (!this.contract) {
        throw new Error("Contract not initialized");
      }

      const tx: ethers.ContractTransaction = await this.contract.massPayoutBNB(payouts, {
        value: totalValue,
      });

      return tx;
    } catch (error) {
      console.error("Failed to execute BNB payout:", error);
      throw error;
    }
  }

  // Execute token payout
  async executeTokenPayout(
    tokenAddress: string,
    payouts: PayoutData[],
    serviceFee: ethers.BigNumber
  ): Promise<ethers.ContractTransaction> {
    try {
      if (!this.contract) {
        await this.initialize();
      }

      if (!this.contract) {
        throw new Error("Contract not initialized");
      }

      const tx: ethers.ContractTransaction = await this.contract.massPayoutToken(
        tokenAddress, 
        payouts, 
        {
          value: serviceFee,
        }
      );

      return tx;
    } catch (error) {
      console.error("Failed to execute token payout:", error);
      throw error;
    }
  }

  // Get contract stats
  async getContractStats(): Promise<ContractStats | null> {
    try {
      if (!this.contract) {
        await this.initialize();
      }

      if (!this.contract) {
        throw new Error("Contract not initialized");
      }

      const stats = await this.contract.getContractStats();
      return {
        contractBalance: stats[0],
        currentServiceFee: stats[1],
        currentFeeCollector: stats[2],
      };
    } catch (error) {
      console.error("Failed to get contract stats:", error);
      return null;
    }
  }

  // Estimate gas for transaction
  async estimateGas(
    method: string, 
    params: any[], 
    options: TransactionOptions = {}
  ): Promise<ethers.BigNumber> {
    try {
      if (!this.contract) {
        await this.initialize();
      }

      if (!this.contract) {
        throw new Error("Contract not initialized");
      }

      const gasEstimate: ethers.BigNumber = await this.contract.estimateGas[method](
        ...params,
        options
      );
      return gasEstimate;
    } catch (error) {
      console.error("Failed to estimate gas:", error);
      // Return a reasonable default gas estimate
      return ethers.BigNumber.from("300000");
    }
  }
}

// Create singleton instance
const contractService = new ContractService();

export default contractService;

// Named exports for convenience
export const getServiceFee = (): Promise<ethers.BigNumber> => 
  contractService.getServiceFee();

export const calculateBNBTotal = (payouts: PayoutData[]): Promise<ethers.BigNumber> =>
  contractService.calculateBNBTotal(payouts);

export const calculateTokenTotal = (payouts: PayoutData[]): Promise<ethers.BigNumber> =>
  contractService.calculateTokenTotal(payouts);

export const executeBNBPayout = (
  payouts: PayoutData[], 
  totalValue: ethers.BigNumber
): Promise<ethers.ContractTransaction> =>
  contractService.executeBNBPayout(payouts, totalValue);

export const executeTokenPayout = (
  tokenAddress: string,
  payouts: PayoutData[],
  serviceFee: ethers.BigNumber
): Promise<ethers.ContractTransaction> =>
  contractService.executeTokenPayout(tokenAddress, payouts, serviceFee);
