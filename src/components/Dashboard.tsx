import { useMemo } from "react";
import {
  Package,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  AlertTriangle,
  Users,
  Smartphone,
  BarChart3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MobilePhone, getTotalStats, getBrandStats } from "@/data/mobileData";

interface DashboardProps {
  mobileData: MobilePhone[];
}

const Dashboard = ({ mobileData }: DashboardProps) => {
  const stats = useMemo(() => getTotalStats(mobileData), [mobileData]);
  const brandStats = useMemo(() => getBrandStats(mobileData), [mobileData]);

  const lowStockItems = mobileData.filter((phone) => (phone.quantity || 0) < 10);
  const recentAdditions = mobileData
    .filter((phone) => phone.addedDate)
    .sort((a, b) => new Date(b.addedDate!).getTime() - new Date(a.addedDate!).getTime())
    .slice(0, 5);

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    trend, 
    color = "primary",
    subtitle 
  }: {
    title: string;
    value: string | number;
    icon: any;
    trend?: string;
    color?: string;
    subtitle?: string;
  }) => (
    <Card className="hover-lift transition-smooth">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <div className={`p-2 rounded-lg ${
            color === 'accent' ? 'bg-accent/10 text-accent' :
            color === 'success' ? 'bg-success/10 text-success' :
            color === 'warning' ? 'bg-warning/10 text-warning' :
            'bg-primary/10 text-primary'
          }`}>
            <Icon className="w-4 h-4" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        {trend && (
          <div className="flex items-center mt-2 text-xs text-success">
            <TrendingUp className="w-3 h-3 mr-1" />
            {trend}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="flex-1 space-y-6 p-6 slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your inventory overview</p>
        </div>
        <Badge variant="outline" className="px-3 py-1">
          Last updated: {new Date().toLocaleDateString()}
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Stock"
          value={stats.totalStock}
          icon={Package}
          trend="+12% from last month"
          subtitle="units in inventory"
        />
        <StatCard
          title="Total Value"
          value={`₹${(stats.totalValue / 100000).toFixed(1)}L`}
          icon={DollarSign}
          trend="+8% from last month"
          color="success"
          subtitle="inventory worth"
        />
        <StatCard
          title="Total Models"
          value={stats.totalModels}
          icon={Smartphone}
          color="accent"
          subtitle="unique models"
        />
        <StatCard
          title="Brands"
          value={stats.brands}
          icon={BarChart3}
          color="warning"
          subtitle="active brands"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Brand Distribution */}
        <Card className="hover-lift transition-smooth">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Brand Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {brandStats.slice(0, 5).map((brand) => (
              <div key={brand.brand} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{brand.brand}</span>
                  <span className="text-muted-foreground">{brand.count} units ({brand.percentage}%)</span>
                </div>
                <Progress value={brand.percentage} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <Card className="hover-lift transition-smooth">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-warning">
              <AlertTriangle className="w-5 h-5" />
              Low Stock Alerts
              <Badge variant="destructive" className="ml-auto">
                {lowStockItems.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockItems.slice(0, 5).map((phone) => (
                <div key={phone.id} className="flex items-center justify-between p-3 bg-warning/5 rounded-lg border-l-4 border-warning">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{phone.brand} {phone.modelName}</p>
                    <p className="text-xs text-muted-foreground">{phone.series}</p>
                  </div>
                  <Badge variant="outline" className="text-warning border-warning">
                    {phone.quantity} left
                  </Badge>
                </div>
              ))}
              {lowStockItems.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  🎉 All items are well stocked!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="hover-lift transition-smooth">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Recent Additions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentAdditions.map((phone) => (
              <div key={phone.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                      <Smartphone className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{phone.brand} {phone.modelName}</p>
                      <p className="text-xs text-muted-foreground">
                        Added {phone.quantity} units • {new Date(phone.addedDate!).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                <Badge variant="outline">₹{phone.priceRange.toLocaleString()}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;