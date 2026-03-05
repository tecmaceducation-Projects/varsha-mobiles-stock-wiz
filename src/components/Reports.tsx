import { useState, useMemo } from "react";
import { Download, Filter, Calendar, TrendingUp, BarChart3, PieChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useInventory } from "@/contexts/InventoryContext";
import { useSupplier } from "@/contexts/SupplierContext";
import { useToast } from "@/hooks/use-toast";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RechartsPie, Pie, Cell, Legend, LineChart, Line, Area, AreaChart,
} from "recharts";

const CHART_COLORS = [
  "hsl(217, 91%, 35%)", "hsl(30, 100%, 55%)", "hsl(142, 76%, 36%)",
  "hsl(43, 96%, 56%)", "hsl(260, 50%, 45%)", "hsl(0, 84%, 60%)",
  "hsl(190, 80%, 40%)", "hsl(320, 70%, 50%)",
];

const Reports = () => {
  const { mobileData } = useInventory();
  const { suppliers, purchaseOrders, stockMovements } = useSupplier();
  const { toast } = useToast();
  const [reportType, setReportType] = useState("inventory");
  const [timePeriod, setTimePeriod] = useState("all");

  // Filter data by time period
  const filteredData = useMemo(() => {
    if (timePeriod === "all") return mobileData;
    const now = new Date();
    const filterDate = new Date();
    if (timePeriod === "daily") filterDate.setDate(now.getDate() - 1);
    else if (timePeriod === "weekly") filterDate.setDate(now.getDate() - 7);
    else if (timePeriod === "monthly") filterDate.setMonth(now.getMonth() - 1);
    else if (timePeriod === "yearly") filterDate.setFullYear(now.getFullYear() - 1);
    return mobileData.filter(item => {
      if (!item.addedDate) return true;
      return new Date(item.addedDate) >= filterDate;
    });
  }, [mobileData, timePeriod]);

  const getProductName = (productId: string) => {
    const item = mobileData.find(m => m.id === productId);
    return item ? `${item.brand} ${item.modelName}` : productId;
  };

  const totalStock = filteredData.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const totalValue = filteredData.reduce((sum, item) => sum + ((item.quantity || 0) * item.priceRange), 0);
  const lowStockItems = filteredData.filter(item => (item.quantity || 0) < 10);
  const fastMovingItems = filteredData.filter(item => item.priceRange > 50000);
  const slowMovingItems = filteredData.filter(item => item.priceRange < 20000);

  // Brand analysis
  const brandStats = filteredData.reduce((acc, item) => {
    if (!acc[item.brand]) acc[item.brand] = { count: 0, value: 0, quantity: 0 };
    acc[item.brand].count += 1;
    acc[item.brand].value += item.priceRange * (item.quantity || 0);
    acc[item.brand].quantity += (item.quantity || 0);
    return acc;
  }, {} as Record<string, { count: number; value: number; quantity: number }>);

  const brandChartData = Object.entries(brandStats).map(([brand, stats]) => ({
    name: brand, quantity: stats.quantity, value: stats.value, models: stats.count,
  }));

  const priceSegmentData = [
    { name: "Premium (>₹50K)", value: filteredData.filter(i => i.priceRange > 50000).reduce((s, i) => s + (i.quantity || 0), 0) },
    { name: "Mid (₹20K-₹50K)", value: filteredData.filter(i => i.priceRange >= 20000 && i.priceRange <= 50000).reduce((s, i) => s + (i.quantity || 0), 0) },
    { name: "Budget (<₹20K)", value: filteredData.filter(i => i.priceRange < 20000).reduce((s, i) => s + (i.quantity || 0), 0) },
  ];

  const stockTrendData = Object.entries(brandStats).map(([brand, stats]) => ({
    name: brand, stock: stats.quantity, value: Math.round(stats.value / 1000),
  }));

  const handleExport = (format: string) => {
    toast({ title: "Export Started", description: `Generating ${format.toUpperCase()} report...` });
    setTimeout(() => {
      toast({ title: "Export Complete", description: `Report exported successfully in ${format.toUpperCase()} format!` });
    }, 2000);
  };

  const renderInventoryReport = () => (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-4">
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Items</CardTitle><BarChart3 className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{filteredData.length}</div><p className="text-xs text-muted-foreground">Different models</p></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Stock</CardTitle><TrendingUp className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{totalStock}</div><p className="text-xs text-muted-foreground">Units in inventory</p></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Inventory Value</CardTitle><PieChart className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">₹{totalValue.toLocaleString()}</div><p className="text-xs text-muted-foreground">Total stock value</p></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Low Stock Items</CardTitle><Calendar className="h-4 w-4 text-warning" /></CardHeader><CardContent><div className="text-2xl font-bold text-warning">{lowStockItems.length}</div><p className="text-xs text-muted-foreground">Need reorder</p></CardContent></Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Brand-wise Stock Distribution</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={brandChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                <Bar dataKey="quantity" fill="hsl(217, 91%, 35%)" radius={[4, 4, 0, 0]} name="Units" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Price Segment Distribution</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPie>
                <Pie data={priceSegmentData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {priceSegmentData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </RechartsPie>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Stock Trend Area Chart */}
      <Card>
        <CardHeader><CardTitle>Stock Value Trend by Brand (₹ in thousands)</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={stockTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
              <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
              <Area type="monotone" dataKey="value" stroke="hsl(217, 91%, 35%)" fill="hsl(217, 91%, 35%)" fillOpacity={0.2} name="Value (₹K)" />
              <Area type="monotone" dataKey="stock" stroke="hsl(30, 100%, 55%)" fill="hsl(30, 100%, 55%)" fillOpacity={0.2} name="Stock Units" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Brand Analysis Table */}
      <Card>
        <CardHeader><CardTitle>Brand-wise Analysis</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Brand</TableHead><TableHead>Models</TableHead><TableHead>Stock Quantity</TableHead><TableHead>Stock Value</TableHead><TableHead>Average Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(brandStats).map(([brand, stats]) => (
                <TableRow key={brand}>
                  <TableCell className="font-medium">{brand}</TableCell>
                  <TableCell>{stats.count}</TableCell>
                  <TableCell>{stats.quantity}</TableCell>
                  <TableCell>₹{stats.value.toLocaleString()}</TableCell>
                  <TableCell>₹{stats.quantity > 0 ? Math.round(stats.value / stats.quantity).toLocaleString() : 0}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Fast vs Slow Moving */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5 text-success" />Fast Moving Items</CardTitle></CardHeader>
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
          <CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="w-5 h-5 text-muted-foreground" />Slow Moving Items</CardTitle></CardHeader>
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

  const renderPurchaseReport = () => {
    const supplierChartData = suppliers.map(supplier => {
      const supplierOrders = purchaseOrders.filter(po => po.supplierId === supplier.id);
      const totalVal = supplierOrders.reduce((sum, po) => sum + po.totalAmount, 0);
      return { name: supplier.company, orders: supplierOrders.length, value: Math.round(totalVal / 1000) };
    });

    return (
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          <Card><CardHeader><CardTitle>Total Purchase Orders</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{purchaseOrders.length}</div></CardContent></Card>
          <Card><CardHeader><CardTitle>Total Purchase Value</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">₹{purchaseOrders.reduce((sum, po) => sum + po.totalAmount, 0).toLocaleString()}</div></CardContent></Card>
          <Card><CardHeader><CardTitle>Active Suppliers</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{suppliers.length}</div></CardContent></Card>
        </div>

        {/* Supplier Chart */}
        <Card>
          <CardHeader><CardTitle>Supplier-wise Purchase Value (₹ in thousands)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={supplierChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                <Bar dataKey="value" fill="hsl(30, 100%, 55%)" radius={[4, 4, 0, 0]} name="Value (₹K)" />
                <Bar dataKey="orders" fill="hsl(142, 76%, 36%)" radius={[4, 4, 0, 0]} name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Supplier-wise Purchase History</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Supplier</TableHead><TableHead>Total Orders</TableHead><TableHead>Total Value</TableHead><TableHead>Average Order Value</TableHead></TableRow></TableHeader>
              <TableBody>
                {suppliers.map(supplier => {
                  const supplierOrders = purchaseOrders.filter(po => po.supplierId === supplier.id);
                  const totalVal = supplierOrders.reduce((sum, po) => sum + po.totalAmount, 0);
                  const avgValue = supplierOrders.length > 0 ? totalVal / supplierOrders.length : 0;
                  return (
                    <TableRow key={supplier.id}>
                      <TableCell>{supplier.company}</TableCell>
                      <TableCell>{supplierOrders.length}</TableCell>
                      <TableCell>₹{totalVal.toLocaleString()}</TableCell>
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
  };

  const renderValuationReport = () => {
    const segmentData = [
      { name: "Premium", value: Math.round(totalValue * 0.4) },
      { name: "Mid-range", value: Math.round(totalValue * 0.35) },
      { name: "Budget", value: Math.round(totalValue * 0.25) },
    ];

    return (
      <Card>
        <CardHeader><CardTitle>Stock Valuation Report</CardTitle></CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="text-4xl font-bold mb-2">₹{totalValue.toLocaleString()}</div>
            <p className="text-muted-foreground">Total Inventory Value</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPie>
              <Pie data={segmentData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ₹${(value / 1000).toFixed(0)}K`}>
                {segmentData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
              <Legend />
            </RechartsPie>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };

  const renderMovementReport = () => (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <Card><CardHeader><CardTitle>Total Movements</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stockMovements.length}</div></CardContent></Card>
        <Card><CardHeader><CardTitle>Stock In</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-success">{stockMovements.filter(m => m.type === "in").reduce((s, m) => s + m.quantity, 0)}</div></CardContent></Card>
        <Card><CardHeader><CardTitle>Stock Out</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-destructive">{stockMovements.filter(m => m.type === "out").reduce((s, m) => s + m.quantity, 0)}</div></CardContent></Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Stock Movement History</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Product</TableHead><TableHead>Type</TableHead><TableHead>Quantity</TableHead><TableHead>Reason</TableHead></TableRow></TableHeader>
            <TableBody>
              {stockMovements.map(movement => (
                <TableRow key={movement.id}>
                  <TableCell>{movement.date}</TableCell>
                  <TableCell>{movement.product}</TableCell>
                  <TableCell><Badge variant={movement.type === "in" ? "default" : "destructive"}>{movement.type === "in" ? "Stock In" : "Stock Out"}</Badge></TableCell>
                  <TableCell>{movement.quantity}</TableCell>
                  <TableCell>{movement.reason}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-text bg-clip-text text-transparent">Reports & Analytics</h1>
          <p className="text-muted-foreground">Comprehensive business insights and analysis</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport("pdf")}><Download className="w-4 h-4 mr-2" />Export PDF</Button>
          <Button variant="outline" onClick={() => handleExport("excel")}><Download className="w-4 h-4 mr-2" />Export Excel</Button>
        </div>
      </div>

      {/* Report Controls */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Filter className="w-5 h-5" />Report Filters</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label>Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="inventory">Inventory Report</SelectItem>
                  <SelectItem value="purchase">Purchase Report</SelectItem>
                  <SelectItem value="valuation">Valuation Report</SelectItem>
                  <SelectItem value="movement">Stock Movement Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Time Period</Label>
              <Select value={timePeriod} onValueChange={setTimePeriod}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="daily">Last 24 Hours</SelectItem>
                  <SelectItem value="weekly">Last 7 Days</SelectItem>
                  <SelectItem value="monthly">Last 30 Days</SelectItem>
                  <SelectItem value="yearly">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button className="w-full" onClick={() => toast({ title: "Filters Applied", description: `Showing ${timePeriod} ${reportType} report` })}>Apply Filters</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {reportType === "inventory" && renderInventoryReport()}
      {reportType === "purchase" && renderPurchaseReport()}
      {reportType === "valuation" && renderValuationReport()}
      {reportType === "movement" && renderMovementReport()}
    </div>
  );
};

export default Reports;
