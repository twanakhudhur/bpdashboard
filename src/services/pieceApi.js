// src/services/piecesApi.js
import { api } from "./api";
import { v4 as uuidv4 } from "uuid";
import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";

const piecesAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt),
});
const initialState = piecesAdapter.getInitialState();

export const piecesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPieces: builder.query({
      query: () => "/pieces",
      transformResponse: (responseData) =>
        piecesAdapter.setAll(initialState, responseData),
      providesTags: (result) =>
        result
          ? result.ids.map((id) => ({ type: "Piece", id }))
          : [{ type: "Piece", id: "LIST" }],
      refetchOnFocus: false,
      refetchOnReconnect: false,
    }),
    addPiece: builder.mutation({
      query: (newPiece) => ({
        url: "/pieces/add",
        method: "POST",
        body: newPiece,
      }),

      async onQueryStarted(newPiece, { dispatch, queryFulfilled }) {
        const tempId = uuidv4();
        const pieceWithDate = {
          ...newPiece,
          id: tempId,
          createdAt: new Date().toISOString(),
        };

        const patchResult = dispatch(
          piecesApi.util.updateQueryData("getPieces", undefined, (draft) => {
            piecesAdapter.addOne(draft, pieceWithDate);
          })
        );

        try {
          const { data } = await queryFulfilled;
          dispatch(
            piecesApi.util.updateQueryData("getPieces", undefined, (draft) => {
              piecesAdapter.updateOne(draft, {
                id: tempId,
                changes: { ...pieceWithDate, id: data.id },
              });
            })
          );
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: [{ type: "Piece", id: "LIST" }],
    }),
    updatePiece: builder.mutation({
      query: ({ id, ...updatedPiece }) => {
        return {
          url: `/pieces/update/${id}`,
          method: "PATCH",
          body: updatedPiece,
        };
      },
      async onQueryStarted(
        { id, ...updatedPiece },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          piecesApi.util.updateQueryData("getPieces", undefined, (draft) => {
            piecesAdapter.updateOne(draft, { id, changes: updatedPiece });
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: (result, error, { id }) => [{ type: "Piece", id }],
    }),
    deletePiece: builder.mutation({
      query: (id) => ({
        url: `/pieces/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          piecesApi.util.updateQueryData("getPieces", undefined, (draft) => {
            piecesAdapter.removeOne(draft, id);
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: (result, error, { id }) => [{ type: "Piece", id }],
    }),
  }),
});

export const {
  useGetPiecesQuery,
  useAddPieceMutation,
  useUpdatePieceMutation,
  useDeletePieceMutation,
} = piecesApi;

export const selectPiecesResult = piecesApi.endpoints.getPieces.select();

const selectPiecesData = createSelector(
  selectPiecesResult,
  (piecesResult) => piecesResult.data ?? initialState
);

// Entity selectors for normalized pieces
export const { selectAll: selectAllPieces } = piecesAdapter.getSelectors(
  (state) => selectPiecesData(state)
);
