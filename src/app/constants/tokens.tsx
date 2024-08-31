import { TokenInfo } from "../interfaces";

export const stables : TokenInfo[] = [
    {
        "address": "So11111111111111111111111111111111111111112",
        "name": "Wrapped SOL",
        "symbol": "SOL",
        "decimals": 9,
        "logoURI": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
        "tags": [
            "verified",
            "community",
            "strict"
        ],
        "daily_volume": 102220274.17578155
    }, 
    {
        "address": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        "name": "USD Coin",
        "symbol": "USDC",
        "decimals": 6,
        "logoURI": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
        "tags": [
            "verified",
            "community",
            "strict"
        ],
        "daily_volume": 115928961.26354745
    },
    {
        "address": "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
        "name": "USDT",
        "symbol": "USDT",
        "decimals": 6,
        "logoURI": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.svg",
        "tags": [
            "verified",
            "community",
            "strict"
        ],
        "daily_volume": 18978340.95274418
    },
]

export const containerVariants = {
    hidden: { opacity: 0 },
    visible: (i: number) => ({
      opacity: 1,
      transition: {
        delay: i * 0.1,
      },
    }),
  };