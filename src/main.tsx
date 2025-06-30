import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import App from "./App";
import "./index.css";

const ENVIRONMENT_ID = import.meta.env.VITE_DYNAMIC_ENVIRONMENT_ID || "01234567-89ab-cdef-0123-456789abcdef";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <DynamicContextProvider
        settings={{
          environmentId: ENVIRONMENT_ID,
          walletConnectors: [EthereumWalletConnectors],
          // Set Base Sepolia as the default chain
          defaultChainId: 84532,
          // Only allow Base Sepolia
          supportedChains: [
            {
              chainId: 84532,
              name: "Base Sepolia",
              rpcUrl: "https://sepolia.base.org",
              nativeCurrency: {
                name: "Ethereum",
                symbol: "ETH",
                decimals: 18,
              },
              blockExplorerUrl: "https://sepolia-explorer.base.org",
            }
          ],
          // Automatically switch to the correct chain
          autoConnectWallet: false,
          // Show network switching UI
          showNetworkSwitchingUI: true,
        }}
      >
        <App />
      </DynamicContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);