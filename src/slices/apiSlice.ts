import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8080",
  credentials: "include",
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ["Faculty"],
  endpoints: () => ({}),
});
