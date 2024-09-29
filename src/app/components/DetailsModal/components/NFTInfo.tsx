import React, { useState, useEffect } from "react";
import { CloseIcon } from "@/app/Icons/CloseIcon";
import { NFTDetailsModalProps, Price, TokenInfo } from "@/app/interfaces";
import { PoolData, PriceDetails } from "@/app/interfaces";
import truncateWallet from "@/app/utils/helpers";
import { stables } from "@/app/constants/tokens";
import { handleCopy } from "@/app/utils/helpers";
import CopyToClipboard from "react-copy-to-clipboard";
import PriceSkeleton from "../../skeletons/PriceSkeleton";

interface NFTDetailsViewProps {
  nft: NFTDetailsModalProps["nft"];
  priceDetails: PriceDetails[] | null;
  price: Price | null;
  pool: PoolData | null;
  selectedToken: TokenInfo;
  onTokenChange: (token: TokenInfo) => Promise<void>;
  onClose: () => void;
  onLiquidate: () => void;
  selectedSlippage: number;
  setSelectedSlippage: (slippage: number) => void;
  setShowTokenSearch: React.Dispatch<React.SetStateAction<boolean>>;
  priceLoading: boolean;
  setPriceLoading: React.Dispatch<React.SetStateAction<boolean>>; // Add this prop to handle price loading state
  fetchNewPrice: () => Promise<void>; // Add this prop to fetch new price
}

