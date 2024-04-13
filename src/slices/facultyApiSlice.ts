import { apiSlice } from "./apiSlice";

const FACULTY_URL = "/faculty";

export const facultyApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: `${FACULTY_URL}/login`,
        method: "POST",
        body: credentials,
      }),
    }),
    signup: builder.mutation({
      query: (credentials) => ({
        url: `${FACULTY_URL}`,
        method: "POST",
        body: credentials,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${FACULTY_URL}/logout`,
        method: "POST",
      }),
    }),
    updateFaculty: builder.mutation({
      query: (credentials) => ({
        url: `${FACULTY_URL}/profile`,
        method: "PATCH",
        body: credentials,
      }),
    }),
    addClass: builder.mutation({
      query: (credentials) => ({
        url: `/classes`,
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const { useLoginMutation, useSignupMutation ,useLogoutMutation, useUpdateFacultyMutation, useAddClassMutation } = facultyApiSlice;
