// src/services/usersApi.js
import { api } from "./api";
import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";

const usersAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt),
});
const initialState = usersAdapter.getInitialState();

export const usersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => "/users",
      transformResponse: (responseData) =>
        usersAdapter.setAll(initialState, responseData),
      providesTags: (result) =>
        result
          ? result.ids.map((id) => ({ type: "User", id }))
          : [{ type: "User", id: "LIST" }],
      refetchOnFocus: false,
      refetchOnReconnect: false,
    }),
    addUser: builder.mutation({
      query: (newUser) => ({
        url: "/users/add",
        method: "POST",
        body: newUser,
      }),

      async onQueryStarted(newUser, { dispatch, queryFulfilled }) {
        const userWithDate = {
          ...newUser,
          createdAt: new Date().toISOString(),
          isFrozen: false,
        };

        const patchResult = dispatch(
          usersApi.util.updateQueryData("getUsers", undefined, (draft) => {
            usersAdapter.addOne(draft, userWithDate);
          })
        );

        try {
          const { data } = await queryFulfilled;
          dispatch(
            usersApi.util.updateQueryData("getUsers", undefined, (draft) => {
              usersAdapter.updateOne(draft, {
                id: data.id,
                changes: { ...userWithDate, id: data.user.id },
              });
            })
          );
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...updatedUser }) => {
        console.log(id);
        return {
          url: `/users/update/${id}`,
          method: "PATCH",
          body: updatedUser,
        };
      },
      async onQueryStarted(
        { id, ...updatedUser },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          usersApi.util.updateQueryData("getUsers", undefined, (draft) => {
            usersAdapter.updateOne(draft, { id, changes: updatedUser });
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/delete/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          usersApi.util.updateQueryData("getUsers", undefined, (draft) => {
            usersAdapter.removeOne(draft, id);
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi;

export const selectUsersResult = usersApi.endpoints.getUsers.select();

const selectUsersData = createSelector(
  selectUsersResult,
  (usersResult) => usersResult.data ?? initialState
);

// Entity selectors for normalized users
export const { selectAll: selectAllUsers } = usersAdapter.getSelectors(
  (state) => selectUsersData(state)
);
