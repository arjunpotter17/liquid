export const swapFunds = async (price: number, token: string, slip:number) => {
  const quoteResponse = await (
    await fetch(
      `https://quote-api.jup.ag/v6/quote?inputMint=So11111111111111111111111111111111111111112\
&outputMint=${token}\
&amount=${price}\
&slippageBps=${slip}`
    )
  ).json();
  return quoteResponse;
};
