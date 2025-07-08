import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

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
  vegetation_area_ha: number;
  harvests: Harvest[];
}

export interface Producer {
  id: string;
  document: string;
  document_type: 'CPF' | 'CNPJ';
  producer_name: string;
  farms: Farm[];
}

export interface ProducerState {
  producers: Producer[];
  loading: boolean;
}

// Dados mockados para demonstração
const mockProducers: Producer[] = [
  {
    id: '1',
    document: '123.456.789-01',
    document_type: 'CPF',
    producer_name: 'João Silva',
    farms: [
      {
        id: '1',
        farm_name: 'Fazenda São João',
        city: 'Ribeirão Preto',
        state: 'SP',
        total_area_ha: 1000,
        arable_area_ha: 800,
        vegetation_area_ha: 200,
        harvests: [
          {
            id: '1',
            name: 'Safra 2023',
            year: 2023,
            total_area_ha: 400,
            crops: [
              { id: '1', name: 'Soja', planted_area_ha: 250 },
              { id: '2', name: 'Milho', planted_area_ha: 150 }
            ]
          }
        ]
      }
    ]
  },
  {
    id: '2',
    document: '12.345.678/0001-90',
    document_type: 'CNPJ',
    producer_name: 'Agropecuária Brasil Ltda',
    farms: [
      {
        id: '2',
        farm_name: 'Fazenda Vista Alegre',
        city: 'Goiânia',
        state: 'GO',
        total_area_ha: 2500,
        arable_area_ha: 2000,
        vegetation_area_ha: 500,
        harvests: [
          {
            id: '2',
            name: 'Safra 2023',
            year: 2023,
            total_area_ha: 1500,
            crops: [
              { id: '3', name: 'Soja', planted_area_ha: 800 },
              { id: '4', name: 'Café', planted_area_ha: 700 }
            ]
          }
        ]
      },
      {
        id: '3',
        farm_name: 'Fazenda Nova Era',
        city: 'Anápolis',
        state: 'GO',
        total_area_ha: 800,
        arable_area_ha: 600,
        vegetation_area_ha: 200,
        harvests: [
          {
            id: '3',
            name: 'Safra 2023',
            year: 2023,
            total_area_ha: 300,
            crops: [
              { id: '5', name: 'Milho', planted_area_ha: 300 }
            ]
          }
        ]
      }
    ]
  },
  {
    id: '3',
    document: '987.654.321-00',
    document_type: 'CPF',
    producer_name: 'Maria Santos',
    farms: [
      {
        id: '4',
        farm_name: 'Sítio Esperança',
        city: 'Uberlândia',
        state: 'MG',
        total_area_ha: 150,
        arable_area_ha: 100,
        vegetation_area_ha: 50,
        harvests: [
          {
            id: '4',
            name: 'Safra 2023',
            year: 2023,
            total_area_ha: 80,
            crops: [
              { id: '6', name: 'Café', planted_area_ha: 80 }
            ]
          }
        ]
      }
    ]
  }
];

const initialState: ProducerState = {
  producers: mockProducers,
  loading: false,
};

const producerSlice = createSlice({
  name: "producer",
  initialState,
  reducers: {
    setProducers: (state, action: PayloadAction<Producer[]>) => {
      state.producers = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    addProducer: (state, action: PayloadAction<Producer>) => {
      state.producers.push(action.payload);
    },
    updateProducer: (state, action: PayloadAction<Producer>) => {
      const index = state.producers.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.producers[index] = action.payload;
      }
    },
    removeProducer: (state, action: PayloadAction<string>) => {
      state.producers = state.producers.filter(p => p.id !== action.payload);
    },
    addFarmToProducer: (state, action: PayloadAction<{ producerId: string; farm: Farm }>) => {
      const producer = state.producers.find(p => p.id === action.payload.producerId);
      if (producer) {
        producer.farms.push(action.payload.farm);
      }
    },
    updateFarm: (state, action: PayloadAction<{ producerId: string; farm: Farm }>) => {
      const producer = state.producers.find(p => p.id === action.payload.producerId);
      if (producer) {
        const farmIndex = producer.farms.findIndex(f => f.id === action.payload.farm.id);
        if (farmIndex !== -1) {
          producer.farms[farmIndex] = action.payload.farm;
        }
      }
    },
    removeFarm: (state, action: PayloadAction<{ producerId: string; farmId: string }>) => {
      const producer = state.producers.find(p => p.id === action.payload.producerId);
      if (producer) {
        producer.farms = producer.farms.filter(f => f.id !== action.payload.farmId);
      }
    },
    addHarvestToProperty: (state, action: PayloadAction<{ propertyId: string; harvest: { name: string; total_area_ha: number } }>) => {
      for (const producer of state.producers) {
        const farm = producer.farms.find(f => f.id === action.payload.propertyId);
        if (farm) {
          const newHarvest: Harvest = {
            id: Date.now().toString(),
            name: action.payload.harvest.name,
            year: new Date().getFullYear(),
            total_area_ha: action.payload.harvest.total_area_ha,
            crops: []
          };
          farm.harvests.push(newHarvest);
          break;
        }
      }
    },
    deleteHarvest: (state, action: PayloadAction<{ propertyId: string; harvestId: string }>) => {
      for (const producer of state.producers) {
        const farm = producer.farms.find(f => f.id === action.payload.propertyId);
        if (farm) {
          farm.harvests = farm.harvests.filter(h => h.id !== action.payload.harvestId);
          break;
        }
      }
    },
    addCropToHarvest: (state, action: PayloadAction<{ propertyId: string; harvestId: string; crop: { name: string; planted_area_ha: number } }>) => {
      for (const producer of state.producers) {
        const farm = producer.farms.find(f => f.id === action.payload.propertyId);
        if (farm) {
          const harvest = farm.harvests.find(h => h.id === action.payload.harvestId);
          if (harvest) {
            const newCrop: Crop = {
              id: Date.now().toString(),
              name: action.payload.crop.name,
              planted_area_ha: action.payload.crop.planted_area_ha
            };
            harvest.crops.push(newCrop);
            break;
          }
        }
      }
    },
    deleteCrop: (state, action: PayloadAction<{ propertyId: string; harvestId: string; cropId: string }>) => {
      for (const producer of state.producers) {
        const farm = producer.farms.find(f => f.id === action.payload.propertyId);
        if (farm) {
          const harvest = farm.harvests.find(h => h.id === action.payload.harvestId);
          if (harvest) {
            harvest.crops = harvest.crops.filter(c => c.id !== action.payload.cropId);
            break;
          }
        }
      }
    },
  },
});

export const {
  setProducers,
  setLoading,
  addProducer,
  updateProducer,
  removeProducer,
  addFarmToProducer,
  updateFarm,
  removeFarm,
  addHarvestToProperty,
  deleteHarvest,
  addCropToHarvest,
  deleteCrop,
} = producerSlice.actions;

export default producerSlice.reducer;