import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "./components/Layout";
import "./index.css";
import { CreatePage } from "./pages/CreatePage";
import { CreationsPage } from "./pages/CreationsPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ExplorePage } from "./pages/ExplorePage";
import { HistoryPage } from "./pages/HistoryPage";
import { ModelsPage } from "./pages/ModelsPage";
import { ProvidersPage } from "./pages/ProvidersPage";
import { SettingsPage } from "./pages/SettingsPage";
import { WalletPage } from "./pages/WalletPage";

const queryClient = new QueryClient();
const basename = (import.meta.env.BASE_URL ?? "/").replace(/\/$/, "") || "/";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <CreatePage /> },
        { path: "explore", element: <ExplorePage /> },
        { path: "models", element: <ModelsPage /> },
        { path: "providers", element: <ProvidersPage /> },
        { path: "creations", element: <CreationsPage /> },
        { path: "history", element: <HistoryPage /> },
        { path: "dashboard", element: <DashboardPage /> },
        { path: "wallet", element: <WalletPage /> },
        { path: "settings", element: <SettingsPage /> }
      ]
    }
  ],
  { basename }
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
