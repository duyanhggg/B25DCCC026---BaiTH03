import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Product, CartItem } from '../../types';
import type { RootState } from '../../app/store';

export interface CartState {
  items: CartItem[];
}

const loadCartFromStorage = (): CartItem[] => {
  try {
    const raw = localStorage.getItem('shopmini_cart');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveCartToStorage = (items: CartItem[]) => {
  try {
    localStorage.setItem('shopmini_cart', JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save cart to localStorage', e);
  }
};

const initialState: CartState = {
  items: loadCartFromStorage(),
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const existing = state.items.find((item) => item.product.id === action.payload.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ product: action.payload, quantity: 1 });
      }
      saveCartToStorage(state.items);
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.product.id !== action.payload);
      saveCartToStorage(state.items);
    },
    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        state.items = state.items.filter((item) => item.product.id !== id);
      } else {
        const item = state.items.find((item) => item.product.id === id);
        if (item) {
          item.quantity = quantity;
        }
      }
      saveCartToStorage(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      saveCartToStorage(state.items);
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

export const selectCartItems = (state: RootState) => state.cart.items;

export const selectTotalQuantity = (state: RootState) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);

export const selectTotalPrice = (state: RootState) =>
  state.cart.items.reduce((total, item) => total + item.product.price * item.quantity, 0);

export default cartSlice.reducer;
