import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null, 
  status: "idle",
  // username: "",
  // email: "",
  // isLoggedIn: false,
};

export const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
    // setUserInfo: (state, action) => {
    //   state.username = action.payload.username;
    //   state.email = action.payload.email;
    //   state.isLoggedIn = true;
    // },
    // setUsername: (state, action) => {
    //   state.username = action.payload;
    // },
    // setEmail: (state, action) => {
    //   state.email = action.payload;
    // },
    // setIsLoggedIn: (state, action) => {
    //   state.isLoggedIn = action.payload.isLoggedIn;
    // },
    // logoutUser: (state) => {
    //   state.username = "";
    //   state.email = "";
    //   state.isLoggedIn = false;
    // },
  },
});

export const {
  login,
  logout,
} = userSlice.actions;

export const selectUser = (state) => state.userSlice.user;

export default userSlice.reducer;
