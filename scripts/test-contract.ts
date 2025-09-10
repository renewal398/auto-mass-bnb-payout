import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract, ContractFactory, BigNumber } from "ethers";

interface PayoutData {
  recipient: string;
  amount: BigNumber;
}

async function main(): Promise<void> {
  const contractAddress: string | undefined = process.env.VITE_CONTRACT_ADDRESS_TESTNET;

  if (!contractAddress) {
    console.error(
      "❌ Please set VITE_CONTRACT_ADDRESS_TESTNET in your .env file"
    );
    return;
  }

  console.log("Testing contract functionality...");

  const [signer]: SignerWithAddress[] = await ethers.getSigners();
  const MassPayouts: ContractFactory = await ethers.getContractFactory("MassPayouts");
  const contract: Contract = MassPayouts.attach(contractAddress);

  try {
    // Test 1: Check service fee
    const serviceFee: BigNumber = await contract.serviceFee();
    console.log(`✅ Service fee: ${ethers.utils.formatEther(serviceFee)} BNB`);

    // Test 2: Check contract stats
    const stats: BigNumber[] = await contract.getContractStats();
    console.log(
      `✅ Contract balance: ${ethers.utils.formatEther(stats[0])} BNB`
    );
    console.log(`✅ Fee collector: ${stats[2]}`);

    // Test 3: Calculate BNB total for sample data
    const samplePayouts: PayoutData[] = [
      { recipient: signer.address, amount: ethers.utils.parseEther("0.1") },
      {
        recipient: "0x742dB5c6dB6aD6C6c0e8f4c5c7E8E8E8E8E8E8E8",
        amount: ethers.utils.parseEther("0.2"),
      },
    ];

    const total: BigNumber = await contract.calculateBNBTotal(samplePayouts);
    console.log(
      `✅ Total BNB needed for sample: ${ethers.utils.formatEther(total)} BNB`
    );

    console.log("🎉 Contract testing completed successfully!");
  } catch (error: any) {
    console.error("❌ Contract testing failed:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