const NFTDetailsView: React.FC<NFTDetailsViewProps> = ({
  nft,
  priceDetails,
  price,
  selectedToken,
  onTokenChange,
  onClose,
  onLiquidate,
  selectedSlippage,
  setSelectedSlippage,
  setShowTokenSearch,
  priceLoading,
  setPriceLoading,
  fetchNewPrice,
}) => {
  const properties = nft.content?.metadata?.attributes || [];
  const [isDropdownOpen, setDropdownOpen] = useState(false); // State for dropdown open/close
  const [countdown, setCountdown] = useState(15); // Timer countdown state

  // Effect to handle the countdown timer

  useEffect(() => {
    // Check if the selected token is not native SOL
    if (
      selectedToken &&
      selectedToken.address !== "So11111111111111111111111111111111111111112"
    ) {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        // When countdown reaches 0, set loading to true, fetch new price, and reset countdown
        setPriceLoading(true);
        fetchNewPrice().then(() => {
          setPriceLoading(false);
          setCountdown(15); // Reset countdown
        });
      }
    } else {
      setCountdown(15); // Reset countdown
    }
  }, [countdown, fetchNewPrice, setPriceLoading, selectedToken]);

  return (
    <div className="font-liquid-regular">
      <button className="absolute top-4 right-4" onClick={onClose}>
        <CloseIcon />
      </button>
      <div className="flex justify-start gap-x-3">
        <img
          src={nft.content?.links?.image}
          alt={nft.content?.metadata?.name}
          className="object-cover w-24 h-24 rounded mb-4"
        />

        <div className="flex flex-col items-start justify-end overflow-x-auto text-nowrap scrollbar-none">
          <h2 className="text-liquid-title font-liquid-bold text-liquid-blue mb-2">
            {nft.content?.metadata?.name}
          </h2>
        </div>
      </div>

      {properties.length > 0 && (
        <div className="mb-2 flex gap-2 overflow-x-auto scrollbar-none">
          {properties.map((property: any, index: number) => (
            <div
              key={index}
              className="px-2 py-1 bg-transparent border border-liquid-blue rounded text-sm flex text-liquid-blue items-center"
            >
              <p className="text-nowrap">{property.trait_type} :</p>
              <p className="text-nowrap"> {property.value}</p>
            </div>
          ))}
        </div>
      )}

      {priceDetails ? (
        <p className="text-liquid-blue">
          <span className="mb-2 text-liquid-gray">Last Sale Price:</span>{" "}
          {parseFloat(priceDetails[0]?.lastSale?.price as string) / 10 ** 9 ??
            "Unknown"}{" "}
          Sol
        </p>
      ) : (
        <div className="text-liquid-blue flex">
          <span className="mb-2 text-liquid-gray">Last Sale Price:</span>{" "}
          <PriceSkeleton />
        </div>
      )}

      <div className="flex w-full justify-between">
        <div className="text-liquid-blue flex">
          {" "}
          <span className="text-liquid-gray">Current Max Price: </span>
          {!priceLoading ? (
            <>
              <span className="flex gap-x-2 justify-center items-center">
                {price ? price.rate : "Unknown"}
                {price?.logo ? (
                  <img
                    src={price.logo}
                    alt="price.currency"
                    loading="eager"
                    className="w-5 h-5"
                  />
                ) : (
                  <span> {price?.currency}</span>
                )}
              </span>
            </>
          ) : (
            <PriceSkeleton />
          )}
        </div>
        {/* Display the countdown timer */}
        {selectedToken &&
          selectedToken.address !==
            "So11111111111111111111111111111111111111112" && (
            <div className="text-liquid-blue text-sm font-liquid-regular">
              {countdown > 0 ? `Refreshing in ${countdown}s` : "Refreshing..."}
            </div>
          )}
      </div>
      <p className="mb-4 text-liquid-blue">
        <span className="text-liquid-gray">Mint:</span>{" "}
        <CopyToClipboard text={nft.id} onCopy={handleCopy}>
          <span className="cursor-pointer hover:underline">
            {truncateWallet(nft.id, 10, true)}
          </span>
        </CopyToClipboard>
      </p>

      {/* Slippage selection */}
      <div className="mb-4">
        <label className="block mb-2 text-liquid-gray">Select Slippage:</label>
        <div className="flex gap-2">
          {[0.3, 0.5, 1].map((slippage) => (
            <button
              key={slippage}
              onClick={() => setSelectedSlippage(slippage)}
              className={`px-3 py-1 border text-xs rounded ${
                selectedSlippage === slippage
                  ? "bg-liquid-blue text-liquid-black"
                  : "bg-transparent text-liquid-blue"
              }`}
            >
              {slippage}%
            </button>
          ))}
        </div>
      </div>

      {/* Custom Token Dropdown */}
      <div className="mb-4 relative">
        <label className="block mb-2 text-liquid-gray">
          Select Token for Swap:
        </label>
        <button
          className="w-full p-2 border rounded bg-liquid-black text-white flex justify-between items-center"
          onClick={() => setDropdownOpen(!isDropdownOpen)}
        >
          {selectedToken?.symbol || "Select a token"}
          <span className="ml-2">&#9662;</span>
        </button>
        {isDropdownOpen && price?.rate !== 0 && !priceLoading && (
          <ul className="absolute w-full bg-liquid-black border border-liquid-blue rounded mt-1">
            {stables.map((token) => (
              <li
                key={token.address}
                className="flex items-center p-2 hover:bg-liquid-blue cursor-pointer text-white"
                onClick={() => {
                  onTokenChange(token);
                  setDropdownOpen(false);
                }}
              >
                {token.logoURI && (
                  <img
                    src={token.logoURI}
                    alt={token.name}
                    className="w-5 h-5 mr-2"
                  />
                )}
                {token.symbol}
              </li>
            ))}
            <li
              key={"showmore"}
              className="flex items-center p-2 hover:bg-liquid-blue cursor-pointer text-white"
              onClick={() => {
                setShowTokenSearch(true);
                setDropdownOpen(false);
              }}
            >
              Show More
            </li>
          </ul>
        )}
      </div>

      <button
        disabled={price?.rate === 0 || priceLoading}
        className="mt-4 p-2 w-full bg-liquid-blue hover:bg-liquid-dark-blue text-liquid-black cursor-pointer rounded disabled:bg-liquid-gray disabled:cursor-not-allowed"
        onClick={onLiquidate}
      >
        {price?.rate === 0 ? "No pools available" : "Liquidate"}
      </button>
    </div>
  );
};

export default NFTDetailsView;
