import { toast } from "sonner";
import { PublicKey } from "@solana/web3.js";

// Fetcher function to use with SWR
export const fetcher = (url: string) => fetch(url).then((res) => res.json());

//function to buy time
export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

//function to get the swap transaction from jupiter
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

//function to get the pool with highest price for the NFT
export const highestPricePool = async (mint: string) => {
  try {
    const nftResponse = await fetch("/api/collection-id?mint=" + mint);
    const nftData = await nftResponse.json();
    console.log("fetching pools with collID", nftData[0]?.collId);
    const poolsResponse = await fetch(
      "/api/pools?collId=" + nftData[0]?.collId
    );
    const poolsData = await poolsResponse.json();
    console.log("poolsData:", poolsData);
    const highestPricePool = poolsData?.reduce((maxPool: any, pool: any) => {
      return pool.sellNowPrice > (maxPool?.sellNowPrice || 0) ? pool : maxPool;
    }, null);
    console.log("highestPricePool:", highestPricePool);
    if (!highestPricePool) {
      // throw new Error("No pool with a currentSellPrice");
      return { highestPricePool: null, nftData };
    }
    return { highestPricePool, nftData };
  } catch (error) {
    throw new Error(`Error fetching highest price pool: ${error}`);
  }
};

//function to get the NFT info
export const getNftInfo = async (mint: string) => {
  try {
    const nftResponse = await fetch("/api/collection-id?mint=" + mint);
    return await nftResponse.json();
  } catch (error) {
    console.error("Error fetching NFT info:", error);
    return null;
  }
};

//truncate addresses
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

//onclick handler to copy to clipboard
export const handleCopy = () => {
  toast.success("Copied to clipboard");
};

//function to check wallet balance
export async function checkWalletBalance(
  publicKey: PublicKey,
  amount: number
): Promise<boolean> {
  const maxRetries = 3;
  const interval = 5000; // check every 5 seconds to see if funds have hit the wallet
  // const connection = getConnection();
  return new Promise(async (resolve) => {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const balance = await fetch(
          "/api/helius/accounts?publicKey=" + publicKey.toString()
        ).then((res) => res.json());
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
