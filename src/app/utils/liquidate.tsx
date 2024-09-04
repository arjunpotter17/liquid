import { Connection } from "@solana/web3.js";
import { getConnection, highestPricePool } from "./helpers";

export const liquidate = async (mint: string) => {
  const connection = getConnection();
  console.log("fetching collID for mint", mint);
  const nftResponse = await fetch("/api/collection-id?mint=" + mint);
  const nftData = await nftResponse.json(); // Parse the response as JSON

  const highestPool = await highestPricePool(mint);

  console.log("Pool with the highest currentSellPrice:", highestPool);
  if (!highestPool) {
    console.error("No pool with a currentSellPrice");
    return;
  }
  const blockhash = (await connection.getLatestBlockhash()).blockhash;

  const sellTx = await fetch(
    `/api/liquidate?seller=${nftData[0]?.owner}&mint=${mint}&minPrice=${highestPool?.currentSellPrice}&blockhash=${blockhash}&bidAddress=${highestPool?.address}`
  );

  if (!sellTx.ok) {
    console.error("Failed to liquidate:", sellTx.statusText);
    return;
  }

  const data = await sellTx.json();
  return {
    data: data ? data : null,
    highestPricePool: highestPool ? highestPool : null,
  };
};
