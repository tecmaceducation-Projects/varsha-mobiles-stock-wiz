import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Plus,
  Package2,
  Menu,
  X,
  Smartphone,
  BarChart3,
  LogOut,
  Users,
  ShoppingCart,
  TrendingUp,
  Package,
  FileBarChart,
  PieChart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useSupplier } from "@/contexts/SupplierContext";
import { useInventory } from "@/contexts/InventoryContext";

interface SidebarProps {
  onLogout: () => void;
}

const Sidebar = ({ onLogout }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { purchaseOrders } = useSupplier();
  const { mobileData } = useInventory();

  // Calculate dynamic counts
  const pendingOrdersCount = purchaseOrders.filter(po => po.status === "pending").length;
  const totalInventoryCount = mobileData.length;

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, badge: null },
    { name: "Add Stock", href: "/add-stock", icon: Plus, badge: null },
    { name: "View Inventory", href: "/inventory", icon: Package2, badge: totalInventoryCount.toString() },
    { name: "Suppliers", href: "/suppliers", icon: Users, badge: null },
    { name: "Purchase Orders", href: "/purchase-orders", icon: ShoppingCart, badge: pendingOrdersCount > 0 ? pendingOrdersCount.toString() : null },
    { name: "Stock Tracking", href: "/stock-tracking", icon: Package, badge: null },
  ];

  const secondaryNav = [
    { name: "Reports", href: "/reports", icon: FileBarChart, badge: null },
    { name: "Analytics", href: "/analytics", icon: PieChart, badge: "New" },
    { name: "Valuation", href: "/valuation", icon: TrendingUp, badge: null },
  ];

  const getNavClass = (href: string) => {
    const isActive = location.pathname === href;
    return `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
      isActive
        ? "bg-primary text-primary-foreground shadow-soft"
        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
    }`;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      <div
        className={`fixed left-0 top-0 z-50 h-full bg-card border-r transition-all duration-300 shadow-card ${
          isCollapsed ? "w-16" : "w-72"
        } lg:relative lg:z-auto`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <Smartphone className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-semibold text-lg">Varsha Mobiles</h2>
                <p className="text-xs text-muted-foreground">Inventory System</p>
              </div>
            </div>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="lg:hidden"
          >
            {isCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex flex-col h-full p-4 overflow-y-auto">
          <nav className="space-y-2 flex-1">
            {navigation.map((item) => (
              <NavLink key={item.name} to={item.href} className={getNavClass(item.href)}>
                <item.icon className={`w-5 h-5 ${isCollapsed ? 'mx-auto' : ''}`} />
                {!isCollapsed && (
                  <>
                    <span className="flex-1">{item.name}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </NavLink>
            ))}

            <Separator className="my-4" />

            {secondaryNav.map((item) => (
              <NavLink key={item.name} to={item.href} className={getNavClass(item.href)}>
                <item.icon className={`w-5 h-5 ${isCollapsed ? 'mx-auto' : ''}`} />
                {!isCollapsed && <span className="flex-1">{item.name}</span>}
              </NavLink>
            ))}
          </nav>

          {/* Logout */}
          <div className="pt-4 border-t">
            <Button
              onClick={onLogout}
              variant="ghost"
              className={`w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 ${
                isCollapsed ? 'px-2' : ''
              }`}
            >
              <LogOut className={`w-5 h-5 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
              {!isCollapsed && "Logout"}
            </Button>
          </div>

          {/* User Info */}
          {!isCollapsed && (
            <div className="mt-4 p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                  <span className="text-xs font-semibold text-primary-foreground">A</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">Admin</p>
                  <p className="text-xs text-muted-foreground">System Administrator</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;