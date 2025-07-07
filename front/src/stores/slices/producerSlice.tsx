import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface Farm {
  id: string;
  name: string;
  city: string;
  state: string;
  totalArea: number;
  farmableArea: number;
  vegetationArea: number;
  crops: Crop[];
}

interface Crop {
  cropName: string;
  season: string;
}

interface Producer {
  id: string;
  document: string;
  name: string;
  farms: Farm[];
}

interface ProducerState {
  producers: Producer[];
}

const initialState: ProducerState = {
  producers: [],
};

const producerSlice = createSlice({
  name: "producer",
  initialState,
  reducers: {
    addProducer(state, action: PayloadAction<Producer>) {
      state.producers.push(action.payload);
    },
    editProducer(state, action: PayloadAction<Producer>) {
      const index = state.producers.findIndex(p => p.id === action.payload.id);
      if (index !== -1) state.producers[index] = action.payload;
    },
    deleteProducer(state, action: PayloadAction<string>) {
      state.producers = state.producers.filter(p => p.id !== action.payload);
    },
  },
});

export const { addProducer, editProducer, deleteProducer } = producerSlice.actions;
export default producerSlice.reducer;