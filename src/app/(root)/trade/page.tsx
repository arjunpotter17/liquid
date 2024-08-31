"use client";
import React, { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey as umiKey } from "@metaplex-foundation/umi";
import fetchNFTs from "@/app/utils/fetchNFTs";
import { motion } from "framer-motion";
import NFTDetailsModal from "../../components/DetailsModal/details"; // Update this path as needed
import { toast } from "sonner";

const Trade: React.FC = () => {
  const [nfts, setNfts] = useState<any[]>([]);
  const [selectedNFT, setSelectedNFT] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);


  const wallet = useWallet();

  useEffect(() => {
    if (wallet.connected && wallet.publicKey) {
      setLoading(true);
      fetchNFTs(wallet.publicKey as any as umiKey).then((data) => {
        setNfts(data);
        setLoading(false);
      });
    
    }
  }, [wallet.connected, wallet.publicKey]);

  return !wallet.connected ? (
    <div className="flex justify-center min-h-screen items-center p-6 pt-[74px]">
      <p className="flex justify-center items-center w-full h-full text-gray-500 font-liquid-semibold">
        I cannot see your NFTs without access to your wallet my friend. Don&apos;t be
        shy!
      </p>
    </div>
  ) : wallet.connected && nfts.length === 0 && !loading ? (
    <div className="flex justify-center min-h-screen items-center p-6 pt-[74px]">
      <p className="flex justify-center items-center w-full h-full text-gray-500 font-liquid-semibold">
      What a noob. Go buy some NFTs
      </p>
    </div>
  ) : loading ? (
    <div className="flex justify-center min-h-screen items-center p-6 pt-[74px]">
      <p className="flex justify-center items-center w-full h-full text-gray-500 font-liquid-semibold">
      Fetching your collection...
      </p>
    </div>
  ) : (
    <div className="flex justify-center gap-x-4 scroll-smooth gap-y-10 min-h-screen items-start px-4 liquid-md:px-10 bg-transparent pt-[74px] relative overflow-y-auto scrollbar-none">
      
      {nfts.length > 0 && (
        <div className="flex flex-col w-full justify-center items-start mt-14 font-liquid-regular">
          <p className="text-liquid-blue mb-5">Inventory</p>
          <div className="w-full h-full flex flex-col items-center l liquid-md:flex-row liquid:md-justify-start liqui-md:items-start gap-4">
            {nfts?.map((nft: any) => (
              <motion.div
                key={nft.publicKey}
                className=" bg-liquid-card-gray-bg text-white mb-4 w-[325px] h-[260px] cursor-pointer pb-6 hover:shadow-cardHover rounded-t-lg"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.2 }}
                onClick={() => setSelectedNFT(nft)}
              >
                <img
                  src={nft.metadataDetails?.image}
                  alt={nft.metadataDetails?.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
               
                  <p className="text-liquid-title mt-4 px-3">
                    {nft.metadataDetails?.name}
                  </p>
                  
               
              </motion.div>
            ))}
          </div>
        </div>
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
