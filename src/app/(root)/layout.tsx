import "../globals.css";
import React from "react";
import Navbar from "../components/AppBar/appbar";
import { Toaster } from "sonner";
import { SolanaProvider } from "../components/SolanaProviders/provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const endpoint = `https://mainnet.helius-rpc.com/?api-key=${process.env.HELIUS_RPC_KEY}`;

  return (
    <SolanaProvider endpoint={endpoint}>
      <Toaster richColors expand pauseWhenPageIsHidden />

      <div className="relative !overflow-y-auto scroll-smooth scrollbar-thin scrollbar-track-liquid-black scrollbar-thumb-liquid-popup-bg bg-liquid-black ">
        <Navbar />
        {children}
      </div>
    </SolanaProvider>
  );
}
