import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mint = searchParams.get("mint");

  const response = await fetch(
    `https://api.mainnet.tensordev.io/api/v1/mint?mints=${mint}`,
    {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-tensor-api-key": `${process.env.NEXT_PUBLIC_TENSOR_API_KEY}`,
      },
    }
  );

  const data = await response.json();
  return NextResponse.json(data);
}
