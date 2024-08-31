import React, { useEffect, useState } from "react";
// import { ArrowBackIcon } from "@/app/Icons/ArrowBackIcon"; // Import a back button arrow icon
import useSWR from "swr";
import { fetcher } from "@/app/utils/helpers";
import { TokenInfo } from "@/app/interfaces";

interface TokenSearchViewProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onClose: () => void;
  onTokenSelect: (token: TokenInfo) => Promise<void>;
}

const TokenSearchView: React.FC<TokenSearchViewProps> = ({
  searchTerm,
  setSearchTerm,
  onClose,
  onTokenSelect,
}) => {
  const {
    data: tokensData,
    error: tokenError,
    isLoading,
  } = useSWR("https://tokens.jup.ag/tokens?tags=verified", fetcher);

  const [tokens, setTokens] = useState<any[]>([]);

  useEffect(() => {
    if (tokensData) {
      setTokens(tokensData);
    }
  }, [tokensData]);

  return (
    <div className="w-full relative font-liquid-regular text-sm flex items-center justify-center">
      <button
        className="absolute font-liquid-regular top-1 px-3 py-1 rounded right-0 bg-liquid-blue text-liquid-black hover:bg-liquid-dark-blue transition"
        onClick={onClose}
      >
        Back
      </button>
      <div className="mt-14 w-full mx-auto">
        <input
          type="text"
          className="w-full p-2 border rounded-lg mb-4 focus:outline-none bg-transparent focus:border-liquid-blue text-liquid-dark-white"
          placeholder="Search tokens"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-track-liquid-black scrollbar-thumb-liquid-blue">
          {tokens
            .filter((token: any) =>
              token.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((token: any) => (
              <div
                key={token.address}
                className="flex items-center p-2 py-3 border-b border-liquid-gray cursor-pointer transition hover:bg-liquid-blue"
                onClick={() => {
                  onTokenSelect(token);
                }}
              >
                <div className="flex justify-between items-center w-full pr-3 cursor-pointer text-white">
                  <span className="font-liquid-regular">{token.name}</span>
                  <span className="text-sm text-gray-600">{token.symbol}</span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default TokenSearchView;
