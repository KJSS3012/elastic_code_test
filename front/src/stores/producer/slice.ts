import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { apiService } from "../../services/api";
import type { DashboardFilters } from "../../types/dashboard";

export interface Crop {
  id: string;
  name: string;
  planted_area_ha: number;
}

export interface Harvest {
  id: string;
  name: string;
  year: number;
  total_area_ha: number;
  crops: Crop[];
}

export interface Farm {
  id: string;
  farm_name: string;
  city: string;
  state: string;
  total_area_ha: number;
  arable_area_ha: number;
  vegetable_area_ha: number;
  harvests: Harvest[];
}

export interface Producer {
  id: string;
  cpf: string;
  cnpj?: string;
  producer_name: string;
  email: string;
  phone: string;
  farms: Farm[];
}

export interface ProducerState {
  producers: Producer[];
  myFarms: Farm[];
  loading: boolean;
  error: string | null;
  dashboardStats: any;
}

const initialState: ProducerState = {
  producers: [],
  myFarms: [],
  loading: false,
  error: null,
  dashboardStats: null,
};

// Async thunks para admin
export const fetchAllProducers = createAsyncThunk(
  'producer/fetchAll',
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      const response = await apiService.getAllFarmers({ page, limit });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAdminDashboardStats = createAsyncThunk(
  'producer/fetchAdminStats',
  async (filters: DashboardFilters | undefined, { rejectWithValue }) => {
    try {
      const response = await apiService.getAdminDashboardStats(filters);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunks para farmer
export const fetchMyFarms = createAsyncThunk(
  'producer/fetchMyFarms',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getMyProperties();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchFarmerDashboardStats = createAsyncThunk(
  'producer/fetchFarmerStats',
  async (filters: DashboardFilters | undefined, { rejectWithValue }) => {
    try {
      const response = await apiService.getFarmerDashboardStats(filters);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createFarm = createAsyncThunk(
  'producer/createFarm',
  async (farmData: any) => {
    const response = await apiService.createProperty(farmData);
    // O backend retorna { message, data }, então precisamos retornar response.data.data
    return response.data.data;
  }
);

export const updateFarm = createAsyncThunk(
  'producer/updateFarm',
  async ({ id, data }: { id: string; data: any }) => {
    const response = await apiService.updateProperty(id, data);
    return response.data;
  }
);

export const deleteFarm = createAsyncThunk(
  'producer/deleteFarm',
  async (id: string) => {
    await apiService.deleteProperty(id);
    return id;
  }
);

const producerSlice = createSlice({
  name: "producer",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Actions locais para manipulação rápida (antes de sincronizar com API)
    addHarvestToProperty: (state, action: PayloadAction<{ propertyId: string; harvest: { name: string; total_area_ha: number } }>) => {
      const farm = state.myFarms.find(f => f.id === action.payload.propertyId);
      if (farm) {
        const newHarvest: Harvest = {
          id: Date.now().toString(),
          name: action.payload.harvest.name,
          year: new Date().getFullYear(),
          total_area_ha: action.payload.harvest.total_area_ha,
          crops: []
        };
        farm.harvests.push(newHarvest);
      }
    },
    deleteHarvest: (state, action: PayloadAction<{ propertyId: string; harvestId: string }>) => {
      const farm = state.myFarms.find(f => f.id === action.payload.propertyId);
      if (farm) {
        farm.harvests = farm.harvests.filter(h => h.id !== action.payload.harvestId);
      }
    },
    addCropToHarvest: (state, action: PayloadAction<{ propertyId: string; harvestId: string; crop: { name: string; planted_area_ha: number } }>) => {
      const farm = state.myFarms.find(f => f.id === action.payload.propertyId);
      if (farm) {
        const harvest = farm.harvests.find(h => h.id === action.payload.harvestId);
        if (harvest) {
          const newCrop: Crop = {
            id: Date.now().toString(),
            name: action.payload.crop.name,
            planted_area_ha: action.payload.crop.planted_area_ha
          };
          harvest.crops.push(newCrop);
        }
      }
    },
    deleteCrop: (state, action: PayloadAction<{ propertyId: string; harvestId: string; cropId: string }>) => {
      const farm = state.myFarms.find(f => f.id === action.payload.propertyId);
      if (farm) {
        const harvest = farm.harvests.find(h => h.id === action.payload.harvestId);
        if (harvest) {
          harvest.crops = harvest.crops.filter(c => c.id !== action.payload.cropId);
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Admin actions
      .addCase(fetchAllProducers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProducers.fulfilled, (state, action) => {
        state.loading = false;
        state.producers = action.payload;
      })
      .addCase(fetchAllProducers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || action.error.message || 'Failed to fetch producers';
      })
      .addCase(fetchAdminDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardStats = action.payload;
      })
      .addCase(fetchAdminDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || action.error.message || 'Failed to fetch admin dashboard stats';
      })
      // Farmer actions
      .addCase(fetchMyFarms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyFarms.fulfilled, (state, action) => {
        state.loading = false;
        // Garantir que todas as propriedades tenham a estrutura correta
        state.myFarms = (action.payload ?? []).map(farm => ({
          ...farm,
          harvests: farm.harvests || []
        }));
      })
      .addCase(fetchMyFarms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || action.error.message || 'Failed to fetch farms';
      })
      .addCase(fetchFarmerDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFarmerDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardStats = action.payload;
      })
      .addCase(fetchFarmerDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || action.error.message || 'Failed to fetch farmer dashboard stats';
      })
      .addCase(createFarm.fulfilled, (state, action) => {
        // Garantir que a propriedade tenha a estrutura correta
        const newFarm = {
          ...action.payload,
          harvests: action.payload.harvests || []
        };
        state.myFarms.push(newFarm);
      })
      .addCase(updateFarm.fulfilled, (state, action) => {
        const index = state.myFarms.findIndex(f => f.id === action.payload.id);
        if (index !== -1) {
          state.myFarms[index] = action.payload;
        }
      })
      .addCase(deleteFarm.fulfilled, (state, action) => {
        state.myFarms = state.myFarms.filter(f => f.id !== action.payload);
      });
  },
});

export const {
  clearError,
  addHarvestToProperty,
  deleteHarvest,
  addCropToHarvest,
  deleteCrop,
} = producerSlice.actions;

export default producerSlice.reducer;