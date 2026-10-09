// import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

// const initialState: CartState = {
//   order: [],
//   loading: false,
// };


// export const fetchorder = createAsyncThunk(
//   "order/fetchAllorders",
//   async (userId: string) => {
//     const res = await fetch(`/api/orders`);
//     return (await res.json()) as any;
//   }
// );

// const orderSlice = createSlice({
//   name: "order",
//   initialState,
//   reducers: {
//     clearorder: (state) => {
//       state.order = [];
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchorder.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchorder.fulfilled, (state, action: PayloadAction<orderItem[]>) => {
//         state.loading = false;
//         state.order = action.payload;
//       })
//   },
// });

// export const { clearorder } = orderSlice.actions;
// export default orderSlice.reducer;