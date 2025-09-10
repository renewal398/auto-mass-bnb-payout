import { ethers } from 'ethers';

// Type definitions
export interface Provider {
  getGasPrice(): Promise<ethers.BigNumber>;
}

// Helper functions
export const sleep = (ms: number): Promise<void> => 
  new Promise((resolve) => setTimeout(resolve, ms));

export const truncateAddress = (
  address: string | null | undefined, 
  start: number = 6, 
  end: number = 4
): string => {
  if (!address) return "";
  return `${address.slice(0, start)}...${address.slice(-end)}`;
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    return false;
  }
};

export const downloadFile = (
  data: string | Blob, 
  filename: string, 
  type: string = "text/plain"
): void => {
  const blob = new Blob([data], { type });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const formatDate = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleString();
};

export const calculateGasPrice = async (
  provider: Provider | ethers.providers.Provider
): Promise<ethers.BigNumber> => {
  try {
    const gasPrice = await provider.getGasPrice();
    return gasPrice.mul(120).div(100);
  } catch (error) {
    console.error("Failed to get gas price:", error);
    return ethers.utils.parseUnits("5", "gwei"); // Fallback
  }
};
