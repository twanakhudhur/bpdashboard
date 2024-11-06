// src/services/countriesApi.js
import { v4 as uuidv4 } from "uuid";
import { api } from "./api";
import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";

const countriesAdapter = createEntityAdapter({
  sortComparer: (a, b) => a.country.localeCompare(b.country),
});
const initialState = countriesAdapter.getInitialState();

export const countriesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCountries: builder.query({
      query: () => "/countries",
      transformResponse: (responseData) =>
        countriesAdapter.setAll(initialState, responseData),
      providesTags: (result) =>
        result
          ? result.ids.map((id) => ({ type: "Country", id }))
          : [{ type: "Country", id: "LIST" }],
      refetchOnFocus: false,
      refetchOnReconnect: false,
    }),
    addCountry: builder.mutation({
      query: (newCountry) => ({
        url: "/country/add",
        method: "POST",
        body: newCountry,
      }),

      async onQueryStarted(newCountry, { dispatch, queryFulfilled }) {
        const tempId = uuidv4();
        const tempcountry = { ...newCountry, id: tempId };
        const patchResult = dispatch(
          countriesApi.util.updateQueryData(
            "getCountries",
            undefined,
            (draft) => {
              countriesAdapter.addOne(draft, tempcountry);
            }
          )
        );

        try {
          const { data } = await queryFulfilled;
          dispatch(
            countriesApi.util.updateQueryData(
              "getCountries",
              undefined,
              (draft) => {
                countriesAdapter.updateOne(draft, {
                  id: tempId,
                  changes: { ...newCountry, id: data.id },
                });
              }
            )
          );
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: [{ type: "Country", id: "LIST" }],
    }),
    // updateCountry: builder.mutation({
    //   query: ({ id, ...updatedCountry }) => {
    //     console.log(id);
    //     return {
    //       url: `/country/update/${id}`,
    //       method: "PATCH",
    //       body: updatedCountry,
    //     };
    //   },
    //   async onQueryStarted(
    //     { id, ...updatedCountry },
    //     { dispatch, queryFulfilled }
    //   ) {
    //     const patchResult = dispatch(
    //       countriesApi.util.updateQueryData(
    //         "getCountries",
    //         undefined,
    //         (draft) => {
    //           countriesAdapter.updateOne(draft, { id, changes: updatedCountry });
    //         }
    //       )
    //     );

    //     try {
    //       await queryFulfilled;
    //     } catch {
    //       patchResult.undo();
    //     }
    //   },
    //   invalidatesTags: [{ type: "Country", id: "LIST" }],
    // }),
    deleteCountry: builder.mutation({
      query: (id) => ({
        url: `/country/delete/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          countriesApi.util.updateQueryData(
            "getCountries",
            undefined,
            (draft) => {
              countriesAdapter.removeOne(draft, id);
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: [{ type: "Country", id: "LIST" }],
    }),
  }),
});

export const {
  useGetCountriesQuery,
  useAddCountryMutation,
  // useUpdateCountryMutation,
  useDeleteCountryMutation,
} = countriesApi;

export const selectCountriesResult =
  countriesApi.endpoints.getCountries.select();

const selectCountriesData = createSelector(
  selectCountriesResult,
  (countriesResult) => countriesResult.data ?? initialState
);

// Entity selectors for normalized countries
export const { selectAll: selectAllCountries } = countriesAdapter.getSelectors(
  (state) => selectCountriesData(state)
);
