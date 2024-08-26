import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // Parse the request body as JSON
  const body = await request.json();
  const response = await fetch(`https://tokyo.mainnet.block-engine.jito.wtf/api/v1/bundles`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'sendBundle',
        params: [body?.bundles],
      }),
  });

  const data = await response.json();
  console.log('this is data                  ',data);
  return NextResponse.json(data);
}