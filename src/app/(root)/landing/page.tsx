"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { PublicKey as umiKey } from "@metaplex-foundation/umi";
import { fetcher } from "@/app/utils/helpers";
import { handleLiquidate } from "@/app/utils/handleLiquidate";
import fetchNFTs from "@/app/utils/fetchNFTs";
import Banner from "@/app/components/Banner/banner";
import About from "@/app/components/About/about";
import Contact from "@/app/components/Contact";
import Process from "@/app/components/Process";

export default function DashboardFeature() {
  // States
  return (
    <div className="flex flex-col scroll-smooth gap-y-10 min-h-screen items-center p-6 bg-transparent pt-[74px] relative overflow-y-auto scrollbar-none">
      <Banner />
      <About />
      <Process />
      <Contact />
    </div>
  );
}
