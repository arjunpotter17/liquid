import { WalletContextState } from "@solana/wallet-adapter-react";
import {
  Transaction,
  VersionedTransaction,
  TransactionConfirmationStrategy,
} from "@solana/web3.js";
import { liquidate } from "./liquidate";
import {
  checkWalletBalance,
  getConnection,
  sleep,
  swapTransaction,
} from "./helpers";
import { toast } from "sonner";

export const handleLiquidate = async (
  mint: string,
  wallet: WalletContextState,
  swapData: any,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setShowWarning: React.Dispatch<React.SetStateAction<boolean>>
): Promise<string[] | null> => {
  if (!wallet.signAllTransactions || !wallet.publicKey) {
    console.error("Wallet does not support signing transactions");
    toast("Wallet does not support signing transactions");
    return null;
  }

  try {
    const connection = getConnection();

    // Step 1: Fetch liquidation transaction from Tensor and swap transaction from Jupiter

    const data = await liquidate(mint); //tensor transaction
    let swapTransactionBuf: Buffer = Buffer.alloc(0);
    if (swapData) {
      swapTransactionBuf = await swapTransaction(
        swapData,
        wallet.publicKey.toBase58()
      ); //jupiter transaction for quote
    }

    console.log("step 1 done");

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

    let deserializedSwap: VersionedTransaction | null = null;
    if (swapData) {
      deserializedSwap = VersionedTransaction.deserialize(swapTransactionBuf);
      deserializedSwap.message.recentBlockhash = blockhash;
    }

    console.log("assigned blockhashes to all transactions");

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

    console.log("signed all transactions");

    const sign = await connection.sendRawTransaction(signedTxs[0].serialize(), {
      skipPreflight: false,
      preflightCommitment: "processed",
    });

    console.log("sent first transaction");

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

    console.log("confirmed first transaction");

    if (confirmation.value.err) {
      console.error("Sell Transaction failed", confirmation.value.err);
      toast.error("Sell Transaction failed");
      return null;
    } else {
      toast.success("Sell Transaction successful");
      if (!swapData) return [sign];
      const res = await checkWalletBalance(
        wallet?.publicKey,
        swapData?.inAmount
      );
      if (res === false) {
        toast.error("Funds took to long to hit wallet. Aborting swap.");
        return [sign];
      } else {
        toast.success("Funds reached wallet. Swap initiated");
      }
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
        toast.error(
          "Swap Transaction failed. Expected amount in Sol should be in your wallet."
        );
        return null;
      } else {
        console.log("Swap Transaction successful");
        toast.success("Swap Transaction successful");
        return [sign, sig];
      }
    }
  } catch (error) {
    console.error("Failed to liquidate", error);
    toast.error(
      "Failed to liquidate. Please ensure you have enough sol for gas. Contact if the problem still persists."
    );
    return null;
  }
};
