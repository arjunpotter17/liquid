import { Connection } from "@solana/web3.js";

// Fetcher function to use with SWR or similar data-fetching libraries
export const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Function to get Solana connection using the environment variable
export const getConnection = () => {
  const apiKey = process.env.HELIUS_API_KEY; // Make sure to use the correct environment variable
  // Create a new Solana connection with the provided API key
  return new Connection(`https://mainnet.helius-rpc.com/?api-key=${apiKey}`);
};

// Function to get the RPC endpoint for the specified network
export const getEndpoint = (network: string) => {
  const apiKey = process.env.HELIUS_API_KEY; // Make sure to use the correct environment variable
  switch (network) {
    case "mainnet":
      return `https://mainnet.helius-rpc.com/?api-key=${apiKey}`;
    case "devnet":
      return `https://devnet.helius-rpc.com/?api-key=${apiKey}`;
    default:
      return `https://mainnet.helius-rpc.com/?api-key=${apiKey}`;
  }
};
