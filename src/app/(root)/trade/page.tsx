"use client";
import React, { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey as umiKey } from "@metaplex-foundation/umi";
import { useNFT } from "@/app/utils/fetchNFTs";
import { motion } from "framer-motion";
import NFTDetailsModal from "../../components/DetailsModal/details";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import Image from "next/image";

const Trade: React.FC = () => {
  // States
  const [nfts, setNfts] = useState<any[]>([]);
  const [selectedNFT, setSelectedNFT] = useState<any>(null);

  // Hooks
  const wallet = useWallet();
  const { data, error, isLoading } = useNFT(wallet.publicKey as any as umiKey);

  // Fetch NFTs on wallet connection
  useEffect(() => {
    if (wallet.connected && data) {
      setNfts(data);
    }
  }, [wallet.connected, data]);

  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return !wallet.connected ? (
    <div className="flex justify-center min-h-screen items-center p-6 pt-[74px]">
      <p className="flex justify-center items-center w-full h-full text-liquid-gray font-liquid-semibold">
        I cannot see your NFTs without access to your wallet my friend.
        Don&apos;t be shy!
      </p>
    </div>
  ) : wallet.connected && nfts.length === 0 && !isLoading ? (
    <div className="flex flex-col justify-center min-h-screen items-center p-6 gap-y-4 pt-[74px] px-4 liquid-md:px-10">
      
        <button
          className="text-liquid-gray bg-liquid-dark-blue hover:text-liquid-white hover:bg-liquid-blue font-liquid-bold rounded-[50%] border border-liquid-gray w-5 text-sm"
          data-tooltip-id="infoTooltip"
          data-tooltip-content="Liquid v0 uses the Metaplex UMI standard to fetch tokens and token details. This does not support cNFTs. If you do not see an NFT that you own, it is most likely that your token is not present in the Metaplex registry or is a cNFT. If you feel this is wrong, please contact us."
        >
          i
        </button>

        {/* Tooltip */}
        <Tooltip id="infoTooltip" place="top" className="max-w-72" />
    
      <p className="flex justify-center items-center w-full h-full text-liquid-gray font-liquid-semibold">
        What a noob. Go buy some NFTs
      </p>
    </div>
  ) : isLoading ? (
    <div className="flex justify-center min-h-screen items-center p-6 pt-[74px]">
      <p className="flex justify-center items-center w-full h-full text-liquid-gray font-liquid-semibold">
        Fetching your collection...
      </p>
    </div>
  ) : error ? (
    <div className="flex justify-center min-h-screen items-center p-6 pt-[74px]">
      <p className="flex justify-center items-center w-full h-full text-liquid-gray font-liquid-semibold">
        Error fetching your collection. Please try again later.
      </p>
    </div>
  ) : (
    <div className="flex justify-center gap-x-4 scroll-smooth gap-y-10 min-h-screen items-start px-4 liquid-md:px-10 bg-transparent pt-[74px] relative overflow-y-auto scrollbar-none">
      {nfts.length > 0 && (
        <motion.div
          className="flex flex-col w-full justify-center items-start mt-14 font-liquid-regular"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex justify-between w-full items-center">
            <p className="text-liquid-blue mb-5 text-liquid-title">Inventory</p>
            <button
              className="text-liquid-gray bg-liquid-dark-blue hover:text-liquid-white hover:bg-liquid-blue font-liquid-bold rounded-[50%] border border-liquid-gray w-5 text-sm"
              data-tooltip-id="infoTooltip"
              data-tooltip-content="Liquid v0 uses the Metaplex UMI standard to fetch tokens and token details. This does not support cNFTs. If you do not see an NFT that you own, it is most likely that your token is not present in the Metaplex registry or is a cNFT. If you feel this is wrong, please contact us."
            >
              i
            </button>

            {/* Tooltip */}
            <Tooltip id="infoTooltip" place="top" className="max-w-72" />
          </div>

          <div className="w-full h-full flex flex-col items-center liquid-md:flex-row liquid-md:justify-start liquid-md:items-start gap-4">
            {nfts?.map((nft: any) => (
              <motion.div
                key={nft.publicKey}
                className="bg-liquid-card-gray-bg text-white mb-4 w-[325px] h-[260px] cursor-pointer pb-6 hover:shadow-cardHover rounded-t-lg"
                variants={cardVariants}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.2 }}
                onClick={() => setSelectedNFT(nft)}
              >
                <img
                  src={nft.metadataDetails?.image}
                  alt={nft.metadataDetails?.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />

                <div className="w-full px-3">
                  <p className="text-liquid-title mt-4 overflow-x-auto scrollbar-none w-full text-nowrap">
                    {nft.metadataDetails?.name}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
      {selectedNFT && (
        <NFTDetailsModal
          nft={selectedNFT}
          onClose={() => setSelectedNFT(null)}
        />
      )}
    </div>
  );
};

export default Trade;
