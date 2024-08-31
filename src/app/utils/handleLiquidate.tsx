import { WalletContextState } from "@solana/wallet-adapter-react";
import {
  Transaction,
  VersionedTransaction,
  TransactionConfirmationStrategy,
} from "@solana/web3.js";
import { liquidate } from "./liquidate";
import { getConnection, sleep, swapTransaction } from "./helpers";
import { toast } from "sonner";

export const handleLiquidate = async (
  mint: string,
  wallet: WalletContextState,
  swapData: any,
  noSwap?: boolean
) => {
  if (!wallet.signAllTransactions || !wallet.publicKey) {
    console.error("Wallet does not support signing transactions");
    toast("Wallet does not support signing transactions");
    return;
  }

  try {
    const connection = getConnection();

    // Step 1: Fetch liquidation transaction from Tensor and swap transaction from Jupiter

    const data = await liquidate(mint); //tensor transaction

    const swapTransactionBuf = await swapTransaction(
      swapData,
      wallet.publicKey.toBase58()
    ); //jupiter transaction for quote

    const txsToSign: (VersionedTransaction | Transaction)[] =
      data?.data.txs.map((tx: any) =>
        tx.txV0
          ? VersionedTransaction.deserialize(tx.txV0.data)
          : Transaction.from(tx.tx.data)
      );

    const blockhash = (await connection.getLatestBlockhash()).blockhash;

    //add blockhash to transactions
    txsToSign.forEach((tx) => {
      if (tx instanceof VersionedTransaction) {
        tx.message.recentBlockhash = blockhash;
      } else if (tx instanceof Transaction) {
        tx.recentBlockhash = blockhash;
      }
    });
    const deserializedSwap =
      VersionedTransaction.deserialize(swapTransactionBuf);
    deserializedSwap.message.recentBlockhash = blockhash;

    // Step 2: Sign transactions
    const signedTxs = await wallet.signAllTransactions([
      ...txsToSign,
      deserializedSwap,
    ]);

    const sign = await connection.sendRawTransaction(signedTxs[0].serialize(), {
      skipPreflight: false,
      preflightCommitment: "processed",
    });

    const latestBlockhash = await connection.getLatestBlockhash();

    const confirmationStrategy: TransactionConfirmationStrategy = {
      signature: sign,
      blockhash: latestBlockhash.blockhash,
      lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
    };

    const confirmation = await connection.confirmTransaction(
      confirmationStrategy,
      "processed"
    );

    if (confirmation.value.err) {
      console.error("Sell Transaction failed", confirmation.value.err);
      toast("Sell Transaction failed");
      return;
    } else {
      toast("Sell Transaction successful");
      if (noSwap) return;
      const balance = await connection.getBalance(wallet.publicKey);
      if (balance < swapData.inAmount) {
        sleep(10000);
      }
      //even tho we are awaiting the confirmation, it takes a while for the money to hit the wallet
      const reBalance = await connection.getBalance(wallet.publicKey);
      const sig = await connection.sendRawTransaction(
        signedTxs[1].serialize(),
        {
          skipPreflight: false,
          preflightCommitment: "processed",
        }
      );

      const latestBlockhash = await connection.getLatestBlockhash();

      const confirmationStrategy: TransactionConfirmationStrategy = {
        signature: sig,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      };

      const confirmation = await connection.confirmTransaction(
        confirmationStrategy,
        "processed"
      );

      if (confirmation.value.err) {
        console.error("Swap Transaction failed", confirmation.value.err);
        toast("Swap Transaction failed. Expected Sol is in your wallet");
        return;
      } else {
        console.log("Swap Transaction successful", sig);
        toast("Swap Transaction successful");
      }
    }
  } catch (error) {
    console.error("Failed to liquidate", error);
  }
};
