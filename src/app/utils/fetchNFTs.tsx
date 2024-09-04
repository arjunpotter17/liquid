import { fetchAllDigitalAssetByOwner } from "@metaplex-foundation/mpl-token-metadata";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplCore } from "@metaplex-foundation/mpl-core";
import { PublicKey } from "@metaplex-foundation/umi";
import axios from "axios";
import { getEndpoint } from "./helpers";
import useSWR from "swr";


export const useNFT = (ownerPublicKey: PublicKey) =>
  useSWR(
    ["ALL_NFTS", ownerPublicKey], // Use a key array to include ownerPublicKey
    async ([, ownerPublicKey]: [string, PublicKey]) => {
      const umi = createUmi(getEndpoint("mainnet")).use(mplCore());

      try {
        const assetsByOwner = await fetchAllDigitalAssetByOwner(
          umi,
          ownerPublicKey
        );
        const nfts = assetsByOwner.filter(
          (token) => token?.metadata?.uri.length > 1 && token?.mint.decimals === 0
        );
        console.log("NFTs:", nfts);
        const metaNfts = await Promise.all(
          nfts.map(async (nft) => {
            const metadataResponse = await axios.get(nft.metadata.uri);
            return { ...nft, metadataDetails: metadataResponse.data };
          })
        );
        return metaNfts;
      } catch (error) {
        console.error("Error fetching NFTs:", error);
        return [];
      }
    },
    {
      revalidateOnReconnect: true,
    }
  );


