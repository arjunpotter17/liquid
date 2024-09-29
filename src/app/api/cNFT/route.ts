import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const publicKey = searchParams.get("publicKey");
    const HELIUS_API_KEY = process.env.HELIUS_RPC_KEY;
    if (!publicKey) {
        return NextResponse.json({ error: "Public key is required" }, { status: 400 });
    }

    try {
        const response = await fetch(`https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: '1',
                method: 'getAssetsByOwner',
                params: {
                    ownerAddress: publicKey,
                    page: 1, // Starts at 1
                    limit: 1000,
                },
            }),
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch assets: ${response.statusText}`);
        }

        const result = await response.json();

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error fetching cNFTs:", error);
        return NextResponse.json({ error: "Failed to fetch cNFTs" }, { status: 500 });
    }
}
