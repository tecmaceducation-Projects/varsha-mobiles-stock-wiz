import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { InventoryProvider } from "@/contexts/InventoryContext";
import Login from "@/components/Login";
import Layout from "@/components/Layout";
import Dashboard from "@/components/Dashboard";
import AddStock from "@/components/AddStock";
import UpdateStock from "@/components/UpdateStock";
import Inventory from "@/components/Inventory";
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
        <Route path="/reports" element={<div className="p-6"><h1 className="text-2xl font-bold">Reports</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
        <Route path="/settings" element={<div className="p-6"><h1 className="text-2xl font-bold">Settings</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
        <Route path="/support" element={<div className="p-6"><h1 className="text-2xl font-bold">Support</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
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
          <AppContent />
        </InventoryProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
