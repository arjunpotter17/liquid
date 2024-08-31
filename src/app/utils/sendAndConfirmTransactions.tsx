import { Connection, Transaction, VersionedTransaction, RpcResponseAndContext, SignatureResult } from "@solana/web3.js";

// Function to send and confirm transactions
export const sendAndConfirmTransactions = async (
  txsToSign: (VersionedTransaction | Transaction)[],
  connection: Connection
): Promise<RpcResponseAndContext<SignatureResult>[]> => {
  try {
    // Step 1: Obtain the latest blockhash
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

    // Step 2: Send all transactions and collect their signatures
    const transactionSignatures = await Promise.all(
      txsToSign.map(async (tx) => {
        // Send the raw transaction and return the signature
        const signature = await connection.sendRawTransaction(tx.serialize());
        return signature;
      })
    );
    console.log("Transactions sent with signatures:", transactionSignatures);
    // Step 3: Confirm each transaction using its signature
    const confirmations: RpcResponseAndContext<SignatureResult>[] = await Promise.all(
      transactionSignatures.map(async (signature) => {
        const confirmation = await connection.confirmTransaction({
          blockhash,
          lastValidBlockHeight,
          signature,
        });

        console.log(`Transaction ${signature} confirmed with status:`, confirmation);

        return confirmation;
      })
    );

    // Return the confirmation statuses
    return confirmations;
  } catch (error) {
    console.error("Failed to send or confirm transactions", error);
    throw error; // Rethrow the error to let the caller handle it
  }
};

