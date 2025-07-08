import { combineReducers } from "@reduxjs/toolkit";
import producerReducer from "./producer/slice"

const rootReducer = combineReducers({ producerReducer })

export default rootReducer