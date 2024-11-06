/* eslint-disable no-unused-vars */
// src/api/authApi.js
import { api } from "./api"; // Import your reusable api slice
import {
  setCredentials,
  clearCredentials,
  setLoading,
  setError,
} from "../app/slices/authSlice";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data.user));
        } catch (error) {
          dispatch(setError("Login failed. Please check your credentials."));
        }
      },
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(clearCredentials());
          dispatch(api.util.resetApiState());
          window.location.reload();
        } catch (error) {
          dispatch(setError("Logout failed. Please try again."));
        }
      },
    }),
    getCurrentUser: builder.query({
      query: () => "/users/me",
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        dispatch(setLoading(true));
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data));
        } catch (error) {
          dispatch(clearCredentials());
        } finally {
          dispatch(setLoading(false));
        }
      },
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation, useGetCurrentUserQuery } =
  authApi;
