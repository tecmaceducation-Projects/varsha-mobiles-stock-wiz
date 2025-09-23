import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Supplier {
  id: string;
  name: string;
  company: string;
  contact: string;
  email: string;
  address: string;
  addedDate: string;
  totalOrders: number;
  totalValue: number;
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  orderDate: string;
  expectedDate: string;
  status: "pending" | "received" | "cancelled";
  items: Array<{
    brand: string;
    model: string;
    quantity: number;
    unitPrice: number;
  }>;
  totalAmount: number;
}

export interface StockMovement {
  id: string;
  productId: string;
  type: "in" | "out";
  quantity: number;
  date: string;
  reason: string;
  reference?: string;
}

interface SupplierContextType {
  suppliers: Supplier[];
  purchaseOrders: PurchaseOrder[];
  stockMovements: StockMovement[];
  addSupplier: (supplier: Omit<Supplier, "id" | "addedDate" | "totalOrders" | "totalValue">) => void;
  updateSupplier: (id: string, supplier: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;
  addPurchaseOrder: (order: Omit<PurchaseOrder, "id">) => void;
  updatePurchaseOrder: (id: string, order: Partial<PurchaseOrder>) => void;
  addStockMovement: (movement: Omit<StockMovement, "id">) => void;
}

const SupplierContext = createContext<SupplierContextType | undefined>(undefined);

export const useSupplier = () => {
  const context = useContext(SupplierContext);
  if (!context) {
    throw new Error("useSupplier must be used within a SupplierProvider");
  }
  return context;
};

const initialSuppliers: Supplier[] = [
  {
    id: "1",
    name: "Rajesh Kumar",
    company: "Mobile World Distributors",
    contact: "+91 98765 43210",
    email: "rajesh@mobileworld.com",
    address: "123 Electronics Market, Delhi",
    addedDate: "2024-01-15",
    totalOrders: 15,
    totalValue: 2500000
  },
  {
    id: "2",
    name: "Priya Sharma",
    company: "Tech Solutions Inc",
    contact: "+91 87654 32109",
    email: "priya@techsolutions.com",
    address: "456 Business Park, Mumbai",
    addedDate: "2024-02-20",
    totalOrders: 8,
    totalValue: 1200000
  }
];

const initialPurchaseOrders: PurchaseOrder[] = [
  {
    id: "PO001",
    supplierId: "1",
    orderDate: "2024-03-01",
    expectedDate: "2024-03-15",
    status: "pending",
    items: [
      { brand: "Samsung", model: "Galaxy S24", quantity: 10, unitPrice: 80000 },
      { brand: "Apple", model: "iPhone 15", quantity: 5, unitPrice: 80000 }
    ],
    totalAmount: 1200000
  }
];

const initialStockMovements: StockMovement[] = [
  {
    id: "1",
    productId: "1",
    type: "in",
    quantity: 50,
    date: "2024-03-01",
    reason: "New stock arrival",
    reference: "PO001"
  }
];

interface SupplierProviderProps {
  children: ReactNode;
}

export const SupplierProvider = ({ children }: SupplierProviderProps) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(initialPurchaseOrders);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>(initialStockMovements);

  const addSupplier = (supplierData: Omit<Supplier, "id" | "addedDate" | "totalOrders" | "totalValue">) => {
    const newSupplier: Supplier = {
      ...supplierData,
      id: Date.now().toString(),
      addedDate: new Date().toISOString().split('T')[0],
      totalOrders: 0,
      totalValue: 0,
    };
    setSuppliers(prev => [...prev, newSupplier]);
  };

  const updateSupplier = (id: string, updates: Partial<Supplier>) => {
    setSuppliers(prev =>
      prev.map(supplier =>
        supplier.id === id ? { ...supplier, ...updates } : supplier
      )
    );
  };

  const deleteSupplier = (id: string) => {
    setSuppliers(prev => prev.filter(supplier => supplier.id !== id));
  };

  const addPurchaseOrder = (orderData: Omit<PurchaseOrder, "id">) => {
    const newOrder: PurchaseOrder = {
      ...orderData,
      id: `PO${Date.now().toString().slice(-3)}`,
    };
    setPurchaseOrders(prev => [...prev, newOrder]);
  };

  const updatePurchaseOrder = (id: string, updates: Partial<PurchaseOrder>) => {
    setPurchaseOrders(prev =>
      prev.map(order =>
        order.id === id ? { ...order, ...updates } : order
      )
    );
  };

  const addStockMovement = (movementData: Omit<StockMovement, "id">) => {
    const newMovement: StockMovement = {
      ...movementData,
      id: Date.now().toString(),
    };
    setStockMovements(prev => [...prev, newMovement]);
  };

  const value: SupplierContextType = {
    suppliers,
    purchaseOrders,
    stockMovements,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    addPurchaseOrder,
    updatePurchaseOrder,
    addStockMovement,
  };

  return (
    <SupplierContext.Provider value={value}>
      {children}
    </SupplierContext.Provider>
  );
};