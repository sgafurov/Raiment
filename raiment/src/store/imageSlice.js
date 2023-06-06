import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  imageURL: null,
};

export const imageSlice = createSlice({
  name: "imageSlice",
  initialState,
  reducers: {
    setImageURL: (state, action) => {
      state.imageURL = action.payload;
    },
  },
});

export const { setImageURL } = imageSlice.actions;

export default imageSlice.reducer;
