// src/services/wastesApi.js
import { api } from "./api";
import { v4 as uuidv4 } from "uuid";

export const wastesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getWastes: builder.query({
      query: ({ page, pageSize }) =>
        `/wastes?_page=${page}&_pageSize=${pageSize}`,
      transformResponse: (responseData) => responseData,
      providesTags: (result) =>
        result
          ? result.wastes.map((waste) => ({ type: "Waste", id: waste.id }))
          : [{ type: "Waste", id: "LIST" }],
      refetchOnFocus: true,
      refetchOnReconnect: true,
      refetchOnMountOrArgChange: true,
      keepUnusedDataFor: 1,
    }),

    addWaste: builder.mutation({
      query: (newWaste) => ({
        url: "/wastes/add",
        method: "POST",
        body: newWaste,
      }),
      async onQueryStarted(newWaste, { dispatch, queryFulfilled }) {
        const tempId = uuidv4();
        const wasteWithDate = {
          ...newWaste,
          id: tempId,
          createdAt: new Date().toISOString(),
        };

        const patchResult = dispatch(
          wastesApi.util.updateQueryData(
            "getWastes",
            { page: 1, pageSize: 5 }, // or your current page
            (draft) => {
              draft.wastes.unshift(wasteWithDate);
              draft.pagination.totalCount += 1;
              draft.pagination.totalPages = Math.ceil(
                draft.pagination.totalCount / draft.pagination.pageSize
              );
            }
          )
        );

        try {
          const { data } = await queryFulfilled;
          dispatch(
            wastesApi.util.updateQueryData(
              "getWastes",
              { page: 1, pageSize: 5 },
              (draft) => {
                const index = draft.wastes.findIndex(
                  (item) => item.id === tempId
                );
                if (index !== -1) {
                  draft.wastes[index] = data;
                }
              }
            )
          );
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: [{ type: "Waste", id: "LIST" }],
    }),

    updateWaste: builder.mutation({
      query: ({ id, ...updatedWaste }) => ({
        url: `/wastes/update/${id}`,
        method: "PATCH",
        body: updatedWaste,
      }),
      async onQueryStarted(
        { id, ...updatedWaste },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          wastesApi.util.updateQueryData(
            "getWastes",
            { page: 1, pageSize: 5 },
            (draft) => {
              const waste = draft.waste.find((item) => item.id === id);
              if (waste) {
                Object.assign(waste, updatedWaste);
              }
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: (result, error, { id }) => [{ type: "Waste", id }],
    }),

    deleteWaste: builder.mutation({
      query: (id) => ({
        url: `/wastes/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          wastesApi.util.updateQueryData(
            "getWastes",
            { page: 1, pageSize: 5 },
            (draft) => {
              draft.wastes = draft.wastes.filter((waste) => waste.id !== id);
              draft.pagination.totalCount -= 1;
              draft.pagination.totalPages = Math.ceil(
                draft.pagination.totalCount / draft.pagination.pageSize
              );
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: [{ type: "Waste", id: "LIST" }],
    }),
  }),
});

export const {
  useGetWastesQuery,
  useAddWasteMutation,
  useUpdateWasteMutation,
  useDeleteWasteMutation,
} = wastesApi;
