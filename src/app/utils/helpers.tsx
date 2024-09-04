import { Connection } from "@solana/web3.js";
import { toast } from "sonner";
import { PublicKey } from "@solana/web3.js";

// Fetcher function to use with SWR or similar data-fetching libraries
export const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Function to get Solana connection using the environment variable
export const getConnection = () => {
  const apiKey = process.env.NEXT_PUBLIC_HELIUS_RPC_KEY; // Make sure to use the correct environment variable
  // Create a new Solana connection with the provided API key
  return new Connection(`https://mainnet.helius-rpc.com/?api-key=${apiKey}`);
};

// Function to get the RPC endpoint for the specified network
export const getEndpoint = (network: string) => {
  const apiKey = process.env.NEXT_PUBLIC_HELIUS_RPC_KEY; // Make sure to use the correct environment variable
  switch (network) {
    case "mainnet":
      return `https://mainnet.helius-rpc.com/?api-key=${apiKey}`;
    case "devnet":
      return `https://devnet.helius-rpc.com/?api-key=${apiKey}`;
    default:
      return `https://mainnet.helius-rpc.com/?api-key=${apiKey}`;
  }
};

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const swapTransaction = async (swapData: any, publicKey: string) => {
  const swapResponse = await fetch("/api/swap-inst-tx", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      swapData,
      key: publicKey,
    }),
  });
  const swapTransaction = await swapResponse.json();

  if (swapTransaction.error) {
    throw new Error("Failed to get swap transaction: " + swapTransaction.error);
  }
  const swapTransactionBuf = Buffer.from(
    swapTransaction?.swapTransaction,
    "base64"
  );
  return swapTransactionBuf;
};

export const highestPricePool = async (mint: string) => {
  try {
    const nftResponse = await fetch("/api/collection-id?mint=" + mint);
    const nftData = await nftResponse.json();
    console.log("fetching pools with collID", nftData[0]?.collId);
    const poolsResponse = await fetch(
      "/api/pools?collId=" + nftData[0]?.collId
    );
    const poolsData = await poolsResponse.json();
    const tradeablePools = poolsData.filter(
      (pool: any) =>
        pool.takerSellCount < pool.maxTakerSellCount ||
        pool.maxTakerSellCount == 0
    );
    
    const poolsWithBalance = tradeablePools?.filter(
      (pool: any) => pool.solBalance > pool.currentSellPrice
    );
    const highestPricePool = poolsWithBalance?.reduce(
      (maxPool: any, pool: any) => {
        return pool.currentSellPrice > (maxPool?.currentSellPrice || 0)
          ? pool
          : maxPool;
      },
      null
    );
    console.log("highestPricePool:", highestPricePool);
    if (!highestPricePool) {
      console.error("No pool with a currentSellPrice");
      throw new Error();
    }
    return highestPricePool;
  } catch (error) {
    console.error("Error fetching highest price pool:", error);
    throw new Error("Error fetching highest price pool");
  }
};

export const getNftInfo = async (mint: string) => {
  try {
    const nftResponse = await fetch("/api/collection-id?mint=" + mint);
    return await nftResponse.json();
  } catch (error) {
    console.error("Error fetching NFT info:", error);
    return null;
  }
};

export default function truncateWallet(
  str: string,
  num: number,
  middle: boolean = false,
  maskChar: string = "."
) {
  if (str.length > num && str.length > 3) {
    if (!middle) {
      return `${str.substring(0, num)}${maskChar.repeat(3)}`;
    }

    const a = Math.round((num * 2) / 3);
    const b = num - a;

    return `${str.substring(0, a)}${maskChar.repeat(3)}${str.substring(
      str.length - b,
      str.length
    )}`;
  }

  return str;
}

export const handleCopy = () => {
  toast.success("Copied to clipboard");
};

export async function checkWalletBalance(
  publicKey: PublicKey,
  amount: number
): Promise<boolean> {
  const maxRetries = 3;
  const interval = 5000; // 5 seconds in milliseconds
  const connection = getConnection();
  return new Promise(async (resolve) => {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const balance = await connection.getBalance(publicKey);

        // Check if the balance is greater than or equal to the specified amount
        if (balance >= amount) {
          resolve(true);
          return;
        }

        // Wait for the specified interval before checking again
        if (attempt < maxRetries - 1) {
          await new Promise((res) => setTimeout(res, interval));
        }
      } catch (error) {
        console.error("Failed to fetch balance", error);
        break; // Exit the loop if an error occurs
      }
    }

    // If the loop completes without finding sufficient balance
    resolve(false);
  });
}
