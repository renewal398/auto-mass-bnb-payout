import * as fs from "fs";
import { ethers } from "ethers";

interface Recipient {
  address: string;
  amount: string;
}

// Generate sample recipient data for testing
function generateSampleData(count: number = 10): Recipient[] {
  const recipients: Recipient[] = [];

  for (let i = 0; i < count; i++) {
    // Generate random wallet address
    const wallet: ethers.Wallet = ethers.Wallet.createRandom();

    // Generate random amount between 0.01 and 10
    const amount: string = (Math.random() * 9.99 + 0.01).toFixed(6);

    recipients.push({
      address: wallet.address,
      amount: amount,
    });
  }

  return recipients;
}

// Generate CSV format
function generateCSV(recipients: Recipient[]): string {
  const header: string = "address,amount\n";
  const rows: string = recipients.map((r: Recipient) => `${r.address},${r.amount}`).join("\n");
  return header + rows;
}

// Generate JSON format
function generateJSON(recipients: Recipient[]): string {
  return JSON.stringify(recipients, null, 2);
}

// Main execution
const sampleCount: number = parseInt(process.argv[2] || "10");
const recipients: Recipient[] = generateSampleData(sampleCount);

// Save CSV file
const csvData: string = generateCSV(recipients);
fs.writeFileSync(`sample-recipients-${sampleCount}.csv`, csvData);

// Save JSON file
const jsonData: string = generateJSON(recipients);
fs.writeFileSync(`sample-recipients-${sampleCount}.json`, jsonData);

console.log(`✅ Generated sample data for ${sampleCount} recipients:`);
console.log(`- sample-recipients-${sampleCount}.csv`);
console.log(`- sample-recipients-${sampleCount}.json`);
console.log(
  `\nTotal amount: ${recipients
    .reduce((sum: number, r: Recipient) => sum + parseFloat(r.amount), 0)
    .toFixed(6)}`
);
