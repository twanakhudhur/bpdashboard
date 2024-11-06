import { api } from "./api";
import { v4 as uuidv4 } from "uuid";

const slitApi = api.injectEndpoints({
  tagTypes: ["Slit"],
  endpoints: (builder) => ({
    fetchSlits: builder.query({
      query: ({ page = 1, pageSize = 10, searchValue = "", date }) =>
        `/slits?_page=${page}&_pageSize=${pageSize}&_searchValue=${searchValue}&_date=${date}`,
      providesTags: (result, error, { page }) =>
        result?.slits
          ? [
              ...result.slits.map((slit) => ({ type: "Slit", id: slit.id })),
              { type: "Slit", id: `PAGE_${page}` },
            ]
          : [{ type: "Slit", id: `PAGE_${page}` }],
    }),

    createSlit: builder.mutation({
      query: (newSlit) => ({
        url: "/slits/add",
        method: "POST",
        body: newSlit,
      }),
      async onQueryStarted(newSlit, { dispatch, queryFulfilled }) {
        const tempId = uuidv4();
        const optimisticSlit = {
          ...newSlit,
          id: tempId,
          createdAt: new Date().toISOString(),
        };
        // Apply optimistic update
        const patchResult = dispatch(
          slitApi.util.updateQueryData(
            "fetchSlits",
            { page: 1, searchValue: "" },
            (draft) => {
              draft.slits.unshift(optimisticSlit);
            }
          )
        );
        try {
          const { data } = await queryFulfilled;
          dispatch(
            slitApi.util.updateQueryData(
              "fetchSlits",
              { page: 1, searchValue: "" },
              (draft) => {
                const index = draft.slits.findIndex(
                  (slit) => slit.id === tempId
                );
                if (index !== -1) draft.slits[index] = { ...data, id: data.id };
              }
            )
          );
        } catch {
          patchResult.undo();
        }
      },
    }),
    updateSlit: builder.mutation({
      query: ({ id, ...updatedSlit }) => ({
        url: `/slits/update/${id}`,
        method: "PATCH",
        body: updatedSlit,
      }),
      async onQueryStarted(
        { id, ...updatedSlit },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          slitApi.util.updateQueryData(
            "fetchSlits",
            { page: 1, searchValue: "" },
            (draft) => {
              const existingSlit = draft.slits.find((slit) => slit.id === id);
              if (existingSlit) Object.assign(existingSlit, updatedSlit);
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    deleteSlit: builder.mutation({
      query: (id) => ({
        url: `/slits/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          slitApi.util.updateQueryData(
            "fetchSlits",
            { page: 1, searchValue: "" },
            (draft) => {
              draft.slits = draft.slits.filter((slit) => slit.id !== id);
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useFetchSlitsQuery,
  useCreateSlitMutation,
  useUpdateSlitMutation,
  useDeleteSlitMutation,
} = slitApi;
