import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { InventoryProvider } from "@/contexts/InventoryContext";
import { SupplierProvider } from "@/contexts/SupplierContext";
import Login from "@/components/Login";
import Layout from "@/components/Layout";
import Dashboard from "@/components/Dashboard";
import AddStock from "@/components/AddStock";
import UpdateStock from "@/components/UpdateStock";
import Inventory from "@/components/Inventory";
import SupplierManagement from "@/components/SupplierManagement";
import PurchaseOrders from "@/components/PurchaseOrders";
import StockTracking from "@/components/StockTracking";
import Reports from "@/components/Reports";
import Analytics from "@/components/Analytics";
import Valuation from "@/components/Valuation";
import { useInventory } from "@/contexts/InventoryContext";

const queryClient = new QueryClient();

const DashboardWithData = () => {
  const { mobileData } = useInventory();
  return <Dashboard mobileData={mobileData} />;
};

const AppContent = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Layout onLogout={handleLogout}>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardWithData />} />
        <Route path="/add-stock" element={<AddStock />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/update-stock/:id" element={<UpdateStock />} />
        <Route path="/suppliers" element={<SupplierManagement />} />
        <Route path="/purchase-orders" element={<PurchaseOrders />} />
        <Route path="/stock-tracking" element={<StockTracking />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/valuation" element={<Valuation />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <InventoryProvider>
          <SupplierProvider>
            <AppContent />
          </SupplierProvider>
        </InventoryProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
