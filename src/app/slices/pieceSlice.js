import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pageSize: 10,
  pageIndex: 0,
};

const pieceSlice = createSlice({
  name: "piece",
  initialState,
  reducers: {
    setPiecePageSize: (state, action) => {
      state.pageSize = action.payload;
    },
    setPiecePageIndex: (state, action) => {
      state.pageIndex = action.payload;
    },
  },
});

export const { setPiecePageSize, setPiecePageIndex } = pieceSlice.actions;

export default pieceSlice.reducer;
