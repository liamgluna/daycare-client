import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//     userInfo: localStorage.getItem('facultyInfo') ? JSON.parse(localStorage.getItem('facultyInfo')) : null,
// }

const initialState: { facultyInfo: any | null } = {
  facultyInfo: localStorage.getItem("facultyInfo")
    ? JSON.parse(localStorage.getItem("facultyInfo") as string)
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.facultyInfo = action.payload;
      localStorage.setItem("facultyInfo", JSON.stringify(action.payload));
    },
    logout: (state, action) => {
      state.facultyInfo = null;
      localStorage.removeItem("facultyInfo");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;