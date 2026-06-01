import { createSlice } from '@reduxjs/toolkit';

const COUPONS = {
  WELCOME2026: { type: 'percent', value: 0.1, label: '新會員 9 折' },
};

const initialState = {
  cartItems: [],
  totalQuantity: 0,
  totalAmount: 0,
  discountCode: '',
  discountAmount: 0,
  finalAmount: 0,
  toast: null,
};

const recalcTotals = (state) => {
  state.totalQuantity = state.cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );
  state.totalAmount = state.cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const coupon = COUPONS[state.discountCode];
  if (coupon) {
    if (coupon.type === 'percent') {
      state.discountAmount = state.totalAmount * coupon.value;
    } else if (coupon.type === 'fixed') {
      state.discountAmount = Math.min(coupon.value, state.totalAmount);
    }
  } else {
    state.discountAmount = 0;
  }

  state.finalAmount = Math.max(0, state.totalAmount - state.discountAmount);
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { id, title, price, thumbnail, stock } = action.payload;

      if (stock <= 0) {
        state.toast = { type: 'error', message: `${title} 已售罄` };
        return;
      }

      const existing = state.cartItems.find((item) => item.id === id);

      if (existing) {
        if (existing.quantity >= existing.stock) {
          state.toast = {
            type: 'error',
            message: `${title} 已達庫存上限（${existing.stock} 件）`,
          };
          return;
        }
        existing.quantity += 1;
      } else {
        state.cartItems.push({ id, title, price, thumbnail, stock, quantity: 1 });
      }

      state.toast = { type: 'success', message: `已將「${title}」加入購物車` };
      recalcTotals(state);
    },

    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.cartItems.find((i) => i.id === id);
      if (!item) return;

      const requested = Number(quantity);
      if (Number.isNaN(requested)) return;

      if (requested > item.stock) {
        state.toast = {
          type: 'error',
          message: `${item.title} 庫存只剩 ${item.stock} 件`,
        };
      } else if (requested < 1) {
        state.toast = { type: 'error', message: '數量不可小於 1' };
      }

      item.quantity = Math.max(1, Math.min(requested, item.stock));
      recalcTotals(state);
    },

    incrementQuantity: (state, action) => {
      const id = action.payload;
      const item = state.cartItems.find((i) => i.id === id);
      if (!item) return;
      if (item.quantity >= item.stock) {
        state.toast = {
          type: 'error',
          message: `${item.title} 已達庫存上限`,
        };
        return;
      }
      item.quantity += 1;
      recalcTotals(state);
    },

    decrementQuantity: (state, action) => {
      const id = action.payload;
      const item = state.cartItems.find((i) => i.id === id);
      if (!item) return;
      if (item.quantity <= 1) return;
      item.quantity -= 1;
      recalcTotals(state);
    },

    removeFromCart: (state, action) => {
      const id = action.payload;
      const removed = state.cartItems.find((i) => i.id === id);
      state.cartItems = state.cartItems.filter((i) => i.id !== id);
      if (removed) {
        state.toast = {
          type: 'info',
          message: `已移除「${removed.title}」`,
        };
      }
      recalcTotals(state);
    },

    applyCoupon: (state, action) => {
      const code = (action.payload || '').trim().toUpperCase();

      if (!code) {
        state.discountCode = '';
        state.toast = { type: 'info', message: '已取消折扣碼' };
        recalcTotals(state);
        return;
      }

      if (COUPONS[code]) {
        state.discountCode = code;
        state.toast = {
          type: 'success',
          message: `折扣碼已套用：${COUPONS[code].label}`,
        };
      } else {
        state.discountCode = '';
        state.toast = { type: 'error', message: '折扣碼無效' };
      }
      recalcTotals(state);
    },

    clearCart: (state) => {
      state.cartItems = [];
      state.discountCode = '';
      state.totalQuantity = 0;
      state.totalAmount = 0;
      state.discountAmount = 0;
      state.finalAmount = 0;
    },

    clearToast: (state) => {
      state.toast = null;
    },
  },
});

export const {
  addToCart,
  updateQuantity,
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
  applyCoupon,
  clearCart,
  clearToast,
} = cartSlice.actions;

export const selectCartItems = (state) => state.cart.cartItems;
export const selectTotalQuantity = (state) => state.cart.totalQuantity;
export const selectTotalAmount = (state) => state.cart.totalAmount;
export const selectDiscountAmount = (state) => state.cart.discountAmount;
export const selectFinalAmount = (state) => state.cart.finalAmount;
export const selectDiscountCode = (state) => state.cart.discountCode;
export const selectToast = (state) => state.cart.toast;

export default cartSlice.reducer;
