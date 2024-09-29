import {
  WalletContextState,
} from "@solana/wallet-adapter-react";
import {
  Transaction,
  VersionedTransaction,
  TransactionConfirmationStrategy,
  Connection
} from "@solana/web3.js";
import { liquidate } from "./liquidate";
import { checkWalletBalance, swapTransaction } from "./helpers";
import { toast } from "sonner";

export const handleLiquidate = async (
  mint: string,
  wallet: WalletContextState,
  swapData: any,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setShowWarning: React.Dispatch<React.SetStateAction<boolean>>, 
  connection: Connection
): Promise<string[] | Error> => {
  if (!wallet.signAllTransactions || !wallet.publicKey) {
    console.error("Wallet does not support signing transactions");
    toast("Wallet does not support signing transactions");
    return Error("Wallet does not support signing transactions");
  }

  try {
    // Step 1: Fetch liquidation transaction from Tensor and swap transaction from Jupiter
    const data = await liquidate(mint, connection); // tensor transaction
    let swapTransactionBuf: Buffer = Buffer.alloc(0);
    if (swapData) {
      swapTransactionBuf = await swapTransaction(
        swapData,
        wallet.publicKey.toBase58()
      ); // jupiter transaction for quote
    }

    console.log("Step 1 done");

    const txsToSign: (VersionedTransaction | Transaction)[] =
      data?.data.txs.map((tx: any) =>
        tx.txV0
          ? VersionedTransaction.deserialize(tx.txV0.data)
          : Transaction.from(tx.tx.data)
      );

    const blockhash = (await connection.getLatestBlockhash()).blockhash;

    // Add blockhash to transactions
    txsToSign.forEach((tx) => {
      if (tx instanceof VersionedTransaction) {
        tx.message.recentBlockhash = blockhash;
      } else if (tx instanceof Transaction) {
        tx.recentBlockhash = blockhash;
      }
    });

    let deserializedSwap: VersionedTransaction | null = null;
    if (swapData) {
      deserializedSwap = VersionedTransaction.deserialize(swapTransactionBuf);
      deserializedSwap.message.recentBlockhash = blockhash;
    }

    console.log("Assigned blockhashes to all transactions");

    // Step 2: Sign transactions
    let signedTxs: (VersionedTransaction | Transaction)[] = [];
    if (swapData && deserializedSwap) {
      signedTxs = await wallet.signAllTransactions([
        ...txsToSign,
        deserializedSwap,
      ]);
    } else {
      signedTxs = await wallet.signAllTransactions([...txsToSign]);
    }

    setLoading(true);
    setShowWarning(false);

    console.log("Signed all transactions");

    const sign = await connection.sendRawTransaction(signedTxs[0].serialize(), {
      skipPreflight: false,
      preflightCommitment: "processed",
    });

    console.log("Sent first transaction");

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

    console.log("Confirmed first transaction");

    if (confirmation.value.err) {
      console.error("Sell Transaction failed", confirmation.value.err);
      toast.error("Could not sell NFT. No funds have been deducted.");
      return Error("Sell Transaction failed");
    } else {
      toast.success("NFT sold successfully.");
      if (!swapData) return [sign];

      const loadingToast = toast.loading("Waiting for funds to hit wallet");
      const res = await checkWalletBalance(
        wallet?.publicKey,
        swapData?.inAmount
      );
      if (!res) {
        toast.dismiss(loadingToast);
        toast.error("Funds took too long to hit wallet. Aborting swap.");
        return [sign];
      } else {
        toast.dismiss(loadingToast);
        toast.success("Funds reached wallet.");
      }

      // Step 3: Initiate swap transaction wrapped in try-catch
      const swapLoadingToast = toast.loading("Initiating swap transaction");
      try {
        const swap = await connection.sendRawTransaction(
          signedTxs[1].serialize(),
          {
            skipPreflight: false,
            preflightCommitment: "processed",
          }
        );

        console.log("swap tx", swap);

        const latestBlockhash = await connection.getLatestBlockhash();

        const confirmationStrategy: TransactionConfirmationStrategy = {
          signature: swap,
          blockhash: latestBlockhash.blockhash,
          lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        };

        const swapConfirmation = await connection.confirmTransaction(
          confirmationStrategy,
          "processed"
        );

        toast.dismiss(swapLoadingToast);
        if (swapConfirmation.value.err) {
          console.error("Swap Transaction failed", swapConfirmation.value.err);
          toast.error(
            "Swap Transaction failed. Expected amount in Sol should be in your wallet."
          );
          return [sign];
        } else {
          console.log("Swap Transaction successful");
          toast.success("Swap Transaction successful");
          return [sign, swap];
        }
      } catch (swapError) {
        console.error("Failed to execute swap", swapError);
        toast.dismiss(swapLoadingToast);
        toast.error(
          "Swap transaction failed. Expected amount in Sol should still be in your wallet."
        );
        return [sign];
      }
    }
  } catch (error: any) {
    console.error("Failed to liquidate", error);
    toast.error(
      "Failed to liquidate. Please ensure you have enough SOL for gas. Contact support if the problem persists."
    );
    return Error("Process failed.");
  }
};
