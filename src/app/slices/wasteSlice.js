import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pageSize: 5,
  pageIndex: 1,
};

const wasteSlice = createSlice({
  name: "waste",
  initialState,
  reducers: {
    setWastePageSize: (state, action) => {
      state.pageSize = action.payload;
    },
    setWastePageIndex: (state, action) => {
      state.pageIndex = action.payload;
    },
  },
});

export const { setWastePageSize, setWastePageIndex } = wasteSlice.actions;

export default wasteSlice.reducer;
