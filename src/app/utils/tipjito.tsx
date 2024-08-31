import {
  PublicKey,
  Connection,
  SystemProgram,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";

export const tipjito = async (
  fromPubkey: PublicKey,
  connection: Connection
) => {
  const transferInstruction = SystemProgram.transfer({
    fromPubkey,
    toPubkey: new PublicKey("HFqU5x63VTqvQss8hp11i4wVV8bD44PvwucfZ2bU7gRe"),
    lamports: 40000, // Amount to send in lamports (1 SOL = 1,000,000,000 lamports)
  });

  // Fetch the recent blockhash and fee payer for the transaction
  const { blockhash } = await connection.getLatestBlockhash("finalized");

  // Construct a transaction message for v0
  const messageV0 = new TransactionMessage({
    payerKey: fromPubkey,
    recentBlockhash: blockhash,
    instructions: [transferInstruction],
  }).compileToV0Message();

  // Create a versioned transaction
  const transaction = new VersionedTransaction(messageV0);
  return transaction;
};
