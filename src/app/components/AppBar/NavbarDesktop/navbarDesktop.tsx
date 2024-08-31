"use client";
import React, { useEffect, useState } from "react";
import "@solana/wallet-adapter-react-ui/styles.css";
import dynamic from "next/dynamic";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

// Dynamic import for the WalletMultiButton to avoid SSR issues
const WalletMultiButtonDynamic = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (mod) => mod.WalletMultiButton
    ),
  { ssr: false }
);

const NavbarDesktop = (): JSX.Element => {
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState<string>("Dashboard");
  const router = useRouter();
  const path = usePathname();

  // Prefetch routes to improve page switching speed
  useEffect(() => {
    router.prefetch("/");
    router.prefetch("/trade");
  }, [router]);

  // Set the active navigation item based on the current path
  useEffect(() => {
    const routeMap: Record<string, string> = {
      "/": "Home",
      "/trade": "Trade",
    };
    setActive(routeMap[path] || "Home");
  }, [path]);

  // Ensure the WalletMultiButton is only rendered on the client-side
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="!z-50 w-full justify-between flex items-center absolute py-4 px-10">
      <Link href="/" passHref>
        <p className="text-liquid-blue text-liquid-banner-header-mobile font-liquid-bold z-10 cursor-pointer">
          Liquid.
        </p>
      </Link>
      <div className="flex items-center justify-center gap-x-10 text-liquid-white font-liquid-semibold">
        <Link href="/" passHref>
          <p
            className={`cursor-pointer hover:text-liquid-dark-blue ${
              active === "Home"
                ? "text-liquid-dark-blue"
                : "text-liquid-white"
            }`}
          >
            Home
          </p>
        </Link>
        <Link href="/trade" passHref>
          <p
            className={`cursor-pointer hover:text-liquid-dark-blue ${
              active === "Trade" ? "text-liquid-dark-blue" : "text-liquid-white"
            }`}
          >
            Trade
          </p>
        </Link>
        {mounted && <WalletMultiButtonDynamic />}
      </div>
    </div>
  );
};

export default NavbarDesktop;
