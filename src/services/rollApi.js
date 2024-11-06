// src/services/rollsApi.js
import { api } from "./api";
import { v4 as uuidv4 } from "uuid";
import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";

const rollsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt),
});
const initialState = rollsAdapter.getInitialState();

export const rollsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getRolls: builder.query({
      query: () => "/rolls",
      transformResponse: (responseData) =>
        rollsAdapter.setAll(initialState, responseData),
      providesTags: (result) =>
        result
          ? result.ids.map((id) => ({ type: "Roll", id }))
          : [{ type: "Roll", id: "LIST" }],
      refetchOnFocus: false,
      refetchOnReconnect: false,
    }),
    addRoll: builder.mutation({
      query: (newRoll) => ({
        url: "/rolls/add",
        method: "POST",
        body: newRoll,
      }),

      async onQueryStarted(newRoll, { dispatch, queryFulfilled }) {
        const tempId = uuidv4();
        const rollWithDate = {
          ...newRoll,
          id: tempId,
          createdAt: new Date().toISOString(),
        };

        const patchResult = dispatch(
          rollsApi.util.updateQueryData("getRolls", undefined, (draft) => {
            rollsAdapter.addOne(draft, rollWithDate);
          })
        );

        try {
          const { data } = await queryFulfilled;
          dispatch(
            rollsApi.util.updateQueryData("getRolls", undefined, (draft) => {
              rollsAdapter.updateOne(draft, {
                id: tempId,
                changes: { ...rollWithDate, id: data.id },
              });
            })
          );
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: [{ type: "Roll", id: "LIST" }],
    }),
    updateRoll: builder.mutation({
      query: ({ id, ...updatedRoll }) => {
        return {
          url: `/rolls/update/${id}`,
          method: "PATCH",
          body: updatedRoll,
        };
      },
      async onQueryStarted(
        { id, ...updatedRoll },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          rollsApi.util.updateQueryData("getRolls", undefined, (draft) => {
            rollsAdapter.updateOne(draft, { id, changes: updatedRoll });
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: (result, error, { id }) => [{ type: "Roll", id }],
    }),
    deleteRoll: builder.mutation({
      query: (id) => ({
        url: `/rolls/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          rollsApi.util.updateQueryData("getRolls", undefined, (draft) => {
            rollsAdapter.removeOne(draft, id);
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: (result, error, { id }) => [{ type: "Roll", id }],
    }),
  }),
});

export const {
  useGetRollsQuery,
  useAddRollMutation,
  useUpdateRollMutation,
  useDeleteRollMutation,
} = rollsApi;

export const selectRollsResult = rollsApi.endpoints.getRolls.select();

const selectRollsData = createSelector(
  selectRollsResult,
  (rollsResult) => rollsResult.data ?? initialState
);

// Entity selectors for normalized rolls
export const { selectAll: selectAllRolls } = rollsAdapter.getSelectors(
  (state) => selectRollsData(state)
);
