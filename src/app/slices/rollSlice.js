import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pageSize: 10,
  pageIndex: 0,
};

const rollSlice = createSlice({
  name: "roll",
  initialState,
  reducers: {
    setRollPageSize: (state, action) => {
      state.pageSize = action.payload;
    },
    setRollPageIndex: (state, action) => {
      state.pageIndex = action.payload;
    },
  },
});

export const { setRollPageSize, setRollPageIndex } = rollSlice.actions;

export default rollSlice.reducer;
