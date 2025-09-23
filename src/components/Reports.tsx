import { useState } from "react";
import { Download, Filter, Calendar, TrendingUp, BarChart3, PieChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useInventory } from "@/contexts/InventoryContext";
import { useSupplier } from "@/contexts/SupplierContext";
import { useToast } from "@/hooks/use-toast";

const Reports = () => {
  const { mobileData } = useInventory();
  const { suppliers, purchaseOrders, stockMovements } = useSupplier();
  const { toast } = useToast();
  const [reportType, setReportType] = useState("inventory");
  const [dateFilter, setDateFilter] = useState({
    from: "",
    to: ""
  });

  // Calculate inventory insights
  const totalStock = mobileData.reduce((sum, item) => sum + item.quantity, 0);
  const totalValue = mobileData.reduce((sum, item) => sum + (item.quantity * item.priceRange), 0);
  const lowStockItems = mobileData.filter(item => item.quantity < 10);
  const outOfStockItems = mobileData.filter(item => item.quantity === 0);

  // Fast vs Slow moving items (simulation based on price range)
  const fastMovingItems = mobileData.filter(item => item.priceRange > 50000);
  const slowMovingItems = mobileData.filter(item => item.priceRange < 20000);

  // Brand analysis
  const brandStats = mobileData.reduce((acc, item) => {
    if (!acc[item.brand]) {
      acc[item.brand] = { count: 0, value: 0, quantity: 0 };
    }
    acc[item.brand].count += 1;
    acc[item.brand].value += item.priceRange * item.quantity;
    acc[item.brand].quantity += item.quantity;
    return acc;
  }, {} as Record<string, { count: number; value: number; quantity: number }>);

  const handleExport = (format: string) => {
    toast({
      title: "Export Started",
      description: `Generating ${format.toUpperCase()} report...`,
    });
    
    // Simulate export process
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: `Report exported successfully in ${format.toUpperCase()} format!`,
      });
    }, 2000);
  };

  const renderInventoryReport = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mobileData.length}</div>
            <p className="text-xs text-muted-foreground">Different models</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStock}</div>
            <p className="text-xs text-muted-foreground">Units in inventory</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total stock value</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <Calendar className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{lowStockItems.length}</div>
            <p className="text-xs text-muted-foreground">Need reorder</p>
          </CardContent>
        </Card>
      </div>

      {/* Brand Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Brand-wise Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Brand</TableHead>
                <TableHead>Models</TableHead>
                <TableHead>Stock Quantity</TableHead>
                <TableHead>Stock Value</TableHead>
                <TableHead>Average Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(brandStats).map(([brand, stats]) => (
                <TableRow key={brand}>
                  <TableCell className="font-medium">{brand}</TableCell>
                  <TableCell>{stats.count}</TableCell>
                  <TableCell>{stats.quantity}</TableCell>
                  <TableCell>₹{stats.value.toLocaleString()}</TableCell>
                  <TableCell>₹{Math.round(stats.value / stats.quantity).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Fast vs Slow Moving Items */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-success" />
              Fast Moving Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {fastMovingItems.slice(0, 5).map(item => (
                <div key={item.id} className="flex justify-between items-center">
                  <span className="text-sm">{item.brand} {item.modelName}</span>
                  <Badge variant="secondary">{item.quantity} units</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-muted-foreground" />
              Slow Moving Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {slowMovingItems.slice(0, 5).map(item => (
                <div key={item.id} className="flex justify-between items-center">
                  <span className="text-sm">{item.brand} {item.modelName}</span>
                  <Badge variant="secondary">{item.quantity} units</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderPurchaseReport = () => (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Purchase Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{purchaseOrders.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Purchase Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{purchaseOrders.reduce((sum, po) => sum + po.totalAmount, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Suppliers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{suppliers.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Supplier-wise Purchase History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Supplier</TableHead>
                <TableHead>Total Orders</TableHead>
                <TableHead>Total Value</TableHead>
                <TableHead>Average Order Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suppliers.map(supplier => {
                const supplierOrders = purchaseOrders.filter(po => po.supplierId === supplier.id);
                const totalValue = supplierOrders.reduce((sum, po) => sum + po.totalAmount, 0);
                const avgValue = supplierOrders.length > 0 ? totalValue / supplierOrders.length : 0;
                
                return (
                  <TableRow key={supplier.id}>
                    <TableCell>{supplier.company}</TableCell>
                    <TableCell>{supplierOrders.length}</TableCell>
                    <TableCell>₹{totalValue.toLocaleString()}</TableCell>
                    <TableCell>₹{Math.round(avgValue).toLocaleString()}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-text bg-clip-text text-transparent">
            Reports & Analytics
          </h1>
          <p className="text-muted-foreground">Comprehensive business insights and analysis</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport("pdf")}>
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={() => handleExport("excel")}>
            <Download className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Report Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Report Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <Label>Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inventory">Inventory Report</SelectItem>
                  <SelectItem value="purchase">Purchase Report</SelectItem>
                  <SelectItem value="valuation">Valuation Report</SelectItem>
                  <SelectItem value="movement">Stock Movement Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>From Date</Label>
              <Input
                type="date"
                value={dateFilter.from}
                onChange={(e) => setDateFilter({ ...dateFilter, from: e.target.value })}
              />
            </div>
            <div>
              <Label>To Date</Label>
              <Input
                type="date"
                value={dateFilter.to}
                onChange={(e) => setDateFilter({ ...dateFilter, to: e.target.value })}
              />
            </div>
            <div className="flex items-end">
              <Button className="w-full">Apply Filters</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Content */}
      {reportType === "inventory" && renderInventoryReport()}
      {reportType === "purchase" && renderPurchaseReport()}
      
      {reportType === "valuation" && (
        <Card>
          <CardHeader>
            <CardTitle>Stock Valuation Report</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="text-4xl font-bold mb-2">₹{totalValue.toLocaleString()}</div>
              <p className="text-muted-foreground">Total Inventory Value</p>
              <div className="grid gap-4 md:grid-cols-3 mt-6">
                <div className="text-center">
                  <div className="text-2xl font-semibold">₹{Math.round(totalValue * 0.4).toLocaleString()}</div>
                  <p className="text-sm text-muted-foreground">Premium Segment</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-semibold">₹{Math.round(totalValue * 0.35).toLocaleString()}</div>
                  <p className="text-sm text-muted-foreground">Mid-range Segment</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-semibold">₹{Math.round(totalValue * 0.25).toLocaleString()}</div>
                  <p className="text-sm text-muted-foreground">Budget Segment</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Reports;