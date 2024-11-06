import { clearCredentials } from "@/app/slices/authSlice";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const handleErrors = (error, dispatch) => {
  if (error.status === 401) {
    dispatch(clearCredentials());
  } else if (error.status === 403) {
    console.log("Error 403: Forbidden - Access denied message.");
  } else {
    console.log("An unexpected error occurred.");
    console.log(error);
  }
};

const baseQuery = async (args, api, extraOptions) => {
  const result = await fetchBaseQuery({
    baseUrl: "http://localhost:3000/api",
    credentials: "include",
  })(args, api, extraOptions);
  const dispatch = api.dispatch;

  if (result.error) {
    console.log(result.error);

    handleErrors(result.error, dispatch);
  }

  return result;
};

export const api = createApi({
  baseQuery,
  endpoints: () => ({}),
  refetchOnFocus: false,
  refetchOnReconnect: false,
});
