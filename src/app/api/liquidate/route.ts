import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const seller = searchParams.get('seller');
  const mint = searchParams.get('mint');
  const minPrice = searchParams.get('minPrice');
  const blockhash = searchParams.get('blockhash');
  const bidAddress = searchParams.get('bidAddress');

  console.log('Liquidating:', seller, mint, minPrice, blockhash, bidAddress);

  const response = await fetch(
    `https://api.mainnet.tensordev.io/api/v1/tx/sell?seller=${seller}&mint=${mint}&minPrice=${minPrice}&blockhash=${blockhash}&bidAddress=${bidAddress}`,
    {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'x-tensor-api-key': '9c07798b-392c-4206-839e-5b3c9f6d2735',
      },
    }
  );

  const data = await response.json();
  return NextResponse.json(data);
}
