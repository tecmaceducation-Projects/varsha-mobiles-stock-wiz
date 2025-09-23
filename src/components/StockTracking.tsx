import { useState } from "react";
import { Plus, TrendingUp, TrendingDown, Package, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useSupplier } from "@/contexts/SupplierContext";
import { useInventory } from "@/contexts/InventoryContext";
import { useToast } from "@/hooks/use-toast";

const StockTracking = () => {
  const { stockMovements, addStockMovement } = useSupplier();
  const { mobileData } = useInventory();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    productId: "",
    type: "in" as "in" | "out",
    quantity: "",
    reason: "",
    reference: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addStockMovement({
      productId: formData.productId,
      type: formData.type,
      quantity: parseInt(formData.quantity),
      date: new Date().toISOString().split('T')[0],
      reason: formData.reason,
      reference: formData.reference
    });

    toast({
      title: "Success",
      description: "Stock movement recorded successfully!",
    });
    
    setIsAddDialogOpen(false);
    setFormData({
      productId: "",
      type: "in",
      quantity: "",
      reason: "",
      reference: ""
    });
  };

  const stockIn = stockMovements.filter(m => m.type === "in").reduce((sum, m) => sum + m.quantity, 0);
  const stockOut = stockMovements.filter(m => m.type === "out").reduce((sum, m) => sum + m.quantity, 0);
  const lowStockItems = mobileData.filter(item => item.quantity < 10);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-text bg-clip-text text-transparent">
            Stock Tracking
          </h1>
          <p className="text-muted-foreground">Monitor stock movements and inventory flow</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:bg-gradient-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Record Movement
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record Stock Movement</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="product">Product</Label>
                <Select value={formData.productId} onValueChange={(value) => setFormData({ ...formData, productId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {mobileData.map(mobile => (
                      <SelectItem key={mobile.id} value={mobile.id}>
                        {mobile.brand} {mobile.modelName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="type">Movement Type</Label>
                <Select value={formData.type} onValueChange={(value: "in" | "out") => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in">Stock In</SelectItem>
                    <SelectItem value="out">Stock Out</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="reason">Reason</Label>
                <Input
                  id="reason"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="e.g., New stock arrival, Sale, Damaged"
                  required
                />
              </div>
              <div>
                <Label htmlFor="reference">Reference (Optional)</Label>
                <Input
                  id="reference"
                  value={formData.reference}
                  onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                  placeholder="e.g., PO001, INV123"
                />
              </div>
              <Button type="submit" className="w-full">
                Record Movement
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stock In</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stockIn}</div>
            <p className="text-xs text-muted-foreground">Units received</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stock Out</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stockOut}</div>
            <p className="text-xs text-muted-foreground">Units sold/issued</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Stock</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stockIn - stockOut}</div>
            <p className="text-xs text-muted-foreground">Current balance</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{lowStockItems.length}</div>
            <p className="text-xs text-muted-foreground">Items below 10 units</p>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alerts */}
      {lowStockItems.length > 0 && (
        <Card className="border-warning/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-warning">
              <AlertTriangle className="w-5 h-5" />
              Low Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {lowStockItems.map(item => (
                <div key={item.id} className="flex justify-between items-center p-2 bg-warning/10 rounded-lg">
                  <span className="font-medium">{item.brand} {item.modelName}</span>
                  <Badge variant="destructive">
                    {item.quantity} units left
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stock Movements Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Stock Movements</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Reference</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stockMovements.slice().reverse().map((movement) => {
                const product = mobileData.find(m => m.id === movement.productId);
                return (
                  <TableRow key={movement.id}>
                    <TableCell>{movement.date}</TableCell>
                    <TableCell>{product ? `${product.brand} ${product.modelName}` : "Unknown Product"}</TableCell>
                    <TableCell>
                      <Badge className={movement.type === "in" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}>
                        {movement.type === "in" ? (
                          <><TrendingUp className="w-3 h-3 mr-1" /> Stock In</>
                        ) : (
                          <><TrendingDown className="w-3 h-3 mr-1" /> Stock Out</>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell className={movement.type === "in" ? "text-success font-medium" : "text-destructive font-medium"}>
                      {movement.type === "in" ? "+" : "-"}{movement.quantity}
                    </TableCell>
                    <TableCell>{movement.reason}</TableCell>
                    <TableCell>{movement.reference || "-"}</TableCell>
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

export default StockTracking;