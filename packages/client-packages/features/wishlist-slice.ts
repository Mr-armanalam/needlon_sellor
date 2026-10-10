import { GuestWishlistItem, WishlistItem, WishlistState } from "@/types/wishlist";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "sonner";

const initialState: WishlistState = {
  wishlist: [],
  guestWishlist: [],
  loading: false,
};

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (userId: string) => {
    if (!userId) {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("wishlist");
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) return parsed as WishlistItem[];
          } catch {
            return [];
          }
        }
      }
      return [];
    }

    try {
      const res = await fetch(`/api/wishlist/${userId}`, { cache: "no-store" });
      if (!res.ok) return [];
      const data = await res.json();
      if (Array.isArray(data)) return data as WishlistItem[];
      if (data && Array.isArray(data.items)) return data.items as WishlistItem[];
      return [];
    } catch {
      return [];
    }
  }
);

// Syncs guest items to the database
export const syncWishlistWithDB = createAsyncThunk(
  "wishlist/syncWishlist",
  async ({ userId, guestItems }: { userId: string; guestItems: GuestWishlistItem[] }, { dispatch }) => {
    if (!guestItems || guestItems.length === 0) return;

    try {
      const res = await fetch(`/api/wishlist/sync`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, items: guestItems }),
      });

      if (res.ok) {
        dispatch(clearGuestWishlist());
        dispatch(fetchWishlist(userId));
        toast.success("Wishlist synchronized!");
      }
    } catch (err) {
      console.warn("Wishlist sync error:", err);
    }
  }
);

export const toggleWishlist = createAsyncThunk(
  "wishlist/toggleWishlist",
  async (
    { userId, productId, size, exists }: { userId: string; productId: string; size?: string; exists: boolean },
    { dispatch }
  ) => {
    const action = exists ? "remove" : "add";
    const res = await fetch(`/api/wishlist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, productId, size, action }),
    });

    if (!res.ok) throw new Error("Failed to toggle wishlist");

    toast.success(exists ? "Removed from wishlist" : "Added to wishlist");
    dispatch(fetchWishlist(userId));
    return { productId, size, exists };
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
    // Initialize guest list from localStorage
    initializeGuestWishlist: (state) => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("wishlist");
        if (saved) {
          try {
            state.guestWishlist = JSON.parse(saved);
          } catch {
            state.guestWishlist = [];
          }
        }
      }
    },
    toggleGuestWishlist: (state, action: PayloadAction<GuestWishlistItem>) => {
      const index = state.guestWishlist.findIndex(
        (w) => w.productId === action.payload.productId && (w.size === action.payload.size || (!w.size && !action.payload.size))
      );

      if (index !== -1) {
        state.guestWishlist.splice(index, 1);
        toast.success("Removed from wishlist");
      } else {
        state.guestWishlist.push(action.payload);
        toast.success("Added to wishlist");
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("wishlist", JSON.stringify(state.guestWishlist));
      }
    },
    clearGuestWishlist: (state) => {
      state.guestWishlist = [];
      if (typeof window !== "undefined") {
        localStorage.removeItem("wishlist");
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlist = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setUserId, initializeGuestWishlist, toggleGuestWishlist, clearGuestWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
