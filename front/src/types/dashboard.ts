// Dashboard interfaces
export interface DashboardFilters {
  state?: string;
  city?: string;
  year?: number;
}

export interface AdminDashboardStats {
  totalFarmers: number;
  totalProperties: number;
  totalHectares: number;
  totalCrops: number;
  propertiesByState: Array<{ state: string; count: number }>;
  topCities: Array<{ city: string; count: number }>;
  cropDistribution: Array<{ name: string; area: number }>;
  landUseDistribution: Array<{ name: string; value: number }>;
}

export interface FarmerDashboardStats {
  totalProperties: number;
  totalHectares: number;
  activeHarvests: number;
  totalCrops: number;
  myProperties: Array<{ name: string; totalArea: number }>;
  myCrops: Array<{ name: string; area: number }>;
  myLandUse: Array<{ name: string; value: number }>;
}

export type DashboardStats = AdminDashboardStats | FarmerDashboardStats;
