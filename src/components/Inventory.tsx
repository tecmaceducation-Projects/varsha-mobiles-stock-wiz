import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Edit,
  Trash2,
  Package2,
  Eye,
  ArrowUpDown,
  Plus,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useInventory } from "@/contexts/InventoryContext";
import { useToast } from "@/hooks/use-toast";
import { MobilePhone } from "@/data/mobileData";

const Inventory = () => {
  const navigate = useNavigate();
  const { mobileData, deleteMobile } = useInventory();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof MobilePhone>("brand");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterBrand, setFilterBrand] = useState("all");
  const [filterOS, setFilterOS] = useState("all");

  const brands = ["all", ...Array.from(new Set(mobileData.map(phone => phone.brand)))];
  const osPlatforms = ["all", ...Array.from(new Set(mobileData.map(phone => phone.osPlatform)))];

  const filteredAndSortedData = useMemo(() => {
    let filtered = mobileData.filter(phone => {
      const matchesSearch = 
        phone.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        phone.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        phone.series.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesBrand = filterBrand === "all" || phone.brand === filterBrand;
      const matchesOS = filterOS === "all" || phone.osPlatform === filterOS;

      return matchesSearch && matchesBrand && matchesOS;
    });

    // Sort data
    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      let comparison = 0;
      if (aValue < bValue) comparison = -1;
      if (aValue > bValue) comparison = 1;
      
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [mobileData, searchTerm, sortField, sortOrder, filterBrand, filterOS]);

  const handleSort = (field: keyof MobilePhone) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleDelete = async (id: string, phoneName: string) => {
    try {
      deleteMobile(id);
      toast({
        title: "Stock Deleted",
        description: `${phoneName} has been removed from inventory`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete stock. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStockStatusColor = (quantity: number) => {
    if (quantity === 0) return "bg-destructive text-destructive-foreground";
    if (quantity < 10) return "bg-warning text-warning-foreground";
    if (quantity < 20) return "bg-accent text-accent-foreground";
    return "bg-success text-success-foreground";
  };

  const getStockStatusText = (quantity: number) => {
    if (quantity === 0) return "Out of Stock";
    if (quantity < 10) return "Low Stock";
    if (quantity < 20) return "Medium Stock";
    return "In Stock";
  };

  return (
    <div className="flex-1 p-6 space-y-6 slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Package2 className="w-8 h-8" />
            Inventory Management
          </h1>
          <p className="text-muted-foreground">
            Showing {filteredAndSortedData.length} of {mobileData.length} items
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => navigate("/add-stock")} className="bg-gradient-primary">
            <Plus className="w-4 h-4 mr-2" />
            Add Stock
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by brand, model, or series..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filterBrand} onValueChange={setFilterBrand}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Brand" />
              </SelectTrigger>
              <SelectContent>
                {brands.map(brand => (
                  <SelectItem key={brand} value={brand}>
                    {brand === "all" ? "All Brands" : brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterOS} onValueChange={setFilterOS}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="OS" />
              </SelectTrigger>
              <SelectContent>
                {osPlatforms.map(os => (
                  <SelectItem key={os} value={os}>
                    {os === "all" ? "All OS" : os}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Stock Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort("brand")}
                  >
                    <div className="flex items-center gap-2">
                      Brand
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort("modelName")}
                  >
                    <div className="flex items-center gap-2">
                      Model
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </TableHead>
                  <TableHead>Series</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort("priceRange")}
                  >
                    <div className="flex items-center gap-2">
                      Price (INR)
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </TableHead>
                  <TableHead>OS</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort("quantity")}
                  >
                    <div className="flex items-center gap-2">
                      Stock
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedData.map((phone) => (
                  <TableRow key={phone.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium">{phone.brand}</TableCell>
                    <TableCell>{phone.modelName}</TableCell>
                    <TableCell className="text-muted-foreground">{phone.series}</TableCell>
                    <TableCell>₹{phone.priceRange.toLocaleString()}</TableCell>
                    <TableCell>{phone.osPlatform}</TableCell>
                    <TableCell className="font-semibold">{phone.quantity || 0}</TableCell>
                    <TableCell>
                      <Badge className={getStockStatusColor(phone.quantity || 0)}>
                        {getStockStatusText(phone.quantity || 0)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/update-stock/${phone.id}`)}
                          className="hover:bg-primary/10 hover:text-primary"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Stock Item</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{phone.brand} {phone.modelName}"? 
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(phone.id, `${phone.brand} ${phone.modelName}`)}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredAndSortedData.length === 0 && (
            <div className="text-center py-8">
              <Package2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No items found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or filters
              </p>
              <Button onClick={() => navigate("/add-stock")}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Item
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Inventory;