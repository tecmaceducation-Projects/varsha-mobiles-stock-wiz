import { useState } from "react";
import { TrendingUp, BarChart3, PieChart, Calendar, Target, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useInventory } from "@/contexts/InventoryContext";
import { useSupplier } from "@/contexts/SupplierContext";
import { useToast } from "@/hooks/use-toast";

const Analytics = () => {
  const { mobileData } = useInventory();
  const { stockMovements, purchaseOrders, suppliers, addPurchaseOrder } = useSupplier();
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState("30");

  // Mock data for trends (in a real app, this would come from historical data)
  const salesTrend = [
    { month: "Jan", sales: 45, stock: 320 },
    { month: "Feb", sales: 52, stock: 298 },
    { month: "Mar", sales: 48, stock: 276 },
    { month: "Apr", sales: 61, stock: 245 },
    { month: "May", sales: 55, stock: 234 },
    { month: "Jun", sales: 67, stock: 289 }
  ];

  // Calculate analytics
  const totalRevenue = mobileData.reduce((sum, item) => sum + (item.priceRange * (50 - item.quantity)), 0); // Mock sold units
  const totalProfit = totalRevenue * 0.25; // 25% profit margin
  const avgOrderValue = totalRevenue / 150; // Mock total orders
  const conversionRate = 85; // Mock conversion rate

  // Demand forecasting (mock data)
  const demandForecast = [
    { product: "iPhone 15", currentStock: 25, predictedDemand: 40, reorderSuggestion: 15 },
    { product: "Samsung Galaxy S24", currentStock: 18, predictedDemand: 35, reorderSuggestion: 17 },
    { product: "OnePlus 11", currentStock: 12, predictedDemand: 28, reorderSuggestion: 16 },
    { product: "Xiaomi 14", currentStock: 30, predictedDemand: 22, reorderSuggestion: 0 }
  ];

  // Top performing categories
  const categoryPerformance = [
    { category: "Premium (>₹80k)", sales: 45, percentage: 35 },
    { category: "Mid-range (₹20k-₹80k)", sales: 78, percentage: 48 },
    { category: "Budget (<₹20k)", sales: 27, percentage: 17 }
  ];

  // Handle creating purchase order
  const handleCreatePO = (item: typeof demandForecast[0]) => {
    if (suppliers.length === 0) {
      toast({
        title: "Error",
        description: "No suppliers available. Please add a supplier first.",
        variant: "destructive",
      });
      return;
    }

    // Use the first available supplier (in a real app, user would select)
    const selectedSupplier = suppliers[0];
    
    // Calculate expected delivery date (7 days from now)
    const expectedDate = new Date();
    expectedDate.setDate(expectedDate.getDate() + 7);

    const newPO = {
      supplierId: selectedSupplier.id,
      orderDate: new Date().toISOString().split('T')[0],
      expectedDate: expectedDate.toISOString().split('T')[0],
      status: "pending" as const,
      items: [{
        brand: item.product.split(' ')[0], // Extract brand from product name
        model: item.product.split(' ').slice(1).join(' '), // Extract model
        quantity: item.reorderSuggestion,
        unitPrice: 50000, // Default price - in real app this would come from product data
      }],
      totalAmount: item.reorderSuggestion * 50000
    };

    addPurchaseOrder(newPO);
    
    toast({
      title: "Success",
      description: `Purchase order created for ${item.product} (${item.reorderSuggestion} units)`,
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-text bg-clip-text text-transparent">
            Analytics & Insights
          </h1>
          <p className="text-muted-foreground">Advanced analytics and business intelligence</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 3 months</SelectItem>
            <SelectItem value="365">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-primary/5" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(totalRevenue / 100000).toFixed(1)}L</div>
            <p className="text-xs text-success">+12.5% from last month</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-primary/5" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gross Profit</CardTitle>
            <Target className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(totalProfit / 100000).toFixed(1)}L</div>
            <p className="text-xs text-success">+8.2% from last month</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-primary/5" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <BarChart3 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{Math.round(avgOrderValue).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+5.4% from last month</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-primary/5" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Zap className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate}%</div>
            <p className="text-xs text-success">+3.1% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Sales Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Sales & Stock Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {salesTrend.map((data, index) => (
                <div key={data.month} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium w-8">{data.month}</span>
                    <div className="flex gap-2">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-success rounded-full" />
                        <span className="text-xs text-muted-foreground">Sales</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-primary rounded-full" />
                        <span className="text-xs text-muted-foreground">Stock</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <span className="text-success font-medium">{data.sales}</span>
                    <span className="text-primary font-medium">{data.stock}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Category Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Category Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryPerformance.map((category) => (
                <div key={category.category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{category.category}</span>
                    <span className="text-sm text-muted-foreground">{category.sales} units</span>
                  </div>
                  <Progress value={category.percentage} className="h-2" />
                  <span className="text-xs text-muted-foreground">{category.percentage}% of total sales</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Demand Forecasting */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Demand Forecasting & Reorder Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {demandForecast.map((item) => (
              <div key={item.product} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{item.product}</h4>
                  <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                    <span>Current: {item.currentStock} units</span>
                    <span>Predicted Demand: {item.predictedDemand} units</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {item.reorderSuggestion > 0 ? (
                    <>
                      <Badge variant="destructive">
                        Reorder {item.reorderSuggestion} units
                      </Badge>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleCreatePO(item)}
                      >
                        Create PO
                      </Button>
                    </>
                  ) : (
                    <Badge variant="secondary">
                      Stock Adequate
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Business Insights */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Key Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-success rounded-full mt-2" />
                <div>
                  <p className="text-sm font-medium">Premium segment driving growth</p>
                  <p className="text-xs text-muted-foreground">iPhone and Samsung premium models show 35% higher demand</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-warning rounded-full mt-2" />
                <div>
                  <p className="text-sm font-medium">Mid-range opportunity</p>
                  <p className="text-xs text-muted-foreground">OnePlus and Xiaomi mid-range models have high conversion rates</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                <div>
                  <p className="text-sm font-medium">Seasonal patterns detected</p>
                  <p className="text-xs text-muted-foreground">Sales peak during festival seasons and new launches</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-success/10 rounded-lg">
                <p className="text-sm font-medium text-success">Increase Premium Stock</p>
                <p className="text-xs text-muted-foreground">Focus on iPhone 15 and Samsung Galaxy S24 series</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <p className="text-sm font-medium text-primary">Optimize Mid-range Mix</p>
                <p className="text-xs text-muted-foreground">Balance OnePlus, Xiaomi, and Vivo inventory</p>
              </div>
              <div className="p-3 bg-warning/10 rounded-lg">
                <p className="text-sm font-medium text-warning">Monitor Budget Segment</p>
                <p className="text-xs text-muted-foreground">Consider reducing slow-moving budget models</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;