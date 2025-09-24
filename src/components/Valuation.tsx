import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package, 
  Download,
  Calendar,
  BarChart3,
  PieChartIcon
} from "lucide-react";
import { useInventory } from "@/contexts/InventoryContext";
import { useSupplier } from "@/contexts/SupplierContext";
import { useToast } from "@/hooks/use-toast";

const Valuation = () => {
  const { mobileData } = useInventory();
  const { purchaseOrders, stockMovements } = useSupplier();
  const { toast } = useToast();
  const [viewType, setViewType] = useState("overview");
  const [timeRange, setTimeRange] = useState("monthly");

  // Calculate key metrics
  const totalInventoryValue = mobileData.reduce((sum, item) => sum + (item.quantity * item.priceRange), 0);
  const totalItems = mobileData.reduce((sum, item) => sum + item.quantity, 0);
  const averageItemValue = totalInventoryValue / totalItems || 0;
  
  // Simulate cost price (70% of selling price for profit calculation)
  const totalCostValue = totalInventoryValue * 0.7;
  const potentialProfit = totalInventoryValue - totalCostValue;
  const profitMargin = (potentialProfit / totalInventoryValue) * 100 || 0;

  // Brand-wise valuation data
  const brandValuation = mobileData.reduce((acc, item) => {
    const brandName = item.brand;
    const itemValue = item.quantity * item.priceRange;
    
    if (!acc[brandName]) {
      acc[brandName] = {
        name: brandName,
        value: 0,
        quantity: 0,
        models: 0,
        costValue: 0,
        profit: 0
      };
    }
    
    acc[brandName].value += itemValue;
    acc[brandName].quantity += item.quantity;
    acc[brandName].models += 1;
    acc[brandName].costValue += itemValue * 0.7;
    acc[brandName].profit += itemValue * 0.3;
    
    return acc;
  }, {} as Record<string, any>);

  const brandData = Object.values(brandValuation);

  // Price range distribution
  const priceRanges = [
    { name: "Budget (₹0-20K)", min: 0, max: 20000, color: "#8884d8" },
    { name: "Mid-range (₹20K-50K)", min: 20000, max: 50000, color: "#82ca9d" },
    { name: "Premium (₹50K-100K)", min: 50000, max: 100000, color: "#ffc658" },
    { name: "Flagship (₹100K+)", min: 100000, max: Infinity, color: "#ff7300" }
  ];

  const priceDistribution = priceRanges.map(range => {
    const itemsInRange = mobileData.filter(item => 
      item.priceRange >= range.min && item.priceRange < range.max
    );
    const totalValue = itemsInRange.reduce((sum, item) => sum + (item.quantity * item.priceRange), 0);
    const totalQuantity = itemsInRange.reduce((sum, item) => sum + item.quantity, 0);
    
    return {
      ...range,
      value: totalValue,
      quantity: totalQuantity,
      percentage: ((totalValue / totalInventoryValue) * 100) || 0
    };
  });

  // Monthly trend simulation (last 6 months)
  const monthlyTrends = [
    { month: "Jul", inventory: 950000, sales: 180000, profit: 54000 },
    { month: "Aug", inventory: 1100000, sales: 220000, profit: 66000 },
    { month: "Sep", inventory: 1250000, sales: 280000, profit: 84000 },
    { month: "Oct", inventory: 1180000, sales: 320000, profit: 96000 },
    { month: "Nov", inventory: 1350000, sales: 380000, profit: 114000 },
    { month: "Dec", inventory: Math.round(totalInventoryValue), sales: 420000, profit: 126000 }
  ];

  // Top performing models by value
  const topModels = mobileData
    .map(item => ({
      ...item,
      totalValue: item.quantity * item.priceRange,
      profit: item.quantity * item.priceRange * 0.3
    }))
    .sort((a, b) => b.totalValue - a.totalValue)
    .slice(0, 10);

  const handleExport = (type: string) => {
    toast({
      title: "Export Started",
      description: `Generating ${type} valuation report...`,
    });
    
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: `Valuation report exported successfully!`,
      });
    }, 2000);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-text bg-clip-text text-transparent">
            Valuation Report
          </h1>
          <p className="text-muted-foreground">Comprehensive inventory valuation and profit analysis</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => handleExport("PDF")}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Total Inventory Value</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">₹{totalInventoryValue.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <TrendingUp className="w-3 h-3 mr-1 text-success" />
              +12.5% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Potential Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">₹{potentialProfit.toLocaleString()}</div>
            <div className="flex items-center text-xs text-success mt-1">
              {profitMargin.toFixed(1)}% margin
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Average Item Value</CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">₹{Math.round(averageItemValue).toLocaleString()}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Across {totalItems} items
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Cost Investment</CardTitle>
            <BarChart3 className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">₹{totalCostValue.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Total cost invested
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Brand Valuation Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="w-5 h-5" />
              Brand-wise Valuation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={brandData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${Number(percent || 0).toFixed(1)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {brandData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${Number(value).toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Price Range Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Price Range Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={priceDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  fontSize={10}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tickFormatter={(value) => `₹${(Number(value)/1000).toFixed(0)}K`} />
                <Tooltip formatter={(value) => `₹${Number(value).toLocaleString()}`} />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Inventory & Profit Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `₹${(Number(value)/1000).toFixed(0)}K`} />
              <Tooltip formatter={(value) => `₹${Number(value).toLocaleString()}`} />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="inventory" 
                stackId="1" 
                stroke="#8884d8" 
                fill="#8884d8" 
                fillOpacity={0.6}
                name="Inventory Value"
              />
              <Area 
                type="monotone" 
                dataKey="sales" 
                stackId="2" 
                stroke="#82ca9d" 
                fill="#82ca9d" 
                fillOpacity={0.6}
                name="Sales Value"
              />
              <Area 
                type="monotone" 
                dataKey="profit" 
                stackId="3" 
                stroke="#ffc658" 
                fill="#ffc658" 
                fillOpacity={0.6}
                name="Profit"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Performing Models */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Models by Value</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topModels.slice(0, 8).map((model, index) => (
              <div key={model.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                    {index + 1}
                  </Badge>
                  <div>
                    <p className="font-medium">{model.brand} {model.modelName}</p>
                    <p className="text-sm text-muted-foreground">
                      {model.quantity} units × ₹{model.priceRange.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₹{model.totalValue.toLocaleString()}</p>
                  <p className="text-sm text-success">+₹{model.profit.toLocaleString()} profit</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Investment Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Total Investment:</span>
                <span className="font-semibold">₹{totalCostValue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Current Value:</span>
                <span className="font-semibold">₹{totalInventoryValue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-success">
                <span>Potential Gain:</span>
                <span className="font-semibold">₹{potentialProfit.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Stock Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {priceDistribution.map((range) => (
                <div key={range.name} className="flex justify-between items-center">
                  <span className="text-sm">{range.name.split('(')[0]}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{range.quantity} units</span>
                    <Badge variant="secondary">
                      {range.percentage.toFixed(1)}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Profit Margin:</span>
                <Badge className="bg-success text-success-foreground">
                  {profitMargin.toFixed(1)}%
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Inventory Turnover:</span>
                <Badge variant="secondary">2.3x</Badge>
              </div>
              <div className="flex justify-between">
                <span>ROI Potential:</span>
                <Badge className="bg-primary text-primary-foreground">
                  {((potentialProfit / totalCostValue) * 100).toFixed(1)}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Valuation;