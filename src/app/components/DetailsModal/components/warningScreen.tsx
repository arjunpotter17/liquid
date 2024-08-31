import React from "react";
// import { ExclamationTriangleIcon } from "@heroicons/react/24/outline"; // You can replace this with any warning icon of your choice

const WarningComponent: React.FC = () => {
  return (
    <div className="p-4 border border-yellow-700 bg-transaparent rounded-md shadow-md flex self-center items-start font-liquid-regular text-justify">
      {/* <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600 mr-2 mt-1" /> */}
      <div>
        <h2 className="font-bold text-yellow-700 text-lg">Warning</h2>
        <p className="text-yellow-700 mt-2">
        Liquid utilizes Tensor and Jupiter APIs to facilitate NFT sales and swaps. While both platforms are highly reliable, please be aware that Liquid cannot guarantee a 100% success rate due to our reliance on these third-party services. By proceeding, you acknowledge the possibility of receiving SOL for your NFT in the rare event of a failure with the Jupiter API or any unforeseen issues that may arise on Liquid's end.


        </p>
        <p className="text-yellow-700 mt-2">
        We do not charge any fees for selling your NFT. This process is identical to making a sale directly on Tensor.
        </p>
      </div>
    </div>
  );
};

export default WarningComponent;
