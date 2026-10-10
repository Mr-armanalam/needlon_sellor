import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "sonner";

export interface CartItem {
  id: string;
  userId?: string;
  productId?: string;
  quantity: number;
  size: string;
  name: string;
  price: number;
  mrp_price?: number;
  image: string;
  updatedAt?: Date;
  shippingCharge?: number;
}

interface CartState {
  cart: CartItem[];
  loading: boolean;
}

const initialState: CartState = {
  cart: [],
  loading: false,
};

// ✅ Fetch cart from server or local storage
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (userId: string) => {
    if (!userId) {
      if (typeof window !== "undefined") {
        const local = localStorage.getItem("cart");
        if (local) {
          try {
            const parsed = JSON.parse(local);
            if (Array.isArray(parsed)) return parsed as CartItem[];
          } catch {
            return [];
          }
        }
      }
      return [];
    }
    try {
      const res = await fetch(`/api/cart/${userId}`);
      if (!res.ok) return [];
      const data = await res.json();
      if (Array.isArray(data)) return data as CartItem[];
      if (data && Array.isArray(data.cart)) return data.cart as CartItem[];
      return [];
    } catch {
      return [];
    }
  },
);

// ✅ Add to cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (
    {
      userId,
      product,
      size,
    }: { userId?: string; product: CartItem; size: string },
    { dispatch },
  ) => {
    const targetProductId = product.productId || product.id;

    if (userId) {
      const res = await fetch(`/api/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          cartItem: { productId: targetProductId, size, quantity: 1 },
          addQuantity: 1,
        }),
      });
      const data = await res.json();
      if (data.created || data.success) toast.success("Item added to cart");

      const fetchRes = await fetch(`/api/cart/${userId}`);
      if (fetchRes.ok) {
        const cartData = await fetchRes.json();
        return Array.isArray(cartData) ? cartData : (cartData.cart || []);
      }
      return [];
    } else {
      let localCart: CartItem[] = [];
      if (typeof window !== "undefined") {
        const local = localStorage.getItem("cart");
        if (local) {
          try {
            localCart = JSON.parse(local);
          } catch {
            localCart = [];
          }
        }
      }

      const existingIndex = localCart.findIndex(
        (i) => (i.productId === targetProductId || i.id === targetProductId) && i.size === size
      );

      let updated: CartItem[];
      if (existingIndex > -1) {
        updated = localCart.map((it, idx) =>
          idx === existingIndex ? { ...it, quantity: (Number(it.quantity) || 1) + 1 } : it
        );
      } else {
        updated = [
          ...localCart,
          {
            ...product,
            id: product.id || targetProductId,
            productId: targetProductId,
            size,
            quantity: 1,
          },
        ];
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(updated));
      }
      toast.success("Item added to cart locally");
      return updated;
    }
  },
);

// ✅ Remove from cart
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (
    {
      userId,
      productId,
      size,
    }: { userId?: string; productId: string; size: string },
    { dispatch },
  ) => {
    if (userId) {
      await fetch(`/api/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          cartItem: { productId, size },
          removeQuantity: 1,
        }),
      });
      toast.success("Item removed from cart");
      const fetchRes = await fetch(`/api/cart/${userId}`);
      if (fetchRes.ok) {
        const cartData = await fetchRes.json();
        return Array.isArray(cartData) ? cartData : (cartData.cart || []);
      }
      return [];
    } else {
      if (typeof window !== "undefined") {
        const local = localStorage.getItem("cart");
        if (local) {
          const parsed: CartItem[] = JSON.parse(local);
          const updated = parsed
            .map((item) =>
              (item.productId === productId || item.id === productId) && item.size === size
                ? { ...item, quantity: item.quantity - 1 }
                : item,
            )
            .filter((item) => item.quantity > 0);
          localStorage.setItem("cart", JSON.stringify(updated));
          toast.success("Item removed from cart locally");
          return updated;
        }
      }
      return [];
    }
  },
);

// ✅ Synchronize guest cart with DB on login
export const syncCartWithDB = createAsyncThunk(
  "cart/syncCartWithDB",
  async (
    { userId, guestItems }: { userId: string; guestItems: CartItem[] },
    { dispatch }
  ) => {
    if (!guestItems || guestItems.length === 0) return [];
    try {
      const res = await fetch(`/api/cart/sync`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, items: guestItems }),
      });
      if (res.ok) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("cart");
        }
        toast.success("Cart synchronized!");
        const cartData = await res.json();
        const updated = Array.isArray(cartData.cart) ? cartData.cart : [];
        dispatch(fetchCart(userId));
        return updated;
      }
    } catch (err) {
      console.warn("Cart sync error:", err);
    }
    return [];
  }
);

// ✅ Slice
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cart = [];
    },
    initializeGuestCart: (state) => {
      if (typeof window !== "undefined") {
        const local = localStorage.getItem("cart");
        if (local) {
          try {
            state.cart = JSON.parse(local);
          } catch {
            state.cart = [];
          }
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchCart.fulfilled,
        (state, action: PayloadAction<CartItem[]>) => {
          state.loading = false;
          state.cart = Array.isArray(action.payload) ? action.payload : [];
        },
      )
      .addCase(fetchCart.rejected, (state) => {
        state.loading = false;
        state.cart = [];
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        if (Array.isArray(action.payload)) state.cart = action.payload;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        if (Array.isArray(action.payload)) state.cart = action.payload;
      })
      .addCase(syncCartWithDB.fulfilled, (state, action) => {
        if (Array.isArray(action.payload) && action.payload.length > 0) {
          state.cart = action.payload;
        }
      });
  },
});

export const { clearCart, initializeGuestCart } = cartSlice.actions;
export default cartSlice.reducer;
