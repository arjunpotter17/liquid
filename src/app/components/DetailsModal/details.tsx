import React, { useEffect, useState } from "react";
import NFTDetailsView from "./components/NFTInfo";
import TokenSearchView from "./components/TokenSelect";
import WarningComponent from "./components/warningScreen"; // Import WarningComponent
import {
  getConnection,
  getNftInfo,
  highestPricePool,
} from "@/app/utils/helpers";
import {
  NFTDetailsModalProps,
  PoolData,
  Price,
  PriceDetails,
  TokenInfo,
} from "@/app/interfaces";
import { swapFunds } from "@/app/utils/swapFunds";
import { PublicKey, ParsedAccountData } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { toast } from "sonner";
import { handleLiquidate } from "@/app/utils/handleLiquidate";

const NFTDetailsModal: React.FC<NFTDetailsModalProps> = ({ nft, onClose }) => {
  const connection = getConnection();
  const wallet = useWallet();
  const [selectedToken, setSelectedToken] = useState<TokenInfo | null>(null);
  const [priceDetails, setPriceDetails] = useState<PriceDetails[] | null>(null);
  const [price, setPrice] = useState<Price | null>(null);
  const [pool, setPool] = useState<PoolData | null>(null);
  const [showTokenSearch, setShowTokenSearch] = useState<boolean>(false);
  const [showWarning, setShowWarning] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSlippage, setSelectedSlippage] = useState(0.5);
  const [loadingPrice, setLoadingPrice] = useState<boolean>(false);
  const [swapData, setSwapData] = useState<any | null>(null);

  const fetchDetails = async () => {
    try {
      setLoadingPrice(true);
      const fetchedPriceDetails = await getNftInfo(nft.mint.publicKey);
      const fetchedPool = await highestPricePool(nft.mint.publicKey);
      setPriceDetails(fetchedPriceDetails);
      setPrice({
        rate: parseFloat(fetchedPriceDetails?.lastSale?.price),
        currency: "Sol",
      });

      setPool(fetchedPool);
      setLoadingPrice(false);
    } catch (error) {
      console.error("Error fetching NFT details:", error);
    }
  };

  const handleNFTLiquidate = async () => {
    if (!wallet.connected || !selectedToken) {
      console.log("Wallet not connected");
      toast("Wallet not connected or token not selected");
      return;
    }
    if (nft && swapData) {
      const result = await handleLiquidate(nft.publicKey, wallet, swapData);
      console.log(result);
    }
  };

  useEffect(() => {
    if (pool?.currentSellPrice)
      setPrice({
        rate: parseFloat(pool?.currentSellPrice),
        currency: "Sol",
      });
  }, [pool]);

  useEffect(() => {
    if (nft.metadata.collection) {
      fetchDetails();
    }
  }, [nft]);

  const priceUpdate = async () => {
    if (!pool) return;
    const swapData = await swapFunds(
      parseFloat(pool.currentSellPrice),
      selectedToken?.address as string,
      selectedSlippage * 100
    );
    setSwapData(swapData);
  };

  const handleTokenChange = async (token: TokenInfo) => {
    {
      setSelectedToken(token);
      setShowTokenSearch(false);
      if (token.address !== "So11111111111111111111111111111111111111112") {
        if (!pool) return;
        setLoadingPrice(true);
        const swapData = await swapFunds(
          parseFloat(pool.currentSellPrice),
          token.address,
          selectedSlippage * 100
        );
        setSwapData(swapData);
        try {
          const mintInfo = await connection.getParsedAccountInfo(
            new PublicKey(token.address)
          );

          if (mintInfo.value && "parsed" in mintInfo.value.data) {
            const parsedData = mintInfo.value.data as ParsedAccountData;
            const decimals = parsedData.parsed.info.decimals;
            setPrice({
              rate: swapData?.outAmount / 10 ** decimals,
              currency: token.symbol,
              logo: token.logoURI,
            });
          } else {
            setPrice(swapData?.outAmount);
          }
        } catch (error) {
          console.error("Error fetching mint info:", error);
        } finally {
          setLoadingPrice(false);
        }
      } else {
        // setPrice(parseFloat(pool?.currentSellPrice as string) / 10 ** 9);
        setPrice({
          rate: parseFloat(pool?.currentSellPrice as string) / 10 ** 9,
          currency: token.symbol,
          logo: token.logoURI,
        });
      }
    }
  };

  const handleLiquidateClick = () => {
    setShowWarning(true);
  };

  const handleProceed = () => {
    setShowWarning(false);
    handleNFTLiquidate();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-liquid-popup-bg bg-opacity-50">
      <div className="relative bg-liquid-card-gray-bg px-6 pt-6 pb-3 rounded-lg max-w-lg w-full mx-4 liquid-md:mx-0 h-[500px] overflow-y-auto scrollbar-thin scrollbar-track-liquid-black scrollbar-thumb-liquid-dark-blue">
        {showWarning ? (
          <div className="w-full h-full self-center flex flex-col justify-between">
            <WarningComponent />
            <div className="flex w-full gap-x-2">
              <button
                className="mt-4 p-2 w-full bg-liquid-blue hover:bg-liquid-dark-blue text-white cursor-pointer rounded"
                onClick={() => setShowWarning(false)}
              >
                Back
              </button>
              <button
                className="mt-4 p-2 w-full bg-liquid-blue hover:bg-liquid-dark-blue text-white cursor-pointer rounded"
                onClick={handleProceed}
              >
                Proceed
              </button>
            </div>
          </div>
        ) : !showTokenSearch ? (
          <NFTDetailsView
            nft={nft}
            priceDetails={priceDetails}
            pool={pool}
            price={price}
            selectedToken={selectedToken as TokenInfo}
            onTokenChange={handleTokenChange}
            onClose={onClose}
            onLiquidate={handleLiquidateClick}
            selectedSlippage={selectedSlippage}
            setSelectedSlippage={setSelectedSlippage}
            setShowTokenSearch={setShowTokenSearch}
            priceLoading={loadingPrice}
            setPriceLoading={setLoadingPrice}
            fetchNewPrice={priceUpdate}
          />
        ) : (
          <TokenSearchView
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onClose={() => setShowTokenSearch(false)}
            onTokenSelect={handleTokenChange}
          />
        )}
      </div>
    </div>
  );
};

export default NFTDetailsModal;
