"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { PublicKey as umiKey } from "@metaplex-foundation/umi";
import { fetcher } from "@/app/utils/helpers";
import { handleLiquidate } from "@/app/utils/handleLiquidate";
import fetchNFTs from "@/app/utils/fetchNFTs";

export default function DashboardFeature() {
  // States
  const [tokens, setTokens] = useState<any>([]);
  const [nfts, setNfts] = useState<any>([]); // State to store NFTs
  const [selectedTokensForNFTs, setSelectedTokensForNFTs] = useState<any>({}); // Initialize as an empty object

  // Get tokens from Jupiter
  const { data: tokensData, error: tokenError } = useSWR(
    "https://tokens.jup.ag/tokens?tags=verified",
    fetcher
  );

  // Hooks
  const wallet = useWallet();

  // Fetch NFTs when wallet is connected
  useEffect(() => {
    if (wallet.connected && wallet.publicKey) {
      // Public key from umi is diff from public key from web3
      fetchNFTs(wallet.publicKey as any as umiKey).then((data) => {
        setNfts(data);
      });
    }
  }, [wallet.connected, wallet.publicKey]);

  // setTokens when tokensData is fetched
  useEffect(() => {
    if (tokensData) {
      setTokens(tokensData);
    }
  }, [tokensData]);

  const handleNFTLiquidate = async (
    nftAddress: string,
    selectedTokenAddress: string
  ) => {
    console.log("Liquidating NFT:", nftAddress, selectedTokenAddress);
    if (!wallet.connected || !selectedTokenAddress) {
      console.log("Wallet not connected or token not selected");
      return;
    }
    const signedTxs = await handleLiquidate(
      nftAddress,
      wallet,
      selectedTokenAddress
    );
    console.log(signedTxs);
  };

  const handleTokenChangeForNFT = (
    nftAddress: string,
    tokenAddress: string
  ) => {
    setSelectedTokensForNFTs((prev: any) => ({
      ...prev,
      [nftAddress]: tokenAddress,
    }));
  };

  return (
    <div className="flex flex-col scroll-smooth gap-y-10 min-h-screen items-center p-6 bg-transparent pt-[74px] relative overflow-y-auto scrollbar-none">
      {/* NFT Cards */}
      {nfts?.map((nft: any) => (
        <div
          key={nft.publicKey}
          className="p-4 bg-gray-800 text-white rounded-lg mb-4 w-full max-w-md"
        >
          <img
            src={nft.metadataDetails?.image}
            alt={nft.metadataDetails?.name}
            className="w-full h-48 object-cover rounded"
          />
          <p className="font-bold">{nft.metadataDetails?.name}</p>
          <select
            className="w-full p-2 mt-2 bg-gray-700 text-white rounded"
            value={selectedTokensForNFTs[nft.publicKey] || ""}
            onChange={(e) =>
              handleTokenChangeForNFT(nft.publicKey, e.target.value)
            }
          >
            <option value="" disabled>
              Select Token
            </option>
            {tokens.map((token: any) => (
              <option key={token.address} value={token.address}>
                {token.name} ({token.symbol})
              </option>
            ))}
          </select>
          <button
            className="mt-4 p-2 w-full bg-red-500 rounded hover:bg-red-600"
            onClick={() =>
              handleNFTLiquidate(
                // nft.publicKey,
                "2938fxwXN44gAWkbhUpfuyNpsd1ucA3nVyTffHSfrFwS",
                selectedTokensForNFTs[nft.publicKey]
              )
            }
            disabled={!selectedTokensForNFTs[nft.publicKey]}
          >
            Liquidate
          </button>
        </div>
      ))}
    </div>
  );
}
