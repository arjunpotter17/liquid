import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const collId = searchParams.get('collId');

  const response = await fetch(
    `https://api.mainnet.tensordev.io/api/v1/collections/pools?collId=${collId}`,
    {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        "x-tensor-api-key": `${process.env.TENSOR_API_KEY}`,
      },
    }
  );

  const data = await response.json();
  return NextResponse.json(data);
}
