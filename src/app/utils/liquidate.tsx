import { Connection } from "@solana/web3.js";

export const liquidate = async (mint: string) => {
    const connection = new Connection(
        'https://mainnet.helius-rpc.com/?api-key=ea9c561f-0680-4ae5-835c-5c0e463fa5e4'
      );
    console.log('fetching collID for mint', mint);
    const nftResponse = await fetch('/api/collection-id?mint=' + mint);
    const nftData = await nftResponse.json(); // Parse the response as JSON

    console.log('fetching pools with collID', nftData[0]?.collId);
    const poolsResponse = await fetch('/api/pools?collId=' + nftData[0]?.collId);
    const poolsData = await poolsResponse.json(); // Parse the response as JSON
    const highestPricePool = poolsData?.reduce((maxPool: any, pool: any) => {
      return pool.currentSellPrice > (maxPool?.currentSellPrice || 0)
        ? pool
        : maxPool;
    }, null);

    console.log('Pool with the highest currentSellPrice:', highestPricePool);

    const blockhash = (await connection.getLatestBlockhash()).blockhash;

    const sellTx = await fetch(
      `/api/liquidate?seller=${nftData[0]?.owner}&mint=${mint}&minPrice=${highestPricePool?.currentSellPrice}&blockhash=${blockhash}&bidAddress=${highestPricePool?.address}`
    );

    if (!sellTx.ok) {
      console.error('Failed to liquidate:', sellTx.statusText);
      return;
    }

    const data = await sellTx.json();
    return {
      data : data ? data : null,
      highestPricePool: highestPricePool ? highestPricePool : null,
    };
    
  };