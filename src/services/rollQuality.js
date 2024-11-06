// src/services/rollQualitiesApi.js
import { v4 as uuidv4 } from "uuid";
import { api } from "./api";
import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";

const rollQualitiesAdapter = createEntityAdapter({
  sortComparer: (a, b) => a.quality.localeCompare(b.quality),
});
const initialState = rollQualitiesAdapter.getInitialState();

export const rollQualitiesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getRollQualities: builder.query({
      query: () => "/rollQualities",
      transformResponse: (responseData) =>
        rollQualitiesAdapter.setAll(initialState, responseData),
      providesTags: (result) =>
        result
          ? result.ids.map((id) => ({ type: "RollQuality", id }))
          : [{ type: "RollQuality", id: "LIST" }],
      refetchOnFocus: false,
      refetchOnReconnect: false,
    }),
    addRollQuality: builder.mutation({
      query: (newRollQuality) => ({
        url: "/rollquality/add",
        method: "POST",
        body: newRollQuality,
      }),

      async onQueryStarted(newRollQuality, { dispatch, queryFulfilled }) {
        const tempId = uuidv4();
        const tempRollQuality = { ...newRollQuality, id: tempId };

        const patchResult = dispatch(
          rollQualitiesApi.util.updateQueryData(
            "getRollQualities",
            undefined,
            (draft) => {
              rollQualitiesAdapter.addOne(draft, tempRollQuality);
            }
          )
        );

        try {
          const { data } = await queryFulfilled;
          dispatch(
            rollQualitiesApi.util.updateQueryData(
              "getRollQualities",
              undefined,
              (draft) => {
                rollQualitiesAdapter.updateOne(draft, {
                  id: tempId,
                  changes: { ...newRollQuality, id: data.id },
                });
              }
            )
          );
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: [{ type: "RollQuality", id: "LIST" }],
    }),
    // updateRollQuality: builder.mutation({
    //   query: ({ id, ...updatedQuality }) => {
    //     console.log(id);
    //     return {
    //       url: `/rollquality/update/${id}`,
    //       method: "PATCH",
    //       body: updatedQuality,
    //     };
    //   },
    //   async onQueryStarted(
    //     { id, ...updatedQuality },
    //     { dispatch, queryFulfilled }
    //   ) {
    //     const patchResult = dispatch(
    //       rollQualitiesApi.util.updateQueryData(
    //         "getRollQualities",
    //         undefined,
    //         (draft) => {
    //           rollQualitiesAdapter.updateOne(draft, { id, changes: updatedQuality });
    //         }
    //       )
    //     );

    //     try {
    //       await queryFulfilled;
    //     } catch {
    //       patchResult.undo();
    //     }
    //   },
    //   invalidatesTags: [{ type: "Quality", id: "LIST" }],
    // }),
    deleteRollQuality: builder.mutation({
      query: (id) => ({
        url: `/rollquality/delete/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          rollQualitiesApi.util.updateQueryData(
            "getRollQualities",
            undefined,
            (draft) => {
              rollQualitiesAdapter.removeOne(draft, id);
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: [{ type: "RollQuality", id: "LIST" }],
    }),
  }),
});

export const {
  useGetRollQualitiesQuery,
  useAddRollQualityMutation,
  // useUpdateRollQualityMutation,
  useDeleteRollQualityMutation,
} = rollQualitiesApi;

export const selectRollQualitiesResult =
  rollQualitiesApi.endpoints.getRollQualities.select();

const selectRollQualitiesData = createSelector(
  selectRollQualitiesResult,
  (rollQualitiesResult) => rollQualitiesResult.data ?? initialState
);

// Entity selectors for normalized rollQualities
export const { selectAll: selectAllRollQualities } =
  rollQualitiesAdapter.getSelectors((state) => selectRollQualitiesData(state));
