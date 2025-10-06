import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { sepolia } from "wagmi/chains";
import { QueryClientProvider } from "@tanstack/react-query";
import { config, queryClient } from "./helpers/client";
import Header from "./components/Header/Header";
import Web3Connect from "./components/Helper/Web3Connect";
import "rsuite/dist/rsuite.min.css";
import Web3Login from "./components/Helper/Web3Login";
import { CustomProvider } from "rsuite";
import ChatBot from "./components/ChatBot/ChatBot";
import { Web3AuthProvider } from "./context/Web3AuthContext";
import { Toaster } from "react-hot-toast";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Agora Blockchain",
  description: "A Web3 Voting Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="icon" href="/aossie.png" sizes="any" />
      <body className={inter.className}>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <Web3AuthProvider>
              <RainbowKitProvider initialChain={sepolia}>
                <CustomProvider>
                  <Header />
                  <ChatBot />
                  {children}
                  <Toaster position="top-right" />
                </CustomProvider>
              </RainbowKitProvider>
            </Web3AuthProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}
