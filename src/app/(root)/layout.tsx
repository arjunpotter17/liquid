"use client";
import "../globals.css";
import React, { useMemo } from "react";
import { clusterApiUrl } from "@solana/web3.js";
import {
  WalletProvider,
  ConnectionProvider,
} from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import Navbar from "../components/AppBar/appbar";
import { PopupProvider } from "../hooks/use-popup";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const endpoint = clusterApiUrl("mainnet-beta");
  const wallets = useMemo(() => [], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <PopupProvider>
            <Toaster richColors/>
            <div className="relative !overflow-y-auto scroll-smooth scrollbar-thin scrollbar-track-liquid-black scrollbar-thumb-liquid-popup-bg bg-liquid-black ">
              <Navbar />
              {children}
            </div>
          </PopupProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
