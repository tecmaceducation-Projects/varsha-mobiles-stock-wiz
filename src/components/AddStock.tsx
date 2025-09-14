import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Smartphone, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useInventory } from "@/contexts/InventoryContext";
import { useToast } from "@/hooks/use-toast";

const AddStock = () => {
  const navigate = useNavigate();
  const { addMobile } = useInventory();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    brand: "",
    modelName: "",
    series: "",
    launchYear: new Date().getFullYear(),
    priceRange: 0,
    osPlatform: "",
    notes: "",
    quantity: 1,
    supplier: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const brands = ["Samsung", "Apple", "Xiaomi", "Vivo", "OPPO", "OnePlus", "Motorola", "Realme", "Micromax", "Lava"];
  const platforms = ["Android", "iOS", "Feature OS"];

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      addMobile(formData);
      
      toast({
        title: "Stock Added Successfully",
        description: `${formData.brand} ${formData.modelName} has been added to inventory`,
        variant: "default",
      });

      // Reset form
      setFormData({
        brand: "",
        modelName: "",
        series: "",
        launchYear: new Date().getFullYear(),
        priceRange: 0,
        osPlatform: "",
        notes: "",
        quantity: 1,
        supplier: "",
      });

      setTimeout(() => {
        navigate("/inventory");
      }, 1500);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add stock. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 p-6 space-y-6 slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Plus className="w-8 h-8" />
            Add New Stock
          </h1>
          <p className="text-muted-foreground">Add new mobile phones to your inventory</p>
        </div>
        <Button variant="outline" onClick={() => navigate("/inventory")}>
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
      </div>

      <div className="max-w-2xl">
        <Card className="shadow-card hover-lift transition-smooth">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              Mobile Phone Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Brand and Model Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand *</Label>
                  <Select value={formData.brand} onValueChange={(value) => handleInputChange("brand", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                    <SelectContent>
                      {brands.map(brand => (
                        <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="modelName">Model Name *</Label>
                  <Input
                    id="modelName"
                    value={formData.modelName}
                    onChange={(e) => handleInputChange("modelName", e.target.value)}
                    placeholder="e.g., Galaxy S24 Ultra"
                    required
                  />
                </div>
              </div>

              {/* Series and Launch Year */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="series">Series</Label>
                  <Input
                    id="series"
                    value={formData.series}
                    onChange={(e) => handleInputChange("series", e.target.value)}
                    placeholder="e.g., Galaxy S"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="launchYear">Launch Year *</Label>
                  <Input
                    id="launchYear"
                    type="number"
                    min="2010"
                    max={new Date().getFullYear() + 1}
                    value={formData.launchYear}
                    onChange={(e) => handleInputChange("launchYear", parseInt(e.target.value))}
                    required
                  />
                </div>
              </div>

              {/* Price Range and OS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priceRange">Price Range (INR) *</Label>
                  <Input
                    id="priceRange"
                    type="number"
                    min="1000"
                    value={formData.priceRange}
                    onChange={(e) => handleInputChange("priceRange", parseInt(e.target.value))}
                    placeholder="e.g., 120000"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="osPlatform">OS/Platform *</Label>
                  <Select value={formData.osPlatform} onValueChange={(value) => handleInputChange("osPlatform", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select OS" />
                    </SelectTrigger>
                    <SelectContent>
                      {platforms.map(platform => (
                        <SelectItem key={platform} value={platform}>{platform}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Quantity and Supplier */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => handleInputChange("quantity", parseInt(e.target.value))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supplier">Supplier</Label>
                  <Input
                    id="supplier"
                    value={formData.supplier}
                    onChange={(e) => handleInputChange("supplier", e.target.value)}
                    placeholder="e.g., Samsung India"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Additional notes about the product..."
                  rows={3}
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-primary hover:shadow-glow transition-all duration-300"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                      Adding Stock...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Save className="w-4 h-4" />
                      Add to Inventory
                    </div>
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/inventory")}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddStock;