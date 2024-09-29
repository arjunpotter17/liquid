import { NextRequest, NextResponse } from 'next/server';
import { Connection, PublicKey } from "@solana/web3.js";

export async function GET(request: NextRequest) {
    const apiKey = process.env.HELIUS_RPC_KEY;
    const { searchParams } = new URL(request.url);
    const publicKey = searchParams.get('publicKey');

    if (!publicKey) {
      return NextResponse.json({ error: "Need Pubkey" });
    }
  
    // Create a new connection using the API key
    const connection = new Connection(`https://mainnet.helius-rpc.com/?api-key=${apiKey}`);
    const balance = await connection.getBalance(new PublicKey(publicKey));
    
    // Optionally, you can perform some actions with the connection here.
    // For now, just send a success response.
  return NextResponse.json({balance});
}
