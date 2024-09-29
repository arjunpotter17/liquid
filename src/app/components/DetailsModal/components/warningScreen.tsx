import React from "react";
import Spinner from "../../Spinner/Spinner";

interface WarningComponentProps {
  loading: boolean;
  showLoader: boolean;
  setShowWarning: React.Dispatch<React.SetStateAction<boolean>>;
  handleNFTLiquidate: () => void;
}

const WarningComponent: React.FC<WarningComponentProps> = ({
  loading,
  showLoader,
  setShowWarning,
  handleNFTLiquidate,
}) => {
  return (
    <div className="flex flex-col w-full justify-between gap-y-10">
      {/* Warning Box */}
      <div className="p-4 border border-yellow-700 bg-transparent rounded-md shadow-md flex self-center items-start font-liquid-regular text-justify">
        <div>
          <h2 className="font-bold text-yellow-700 text-lg">Warning</h2>
          <p className="text-yellow-700 mt-2">
            Liquid utilizes Tensor and Jupiter APIs to facilitate NFT sales and
            swaps. While both platforms are highly reliable, please be aware
            that Liquid cannot guarantee a 100% success rate due to our reliance
            on these third-party services. By proceeding, you acknowledge the
            possibility of receiving SOL for your NFT in the rare event of a
            failure with the Jupiter API or any unforeseen issues that may arise
            on Liquid&apos;s end.
          </p>
          <p className="text-yellow-700 mt-2">
            We do not charge any fees for selling your NFT. This process is
            identical to making a sale directly on Tensor.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex w-full gap-x-2 self-end ">
        {/* Back Button */}
        <button
          disabled={loading}
          className={`mt-4 p-2 w-full bg-liquid-blue hover:bg-liquid-dark-blue text-liquid-black cursor-pointer rounded ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() => setShowWarning(false)}
          aria-busy={loading}
        >
          Back
        </button>

        {/* Proceed Button */}
        <button
          disabled={loading}
          className={`mt-4 p-2 w-full bg-liquid-blue hover:bg-liquid-dark-blue text-liquid-black cursor-pointer rounded ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleNFTLiquidate}
          aria-busy={loading}
        >
          {showLoader ? <Spinner size={25} /> : "Proceed"}
        </button>
      </div>
    </div>
  );
};

export default WarningComponent;
