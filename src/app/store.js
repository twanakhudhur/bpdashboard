// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import { api } from "../services/api";
import authReducer from "./slices/authSlice";
import rollReducer from "./slices/rollSlice";
import pieceReducer from "./slices/pieceSlice";
import wasteReducer from "./slices/wasteSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    roll: rollReducer,
    piece: pieceReducer,
    waste: wasteReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export default store;
