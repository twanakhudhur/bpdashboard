// src/services/linesApi.js
import { v4 as uuidv4 } from "uuid";
import { api } from "./api";
import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";

const linesAdapter = createEntityAdapter({
  sortComparer: (a, b) => a.line.localeCompare(b.line),
});
const initialState = linesAdapter.getInitialState();

export const linesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getLines: builder.query({
      query: () => "/lines",
      transformResponse: (responseData) =>
        linesAdapter.setAll(initialState, responseData),
      providesTags: (result) =>
        result
          ? result.ids.map((id) => ({ type: "Line", id }))
          : [{ type: "Line", id: "LIST" }],
      refetchOnFocus: false,
      refetchOnReconnect: false,
    }),
    addLine: builder.mutation({
      query: (newLine) => ({
        url: "/line/add",
        method: "POST",
        body: newLine,
      }),

      async onQueryStarted(newLine, { dispatch, queryFulfilled }) {
        const tempId = uuidv4();
        const tempLine = { ...newLine, id: tempId };

        const patchResult = dispatch(
          linesApi.util.updateQueryData("getLines", undefined, (draft) => {
            linesAdapter.addOne(draft, tempLine);
          })
        );

        try {
          const { data } = await queryFulfilled;
          dispatch(
            linesApi.util.updateQueryData("getLines", undefined, (draft) => {
              linesAdapter.updateOne(draft, {
                id: tempId,
                changes: { ...newLine, id: data.id },
              });
            })
          );
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: [{ type: "Line", id: "LIST" }],
    }),
    deleteLine: builder.mutation({
      query: (id) => ({
        url: `/line/delete/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          linesApi.util.updateQueryData("getLines", undefined, (draft) => {
            linesAdapter.removeOne(draft, id);
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: [{ type: "Line", id: "LIST" }],
    }),
  }),
});

export const { useGetLinesQuery, useAddLineMutation, useDeleteLineMutation } =
  linesApi;

export const selectLinesResult = linesApi.endpoints.getLines.select();

const selectLinesData = createSelector(
  selectLinesResult,
  (linesResult) => linesResult.data ?? initialState
);

export const { selectAll: selectAllLines } = linesAdapter.getSelectors(
  (state) => selectLinesData(state)
);
