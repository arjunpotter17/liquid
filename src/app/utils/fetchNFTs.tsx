import { fetchAllDigitalAssetByOwner } from "@metaplex-foundation/mpl-token-metadata";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplCore } from "@metaplex-foundation/mpl-core";
import { PublicKey } from "@metaplex-foundation/umi";
import axios from "axios";
import { getEndpoint } from "./helpers";

const fetchNFTs = async (ownerPublicKey: PublicKey) => {
  const umi = createUmi(getEndpoint("mainnet")).use(mplCore());

  try {
    // Convert the Base58 string to a PublicKey object from @solana/web3.js
    const assetsByOwner = await fetchAllDigitalAssetByOwner(
      umi,
      ownerPublicKey
    );
    console.log(assetsByOwner);
    const nfts = assetsByOwner.filter(
      (token) => token?.metadata?.uri.length > 1
    );
    const metaNfts = await Promise.all(
      nfts.map(async (nft) => {
        const metadataResponse = await axios.get(nft.metadata.uri);
        return { ...nft, metadataDetails: metadataResponse.data };
      })
    );
    console.log(metaNfts);
    return metaNfts;
  } catch (error) {
    console.error("Error fetching NFTs:", error);
    return [];
  }
};

export default fetchNFTs;
