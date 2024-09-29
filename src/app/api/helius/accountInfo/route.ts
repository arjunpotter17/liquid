import { NextRequest, NextResponse } from 'next/server';
import { Connection, PublicKey } from "@solana/web3.js";

export async function GET(request: NextRequest) {
    const apiKey = process.env.HELIUS_RPC_KEY;
    const { searchParams } = new URL(request.url);
    const publicKey = searchParams.get('address');

    if (!publicKey) {
      return NextResponse.json({ error: "Need Pubkey" });
    }

    const connection = new Connection(`https://mainnet.helius-rpc.com/?api-key=${apiKey}`);
    const mintInfo = await connection.getParsedAccountInfo(new PublicKey(publicKey));

  return NextResponse.json({mintInfo});
}
