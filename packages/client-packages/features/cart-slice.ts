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

// ✅ Fetch cart from server
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (userId: string) => {
    const res = await fetch(`/api/cart/${userId}`);
    return (await res.json()) as CartItem[];
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
    if (userId) {
      const res = await fetch(`/api/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          cartItem: { productId: product.id, size, quantity: 1 },
          addQuantity: 1,
        }),
      });
      const data = await res.json();
      if (data.created) toast("Item added to the cart");
      dispatch(fetchCart(userId));
    } else {
      const local = localStorage.getItem("cart");
      const localCart: CartItem[] = local ? JSON.parse(local) : [];
      const updated = [...localCart, { ...product, size, quantity: 1 }];
      localStorage.setItem("cart", JSON.stringify(updated));
      toast("Item added locally");
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
      toast("Item removed from the cart");
      dispatch(fetchCart(userId));
    } else {
      const local = localStorage.getItem("cart");
      if (local) {
        const parsed: CartItem[] = JSON.parse(local);
        const updated = parsed
          .map((item) =>
            item.productId === productId && item.size === size
              ? { ...item, quantity: item.quantity - 1 }
              : item,
          )
          .filter((item) => item.quantity > 0);
        localStorage.setItem("cart", JSON.stringify(updated));
        toast("Item removed locally");
        return updated;
      }
    }
  },
);

// ✅ Slice
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cart = [];
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
          state.cart = action.payload;
        },
      )
      .addCase(addToCart.fulfilled, (state, action) => {
        if (Array.isArray(action.payload)) state.cart = action.payload;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        if (Array.isArray(action.payload)) state.cart = action.payload;
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
