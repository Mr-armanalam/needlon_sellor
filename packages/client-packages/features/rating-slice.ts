import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export type RatingProps = {
  comment: string;
  id: string;
  productId: string;
  rating: number;
  updatedAt: Date;
  userId: string;
  userName: string;
  orderItemId?: string;
};

type RatingState = {
  allRating: RatingProps[];
  rating: number;
  hover: number;
  comment: string;
  loading: boolean;
};

const initialState: RatingState = {
  allRating: [],
  rating: 0,
  hover: 0,
  comment: "",
  loading: false,
};

// FETCH ALL REVIEWS
export const fetchProductReview = createAsyncThunk(
  "rating/fetchProductReview",
  async () => {
    const response = await fetch("/api/orders/review");
    const result = await response.json();
    return result.allreview;
  }
);

export const submitReview = createAsyncThunk(
  "rating/submitReview",
  async (payload: {
    productId: string;
    orderItemId: string;
    rating: number;
    comment: string;
  }) => {
    const res = await fetch("/api/orders/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Failed to submit");

    return await res.json(); // returns { review, orderItemId }
  }
);

const ratingSlice = createSlice({
  name: "rating",
  initialState,
  reducers: {
    setRating: (state, action: PayloadAction<number>) => {
      state.rating = action.payload;
    },
    setHover: (state, action: PayloadAction<number>) => {
      state.hover = action.payload;
    },
    setComment: (state, action: PayloadAction<string>) => {
      state.comment = action.payload;
    },
    clearRatingState: (state) => {
      state.rating = 0;
      state.hover = 0;
      state.comment = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductReview.fulfilled, (state, action) => {
        state.loading = false;
        state.allRating = action.payload;
      })
      .addCase(fetchProductReview.rejected, (state) => {
        state.loading = false;
      })
      .addCase(submitReview.fulfilled, (state, action) => {
        const { review, orderItemId } = action.payload;

        // Optimistic update
        state.allRating.push({
          ...review,
          orderItemId, // ⭐ add this
        });
      });
  },
});

export const { setRating, setHover, setComment, clearRatingState } =
  ratingSlice.actions;
export default ratingSlice.reducer;
