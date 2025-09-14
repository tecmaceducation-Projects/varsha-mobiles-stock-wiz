import React, { createContext, useContext, useState, ReactNode } from "react";
import { MobilePhone, initialMobileData } from "@/data/mobileData";

interface InventoryContextType {
  mobileData: MobilePhone[];
  addMobile: (mobile: Omit<MobilePhone, "id">) => void;
  updateMobile: (id: string, mobile: Partial<MobilePhone>) => void;
  deleteMobile: (id: string) => void;
  getMobileById: (id: string) => MobilePhone | undefined;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }
  return context;
};

interface InventoryProviderProps {
  children: ReactNode;
}

export const InventoryProvider = ({ children }: InventoryProviderProps) => {
  const [mobileData, setMobileData] = useState<MobilePhone[]>(initialMobileData);

  const addMobile = (mobile: Omit<MobilePhone, "id">) => {
    const newMobile: MobilePhone = {
      ...mobile,
      id: Date.now().toString(),
      addedDate: new Date().toISOString().split('T')[0],
    };
    setMobileData(prev => [...prev, newMobile]);
  };

  const updateMobile = (id: string, updates: Partial<MobilePhone>) => {
    setMobileData(prev =>
      prev.map(mobile =>
        mobile.id === id ? { ...mobile, ...updates } : mobile
      )
    );
  };

  const deleteMobile = (id: string) => {
    setMobileData(prev => prev.filter(mobile => mobile.id !== id));
  };

  const getMobileById = (id: string) => {
    return mobileData.find(mobile => mobile.id === id);
  };

  const value: InventoryContextType = {
    mobileData,
    addMobile,
    updateMobile,
    deleteMobile,
    getMobileById,
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};