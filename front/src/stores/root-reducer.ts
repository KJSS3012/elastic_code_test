import { combineReducers } from "@reduxjs/toolkit";
import producerReducer from "./producer/slice";
import authReducer from "./auth/slice";

const rootReducer = combineReducers({
  producerReducer,
  authReducer
});

export default rootReducer;