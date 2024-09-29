import React, { useEffect, useRef, useState } from "react";
import {
  handleCopy,
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
import { ParsedAccountData } from "@solana/web3.js";
import { PublicKey as umiKey } from "@metaplex-foundation/umi";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { toast } from "sonner";
import { handleLiquidate } from "@/app/utils/handleLiquidate";
import CopyToClipboard from "react-copy-to-clipboard";
import { mutate } from "swr";
import dynamic from "next/dynamic";

const Spinner = dynamic(() => import("../Spinner/Spinner"), {ssr:true});
const WarningComponent = dynamic(() => import("./components/warningScreen"), {ssr:true});
const NFTDetailsView = dynamic(() => import("./components/NFTInfo"), {ssr:true});
const TokenSearchView = dynamic(() => import("./components/TokenSelect"), {ssr:true});


const NFTDetailsModal: React.FC<NFTDetailsModalProps> = ({ nft, onClose }) => {
  //hooks
  const wallet = useWallet();
  const hasFetched = useRef(false);
  const {connection} = useConnection();

  //states
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
  const [loading, setLoading] = useState<boolean>(false);
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const [result, setResults] = useState<string[]>([]);
  const [isAnimating, setIsAnimating] = useState<boolean>(true);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [transactionError, setTransactionError] = useState<boolean>(false);
  const [showLoader, setShowLoader] = useState<boolean>(false);

  //popup mount dismount animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    mutate(["ALL_NFTS", wallet.publicKey as any as umiKey]);
    setIsVisible(false);
    setTimeout(() => {
      setIsAnimating(false);
      onClose();
    }, 500);
  };

  //fetch NFT details
  const fetchPoolsForNFT = async () => {
    try {
      setLoadingPrice(true);
      const { highestPricePool: fetchedPool, nftData: fetchedPriceDetails } =
        await highestPricePool(nft.id);
      setPriceDetails(fetchedPriceDetails);
      setPrice({
        rate: parseFloat(fetchedPriceDetails?.lastSale?.price),
        currency: "Sol",
      });
      if (!fetchedPool) {
        throw new Error("No pool with a currentSellPrice");
      }
      setPool(fetchedPool);
      setLoadingPrice(false);
    } catch (error) {
      console.error("Error fetching NFT details:", error);
      toast.error(`${nft.compression.compressed ? "Tensor does not provide pools for cNFTs. Bid feature coming soon!" : "NFT does not have a pool. Make sure your NFT is part of a collection. NFTs outside of a collection cannot be instantly liquidated."}`);
      setPrice({
        rate: 0,
        currency: "Sol",
      });
      setLoadingPrice(false);
    }
  };

  //get rid NFT
  const handleNFTLiquidate = async () => {
    setShowLoader(true);
    if (!wallet.connected) {
      console.log("Wallet not connected");
      toast.error("Wallet not connected or token not selected");
      setShowLoader(false);
      setLoading(false);
      setTransactionError(true);
      return;
    }
    if (nft) {
      const liquidationToast = toast.loading("Liquidating NFT");

      const result = await handleLiquidate(
        nft.id,
        wallet,
        !selectedToken ? null : swapData,
        setLoading,
        setShowWarning, 
        connection
      );

      toast.dismiss(liquidationToast);

      if(result instanceof Error){
        setTransactionError(true);
          setLoading(false);
          setShowWarning(false);
          setShowLoader(false);
        toast.error(result.message);
        return;
      } else{
        setResults(result as string[]);
        setLoading(false);
        setShowMessage(true);
        setShowLoader(false);
        toast.success("NFT liquidated successfully.");
      }
    }
  };

  //set init price to highest pool price
  useEffect(() => {
    if (pool?.currentSellPrice)
      setPrice({
        rate: parseFloat(pool?.currentSellPrice) / 10 ** 9,
        currency: "Sol",
      });
  }, [pool]);

  //fetch details when component mounts
  useEffect(() => {
    if (!hasFetched.current) {
      fetchPoolsForNFT();
      hasFetched.current = true;
    }
  }, []);

  //update price every whatever seconds
  const priceUpdate = async () => {
    if (!pool) return;
    const swapData = await swapFunds(
      parseFloat(pool.currentSellPrice),
      selectedToken?.address as string,
      selectedSlippage * 100
    );
    setSwapData(swapData);
  };

  //handle change of tokens
  const handleTokenChange = async (token: TokenInfo) => {
    {
      console.log("Token selected:", token);
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
          const { mintInfo } = await fetch(
            "/api/helius/accountInfo?address=" + token.address.toString()
          ).then((res) => res.json());
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
        setPrice({
          rate: parseFloat(pool?.currentSellPrice as string) / 10 ** 9,
          currency: token.symbol,
          logo: token.logoURI,
        });
        setSwapData(null);
      }
    }
  };

  //switch to show warning
  const handleLiquidateClick = () => {
    setShowWarning(true);
  };

  return (
    <>
      {isAnimating && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-liquid-popup-bg bg-opacity-50 transition-opacity duration-500 ease-in-out ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="relative bg-liquid-card-gray-bg px-6 pt-6 pb-3 rounded-lg max-w-lg w-full mx-4 liquid-md:mx-0 h-[500px] overflow-y-auto scrollbar-thin scrollbar-track-liquid-black scrollbar-thumb-liquid-dark-blue">
            {showWarning ? (
              <div className="w-full">
                <WarningComponent loading={loading} setShowWarning={setShowWarning} handleNFTLiquidate={handleNFTLiquidate} showLoader={showLoader}/>
                
              </div>
            ) : loading ? (
              <div className="w-full h-full self-center flex flex-col gap-y-20 p-5 items-center">
                <p className="text-liquid-blue w-full text-liquid-logo font-liquid-semibold mt-5 text-center">
                  Liquidation in progress
                </p>
                <div className="flex flex-col gap-y-3 items-start">
                  <Spinner size={50} />
                  <p className="text-liquid-gray font-liquid-semibold mt-5">
                    This might take a while, go touch some grass!
                  </p>
                </div>
              </div>
            ) : transactionError ? (
              <div className="w-full h-full self-center flex flex-col justify-between items-center gap-y-5 p-5">
                <div>
                  <p className="text-liquid-blue text-left w-full text-liquid-logo font-liquid-semibold mt-5">
                    Unable to Liquidate
                  </p>

                  <p className="text-liquid-gray font-liquid-semibold mt-5">
                    Unable to liquidate at this time. Please contact us if this
                    behaviour persists.
                  </p>
                </div>
                <button
                  className="mt-4 p-2 w-full bg-liquid-blue hover:bg-liquid-dark-blue text-white cursor-pointer rounded"
                  onClick={handleClose}
                >
                  Close
                </button>
              </div>
            ) : showMessage ? (
              <div className="w-full h-full self-center flex flex-col justify-between p-5">
                <div className="flex flex-col items-center w-full">
                  <p className="text-liquid-blue text-left w-full text-liquid-logo font-liquid-semibold mt-5">
                    Liquidation Successful
                  </p>
                  <p className="text-liquid-dark-white font-liquid-regular text-[20px] mt-2">
                    Your NFT has been liquidated{" "}
                    {result.length > 1 && <span>to your desired token</span>}.
                    Please check your wallet and view transaction details below.
                  </p>
                  <div className="flex flex-col w-full mt-4 text-liquid-dark-white font-liquid-regular gap-y-3">
                    <p>
                      Sell Transaction:{" "}
                      <span
                        className="font-liquid-regular cursor-pointer hover:underline text-liquid-blue"
                        onClick={() =>
                          window.open(
                            `https://explorer.solana.com/tx/${result[0]}`,
                            "blank"
                          )
                        }
                      >
                        Explorer
                      </span>{" "}
                      |{" "}
                      <CopyToClipboard text={result[0]} onCopy={handleCopy}>
                        <span className="font-liquid-regular cursor-pointer hover:underline text-liquid-blue">
                          Tx Signature
                        </span>
                      </CopyToClipboard>
                    </p>
                    {result?.length > 1 && (
                      <p>
                        Swap Transaction:{" "}
                        <span
                          className="font-liquid-regular cursor-pointer hover:underline text-liquid-blue"
                          onClick={() =>
                            window.open(
                              `https://explorer.solana.com/tx/${result[1]}`,
                              "blank"
                            )
                          }
                        >
                          Explorer
                        </span>{" "}
                        |{" "}
                        <CopyToClipboard text={result[1]} onCopy={handleCopy}>
                          <span className="font-liquid-regular cursor-pointer hover:underline text-liquid-blue">
                            Tx Signature
                          </span>
                        </CopyToClipboard>
                      </p>
                    )}
                  </div>
                </div>
                <button
                  className="mt-4 p-2 w-full bg-liquid-blue hover:bg-liquid-dark-blue text-white cursor-pointer rounded"
                  onClick={handleClose}
                >
                  Close
                </button>
              </div>
            ) : !showTokenSearch ? (
              <NFTDetailsView
                nft={nft}
                priceDetails={priceDetails}
                pool={pool}
                price={price}
                selectedToken={selectedToken as TokenInfo}
                onTokenChange={handleTokenChange}
                onClose={handleClose}
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
      )}
    </>
  );
};

export default NFTDetailsModal;
