import { WalletContextState } from "@solana/wallet-adapter-react";
import bs58 from "bs58";
import { Transaction, VersionedTransaction } from "@solana/web3.js";
import { liquidate } from "./liquidate";
import { swapFunds } from "./swapFunds";
import { getConnection } from "./helpers";
import { tipjito } from "./tipjito";

export const handleLiquidate = async (
  mint: string,
  wallet: WalletContextState,
  tokenAddress: string
) => {
  if (!wallet.signAllTransactions || !wallet.publicKey) {
    console.error("Wallet does not support signing transactions");
    return;
  }

  try {
    const connection = getConnection();
    // Step 1: Fetch liquidation transaction from Tensor and swap quote from Jupiter
    const data = await liquidate(mint);
    const swapData = await swapFunds(
      data?.highestPricePool?.currentSellPrice,
      tokenAddress
    );

    // Step 2: Fetch swap instructions from Jupiter
    const swapResponse = await fetch("/api/swap-inst-tx", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        swapData,
        key: wallet.publicKey.toBase58(),
      }),
    });

    const swapTransaction = await swapResponse.json();
    if (swapTransaction.error) {
      throw new Error(
        "Failed to get swap transaction: " + swapTransaction.error
      );
    }
    const swapTransactionBuf = Buffer.from(
      swapTransaction?.swapTransaction,
      "base64"
    );
    const deserializedSwap =
      VersionedTransaction.deserialize(swapTransactionBuf);
    // get the latest block hash
    const latestBlockHash = await connection.getLatestBlockhash();

    // deserialize the Tensor transaction
    const txsToSign = data?.data.txs.map((tx: any) =>
      tx.txV0
        ? VersionedTransaction.deserialize(tx.txV0.data)
        : Transaction.from(tx.tx.data)
    );

    //get tip transaction
    const tipTransaction = await tipjito(wallet.publicKey, connection);

    //sign the transactions
    const signedTransactions = await wallet.signAllTransactions([
      txsToSign,
      deserializedSwap,
      tipTransaction,
    ]);

    //convert the signed transactions to base58
    const base58TensorTransaction = bs58.encode(
      signedTransactions[0].serialize()
    );
    const base58SwapTransaction = bs58.encode(
      signedTransactions[1].serialize()
    );
    const base58TipTransaction = bs58.encode(signedTransactions[2].serialize());

    console.log(
      "Signed transactions",
      base58TensorTransaction,
      "signed transaction 2",
      base58TipTransaction,
      "signed transaction 3",
      base58SwapTransaction
    );

    //Send the signed transaction to the network using Jito API
    const response = await fetch("/api/send-bundle", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bundles: [
          base58TensorTransaction,
          base58SwapTransaction,
          base58TipTransaction,
        ],
      }),
    });

    const responseData = await response.json();
    console.log("Response", responseData);
  } catch (error) {
    console.error("Failed to liquidate", error);
  }
};
