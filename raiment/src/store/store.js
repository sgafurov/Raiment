import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import imageSlice from "./imageSlice";

export const store = configureStore({
  reducer: {
    userSlice,
    imageSlice,
  },
});
