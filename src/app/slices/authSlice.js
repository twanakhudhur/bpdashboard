// src/features/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null,
  },
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload; // Set error message
    },
    clearError: (state) => {
      state.error = null; // Clear error
    },
  },
});

export const {
  setCredentials,
  clearCredentials,
  setLoading,
  setError,
  clearError,
} = authSlice.actions;
export default authSlice.reducer;
