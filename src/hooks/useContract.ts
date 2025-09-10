import { useState, useMemo } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESSES, CONTRACT_ABI } from "../utils/constants";

// Type definitions
interface Wallet {
  chainId: number;
  address: string;
  signer: ethers.Signer;
  provider: ethers.providers.Provider;
}

interface TransactionOptions extends ethers.Overrides {
  gasLimit?: ethers.BigNumberish;
  gasPrice?: ethers.BigNumberish;
  value?: ethers.BigNumberish;
}

interface TransactionResult {
  tx: ethers.ContractTransaction;
}

interface UseContractReturn {
  contract: ethers.Contract | null;
  isLoading: boolean;
  error: string | null;
  executeTransaction: (
    method: string,
    params?: any[],
    options?: TransactionOptions
  ) => Promise<TransactionResult>;
  callViewFunction: (method: string, params?: any[]) => Promise<any>;
}

export const useContract = (wallet: Wallet | null): UseContractReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const contract = useMemo((): ethers.Contract | null => {
    if (!wallet || !wallet.signer || !wallet.chainId) return null;

    const contractAddress = CONTRACT_ADDRESSES[wallet.chainId as keyof typeof CONTRACT_ADDRESSES];
    if (!contractAddress) return null;

    return new ethers.Contract(contractAddress, CONTRACT_ABI, wallet.signer);
  }, [wallet]);

  const executeTransaction = async (
    method: string,
    params: any[] = [],
    options: TransactionOptions = {}
  ): Promise<TransactionResult> => {
    if (!contract) throw new Error("Contract not available");

    setIsLoading(true);
    setError(null);

    try {
      console.log(
        `Executing ${method} with params:`,
        params,
        "options:",
        options
      );

      // Don't estimate gas if gasLimit is already provided
      if (!options.gasLimit) {
        console.log("No gas limit provided, using default calculation");
        // Use a conservative default based on method
        if (method === "massPayoutBNB") {
          options.gasLimit = 300000 + ((params[0] as any[])?.length || 1) * 30000;
        } else if (method === "massPayoutToken") {
          options.gasLimit = 400000 + ((params[1] as any[])?.length || 1) * 50000;
        } else {
          options.gasLimit = 200000;
        }
      }

      // Set a reasonable gas price if not provided
      if (!options.gasPrice) {
        try {
          const gasPrice = await wallet!.signer.getGasPrice();
          options.gasPrice = gasPrice.mul(110).div(100); // 10% buffer
        } catch {
          options.gasPrice = ethers.utils.parseUnits("5", "gwei");
        }
      }

      console.log("Final transaction options:", options);

      // Execute the transaction directly without gas estimation
      const tx: ethers.ContractTransaction = await contract[method](...params, options);

      console.log("Transaction sent:", tx.hash);
      console.log("Waiting for confirmation...");

      setIsLoading(false);
      return { tx };
    } catch (error: any) {
      console.error("Transaction failed:", error);

      // Parse common error messages
      let errorMessage: string = error.message;

      if (error.code === 4001) {
        errorMessage = "Transaction rejected by user";
      } else if (error.message.includes("insufficient funds")) {
        errorMessage = "Insufficient funds for transaction";
      } else if (error.message.includes("gas required exceeds allowance")) {
        errorMessage = "Transaction requires more gas than available";
      } else if (error.message.includes("execution reverted")) {
        errorMessage = "Transaction reverted - check contract conditions";
      }

      setError(errorMessage);
      setIsLoading(false);
      throw new Error(errorMessage);
    }
  };

  // Helper method to safely call view functions
  const callViewFunction = async (method: string, params: any[] = []): Promise<any> => {
    if (!contract) throw new Error("Contract not available");

    try {
      console.log(`Calling view function ${method} with params:`, params);
      const result = await contract[method](...params);
      console.log(`View function ${method} result:`, result);
      return result;
    } catch (error: any) {
      console.error(`View function ${method} failed:`, error);
      throw error;
    }
  };

  return {
    contract,
    isLoading,
    error,
    executeTransaction,
    callViewFunction,
  };
};
