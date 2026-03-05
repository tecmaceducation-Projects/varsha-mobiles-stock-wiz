import { createContext, useContext, useState, ReactNode } from "react";

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  department: string;
  joinDate: string;
  status: "active" | "inactive";
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string; // staff id
  dueDate: string;
  status: "pending" | "in-progress" | "completed" | "overdue";
  priority: "low" | "medium" | "high";
  createdDate: string;
}

interface StaffContextType {
  staff: StaffMember[];
  tasks: Task[];
  addStaff: (s: Omit<StaffMember, "id">) => void;
  updateStaff: (id: string, s: Partial<StaffMember>) => void;
  deleteStaff: (id: string) => void;
  addTask: (t: Omit<Task, "id" | "createdDate">) => void;
  updateTask: (id: string, t: Partial<Task>) => void;
  deleteTask: (id: string) => void;
}

const StaffContext = createContext<StaffContextType | undefined>(undefined);

export const useStaff = () => {
  const ctx = useContext(StaffContext);
  if (!ctx) throw new Error("useStaff must be used within StaffProvider");
  return ctx;
};

const initialStaff: StaffMember[] = [
  { id: "s1", name: "Rajesh Kumar", role: "Store Manager", email: "rajesh@varshamobiles.com", phone: "9876543210", department: "Management", joinDate: "2022-01-15", status: "active" },
  { id: "s2", name: "Priya Sharma", role: "Sales Executive", email: "priya@varshamobiles.com", phone: "9876543211", department: "Sales", joinDate: "2022-06-01", status: "active" },
  { id: "s3", name: "Arun Patel", role: "Inventory Clerk", email: "arun@varshamobiles.com", phone: "9876543212", department: "Inventory", joinDate: "2023-03-10", status: "active" },
  { id: "s4", name: "Deepa Nair", role: "Billing Executive", email: "deepa@varshamobiles.com", phone: "9876543213", department: "Billing", joinDate: "2023-08-20", status: "active" },
];

const initialTasks: Task[] = [
  { id: "t1", title: "Verify Samsung stock count", description: "Physical count verification for Samsung models", assignedTo: "s3", dueDate: "2026-03-06", status: "pending", priority: "high", createdDate: "2026-03-05" },
  { id: "t2", title: "Follow up with Apple India", description: "Check iPhone 15 delivery status", assignedTo: "s1", dueDate: "2026-03-07", status: "in-progress", priority: "medium", createdDate: "2026-03-04" },
  { id: "t3", title: "Update price tags", description: "Update display price tags for all Xiaomi models", assignedTo: "s2", dueDate: "2026-03-05", status: "completed", priority: "low", createdDate: "2026-03-03" },
  { id: "t4", title: "Process new purchase order", description: "Create PO for OnePlus Nord restocking", assignedTo: "s4", dueDate: "2026-03-08", status: "pending", priority: "high", createdDate: "2026-03-05" },
];

export const StaffProvider = ({ children }: { children: ReactNode }) => {
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const addStaff = (s: Omit<StaffMember, "id">) => {
    setStaff(prev => [...prev, { ...s, id: `s${Date.now()}` }]);
  };

  const updateStaff = (id: string, s: Partial<StaffMember>) => {
    setStaff(prev => prev.map(m => m.id === id ? { ...m, ...s } : m));
  };

  const deleteStaff = (id: string) => {
    setStaff(prev => prev.filter(m => m.id !== id));
  };

  const addTask = (t: Omit<Task, "id" | "createdDate">) => {
    setTasks(prev => [...prev, { ...t, id: `t${Date.now()}`, createdDate: new Date().toISOString().split("T")[0] }]);
  };

  const updateTask = (id: string, t: Partial<Task>) => {
    setTasks(prev => prev.map(task => task.id === id ? { ...task, ...t } : task));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return (
    <StaffContext.Provider value={{ staff, tasks, addStaff, updateStaff, deleteStaff, addTask, updateTask, deleteTask }}>
      {children}
    </StaffContext.Provider>
  );
};
