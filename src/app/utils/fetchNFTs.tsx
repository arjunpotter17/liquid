import { PublicKey } from "@metaplex-foundation/umi";
import useSWR from "swr";

//fetch NFTs owned by a user
export const useNFT = (ownerPublicKey: PublicKey) =>
  useSWR(
    ["ALL_NFTS", ownerPublicKey],
    async ([, ownerPublicKey]: [string, PublicKey]) => {
      try {
        let NFTs;
        try {
          const response = await fetch(`/api/cNFT?publicKey=${ownerPublicKey}`);
          console.log(response)
          if (!response.ok) {
            
            throw new Error("Failed to fetch cNFTs");
          }
          const data = await response.json();
          NFTs = data?.result?.items;
          return NFTs;
        } catch (error) {
          console.error("Error fetching cNFTs:", error);
          return null;
        }
      } catch (error) {
        console.error("Error fetching NFTs:", error);
        return [];
      }
    },
    {
      revalidateOnFocus: false, // Disable revalidation on focus
      revalidateIfStale: false, // Disable revalidation if data is stale
      revalidateOnReconnect: true,
    }
  );
