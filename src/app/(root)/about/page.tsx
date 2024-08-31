{/* <select
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
          </select> */}