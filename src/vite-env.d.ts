/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CONTRACT_ADDRESS_TESTNET: string;
  readonly VITE_CONTRACT_ADDRESS_MAINNET: string;
  
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
