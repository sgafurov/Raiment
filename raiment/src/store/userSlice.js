import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  username: "",
  email: "",
  isLoggedIn: false,
};

export const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.isLoggedIn = true;
    },
    setUsername: (state, action) => {
      state.username = action.payload;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn;
    },
    logoutUser: (state) => {
      state.username = "";
      state.email = "";
      state.isLoggedIn = false;
    },
  },
});

export const {
  setUserInfo,
  setUsername,
  setEmail,
  setIsLoggedIn,
  logoutUser,
} = userSlice.actions;
export default userSlice.reducer;
