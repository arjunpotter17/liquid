import { Connection } from "@solana/web3.js";

export const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const getConnection = () => {
  //connection key should move to .env
  const connection = new Connection(
    `https://mainnet.helius-rpc.com/?api-key=${process.env.REACT_APP_HELIOUS_API_KEY}`
  );
  return connection;
};

export const getEndpoint = (network:string) => {
  switch (network) {
    case "mainnet":
      return `https://mainnet.helius-rpc.com/?api-key=${process.env.REACT_APP_HELIOUS_API_KEY}`;
    case "devnet":
      return `https://devnet.helius-rpc.com/?api-key=${process.env.REACT_APP_HELIOUS_API_KEY}`;
    default:  
      return `https://mainnet.helius-rpc.com/?api-key=${process.env.REACT_APP_HELIOUS_API_KEY}`;
  }
}
