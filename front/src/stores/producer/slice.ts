import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
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

// Async thunks for harvests
export const createHarvest = createAsyncThunk(
  'producer/createHarvest',
  async ({ propertyId, harvest }: { propertyId: string; harvest: { name: string; total_area_ha: number } }, { rejectWithValue, dispatch }) => {
    try {
      await apiService.createHarvest(propertyId, harvest);
      // Recarregar as propriedades para obter dados atualizados
      dispatch(fetchMyFarms());
      return { propertyId, harvest };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeHarvest = createAsyncThunk(
  'producer/removeHarvest',
  async ({ propertyId, harvestId }: { propertyId: string; harvestId: string }, { rejectWithValue, dispatch }) => {
    try {
      await apiService.removeHarvest(propertyId, harvestId);
      // Recarregar as propriedades para obter dados atualizados
      dispatch(fetchMyFarms());
      return { propertyId, harvestId };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunks for crops
export const createCrop = createAsyncThunk(
  'producer/createCrop',
  async ({ propertyId, harvestId, crop }: { propertyId: string; harvestId: string; crop: { name: string; planted_area_ha: number } }, { rejectWithValue, dispatch }) => {
    try {
      await apiService.createCrop(propertyId, harvestId, crop);
      // Recarregar as propriedades para obter dados atualizados
      dispatch(fetchMyFarms());
      return { propertyId, harvestId, crop };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeCrop = createAsyncThunk(
  'producer/removeCrop',
  async ({ propertyId, harvestId, cropId }: { propertyId: string; harvestId: string; cropId: string }, { rejectWithValue, dispatch }) => {
    try {
      await apiService.deleteCrop(propertyId, harvestId, cropId);
      // Recarregar as propriedades para obter dados atualizados
      dispatch(fetchMyFarms());
      return { propertyId, harvestId, cropId };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const producerSlice = createSlice({
  name: "producer",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Note: Removidas as actions locais não utilizadas: addHarvestToProperty, deleteHarvest, addCropToHarvest, deleteCrop
    // Agora usamos apenas os async thunks para persistir no backend
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
    // Note: Removidos os handlers locais para harvest/crop pois estamos recarregando dados via fetchMyFarms
  },
});

export const {
  clearError,
} = producerSlice.actions;

export default producerSlice.reducer;