import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const seller = searchParams.get('seller');
  const mint = searchParams.get('mint');
  const minPrice = searchParams.get('minPrice');
  const blockhash = searchParams.get('blockhash');
  const bidAddress = searchParams.get('bidAddress');

  const response = await fetch(
    `https://api.mainnet.tensordev.io/api/v1/tx/sell?seller=${seller}&mint=${mint}&minPrice=${minPrice}&blockhash=${blockhash}&bidAddress=${bidAddress}`,
    {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        "x-tensor-api-key": `${process.env.NEXT_PUBLIC_TENSOR_API_KEY}`,
      },
    }
  );

  const data = await response.json();
  return NextResponse.json(data);
}
