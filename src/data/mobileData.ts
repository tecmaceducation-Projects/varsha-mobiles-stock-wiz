export interface MobilePhone {
  id: string;
  brand: string;
  modelName: string;
  series: string;
  launchYear: number;
  priceRange: number;
  osPlatform: string;
  notes: string;
  quantity?: number;
  supplier?: string;
  addedDate?: string;
}

export const initialMobileData: MobilePhone[] = [
  // Samsung
  { id: "1", brand: "Samsung", modelName: "Galaxy S24 Ultra", series: "Galaxy S", launchYear: 2024, priceRange: 120000, osPlatform: "Android", notes: "Flagship model", quantity: 15, supplier: "Samsung India", addedDate: "2024-01-15" },
  { id: "2", brand: "Samsung", modelName: "Galaxy S23", series: "Galaxy S", launchYear: 2023, priceRange: 80000, osPlatform: "Android", notes: "Premium", quantity: 25, supplier: "Samsung India", addedDate: "2024-01-10" },
  { id: "3", brand: "Samsung", modelName: "Galaxy A54", series: "Galaxy A", launchYear: 2023, priceRange: 35000, osPlatform: "Android", notes: "Mid-range", quantity: 40, supplier: "Samsung India", addedDate: "2024-01-12" },
  { id: "4", brand: "Samsung", modelName: "Galaxy A14", series: "Galaxy A", launchYear: 2023, priceRange: 15000, osPlatform: "Android", notes: "Budget", quantity: 60, supplier: "Samsung India", addedDate: "2024-01-08" },
  { id: "5", brand: "Samsung", modelName: "Galaxy Z Fold 5", series: "Galaxy Z", launchYear: 2023, priceRange: 150000, osPlatform: "Android", notes: "Foldable", quantity: 8, supplier: "Samsung India", addedDate: "2024-01-20" },

  // Apple
  { id: "6", brand: "Apple", modelName: "iPhone 15 Pro Max", series: "iPhone 15", launchYear: 2023, priceRange: 160000, osPlatform: "iOS", notes: "Flagship", quantity: 12, supplier: "Apple India", addedDate: "2024-01-18" },
  { id: "7", brand: "Apple", modelName: "iPhone 15", series: "iPhone 15", launchYear: 2023, priceRange: 80000, osPlatform: "iOS", notes: "Latest generation", quantity: 20, supplier: "Apple India", addedDate: "2024-01-16" },
  { id: "8", brand: "Apple", modelName: "iPhone 14", series: "iPhone 14", launchYear: 2022, priceRange: 70000, osPlatform: "iOS", notes: "Bestseller", quantity: 35, supplier: "Apple India", addedDate: "2024-01-14" },
  { id: "9", brand: "Apple", modelName: "iPhone 13", series: "iPhone 13", launchYear: 2021, priceRange: 60000, osPlatform: "iOS", notes: "Still popular", quantity: 30, supplier: "Apple India", addedDate: "2024-01-11" },

  // Xiaomi
  { id: "10", brand: "Xiaomi", modelName: "Redmi Note 12 Pro", series: "Redmi Note", launchYear: 2023, priceRange: 25000, osPlatform: "Android", notes: "Popular mid-range", quantity: 50, supplier: "Xiaomi India", addedDate: "2024-01-09" },
  { id: "11", brand: "Xiaomi", modelName: "Redmi Note 11", series: "Redmi Note", launchYear: 2022, priceRange: 16000, osPlatform: "Android", notes: "Bestseller", quantity: 45, supplier: "Xiaomi India", addedDate: "2024-01-07" },
  { id: "12", brand: "Xiaomi", modelName: "12 Pro", series: "Mi Series", launchYear: 2022, priceRange: 60000, osPlatform: "Android", notes: "Flagship", quantity: 18, supplier: "Xiaomi India", addedDate: "2024-01-13" },

  // Vivo
  { id: "13", brand: "Vivo", modelName: "Vivo X90 Pro", series: "X Series", launchYear: 2023, priceRange: 90000, osPlatform: "Android", notes: "Camera flagship", quantity: 15, supplier: "Vivo India", addedDate: "2024-01-17" },
  { id: "14", brand: "Vivo", modelName: "Vivo V29", series: "V Series", launchYear: 2023, priceRange: 32000, osPlatform: "Android", notes: "Stylish design", quantity: 35, supplier: "Vivo India", addedDate: "2024-01-15" },

  // OnePlus
  { id: "15", brand: "OnePlus", modelName: "OnePlus 11", series: "OnePlus", launchYear: 2023, priceRange: 61000, osPlatform: "Android", notes: "Flagship", quantity: 22, supplier: "OnePlus India", addedDate: "2024-01-19" },
  { id: "16", brand: "OnePlus", modelName: "OnePlus Nord 3", series: "Nord", launchYear: 2023, priceRange: 33000, osPlatform: "Android", notes: "Affordable premium", quantity: 28, supplier: "OnePlus India", addedDate: "2024-01-12" },
];

export const getBrandStats = (data: MobilePhone[]) => {
  const brandCounts = data.reduce((acc, phone) => {
    acc[phone.brand] = (acc[phone.brand] || 0) + (phone.quantity || 0);
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(brandCounts).map(([brand, count]) => ({
    brand,
    count,
    percentage: Math.round((count / data.reduce((sum, p) => sum + (p.quantity || 0), 0)) * 100)
  }));
};

export const getTotalStats = (data: MobilePhone[]) => {
  const totalStock = data.reduce((sum, phone) => sum + (phone.quantity || 0), 0);
  const totalValue = data.reduce((sum, phone) => sum + (phone.quantity || 0) * phone.priceRange, 0);
  const totalModels = data.length;
  const brands = new Set(data.map(phone => phone.brand)).size;
  
  return {
    totalStock,
    totalValue,
    totalModels,
    brands,
  };
};