// src/services/rollTypesApi.js
import { v4 as uuidv4 } from "uuid";
import { api } from "./api";
import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";

const rollTypesAdapter = createEntityAdapter({
  sortComparer: (a, b) => a.type.localeCompare(b.type),
});
const initialState = rollTypesAdapter.getInitialState();

export const rollTypesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getRollTypes: builder.query({
      query: () => "/rollTypes",
      transformResponse: (responseData) =>
        rollTypesAdapter.setAll(initialState, responseData),
      providesTags: (result) =>
        result
          ? result.ids.map((id) => ({ type: "RollType", id }))
          : [{ type: "RollType", id: "LIST" }],
      refetchOnFocus: false,
      refetchOnReconnect: false,
    }),
    addRollType: builder.mutation({
      query: (newRollType) => ({
        url: "/rolltype/add",
        method: "POST",
        body: newRollType,
      }),

      async onQueryStarted(newRollType, { dispatch, queryFulfilled }) {
        const tempId = uuidv4();
        const tempRollType = { ...newRollType, id: tempId };

        const patchResult = dispatch(
          rollTypesApi.util.updateQueryData(
            "getRollTypes",
            undefined,
            (draft) => {
              rollTypesAdapter.addOne(draft, tempRollType);
            }
          )
        );

        try {
          const { data } = await queryFulfilled;
          dispatch(
            rollTypesApi.util.updateQueryData(
              "getRollTypes",
              undefined,
              (draft) => {
                rollTypesAdapter.updateOne(draft, {
                  id: tempId,
                  changes: { ...newRollType, id: data.id },
                });
              }
            )
          );
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: [{ type: "RollType", id: "LIST" }],
    }),
    deleteRollType: builder.mutation({
      query: (id) => ({
        url: `/rolltype/delete/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          rollTypesApi.util.updateQueryData(
            "getRollTypes",
            undefined,
            (draft) => {
              rollTypesAdapter.removeOne(draft, id);
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: [{ type: "RollType", id: "LIST" }],
    }),
  }),
});

export const {
  useGetRollTypesQuery,
  useAddRollTypeMutation,
  useDeleteRollTypeMutation,
} = rollTypesApi;

export const selectRollTypesResult =
  rollTypesApi.endpoints.getRollTypes.select();

const selectRollTypesData = createSelector(
  selectRollTypesResult,
  (rollTypesResult) => rollTypesResult.data ?? initialState
);

export const { selectAll: selectAllRollTypes } = rollTypesAdapter.getSelectors(
  (state) => selectRollTypesData(state)
);
