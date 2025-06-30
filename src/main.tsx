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
        }}
      >
        <App />
      </DynamicContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);