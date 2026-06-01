import { describe, it, expect } from 'vitest';
import reducer, {
  addToCart,
  updateQuantity,
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
  applyCoupon,
  clearCart,
} from './cartSlice';

const productA = {
  id: 1,
  title: '商品 A',
  price: 100,
  thumbnail: 'a.jpg',
  stock: 3,
};
const productB = {
  id: 2,
  title: '商品 B',
  price: 50,
  thumbnail: 'b.jpg',
  stock: 10,
};

const getInitialState = () => reducer(undefined, { type: '@@INIT' });

const addTimes = (state, product, times) => {
  let next = state;
  for (let i = 0; i < times; i += 1) {
    next = reducer(next, addToCart(product));
  }
  return next;
};

describe('cartSlice - addToCart', () => {
  it('新增商品到空購物車', () => {
    const state = reducer(getInitialState(), addToCart(productA));
    expect(state.cartItems).toHaveLength(1);
    expect(state.cartItems[0]).toMatchObject({
      id: 1,
      quantity: 1,
      price: 100,
      stock: 3,
    });
    expect(state.totalQuantity).toBe(1);
    expect(state.totalAmount).toBe(100);
  });

  it('重複加入同商品 → 數量累加，不新增重複列', () => {
    let state = reducer(getInitialState(), addToCart(productA));
    state = reducer(state, addToCart(productA));
    expect(state.cartItems).toHaveLength(1);
    expect(state.cartItems[0].quantity).toBe(2);
    expect(state.totalQuantity).toBe(2);
    expect(state.totalAmount).toBe(200);
  });

  it('庫存 0 → 不加入並顯示售罄提示', () => {
    const soldOut = { ...productA, stock: 0 };
    const state = reducer(getInitialState(), addToCart(soldOut));
    expect(state.cartItems).toHaveLength(0);
    expect(state.toast).toMatchObject({ type: 'error' });
  });

  it('加入超過庫存上限 → 擋下並提示', () => {
    let state = addTimes(getInitialState(), productA, 3);
    expect(state.cartItems[0].quantity).toBe(3);
    state = reducer(state, addToCart(productA));
    expect(state.cartItems[0].quantity).toBe(3);
    expect(state.toast).toMatchObject({ type: 'error' });
  });
});

describe('cartSlice - updateQuantity 防呆', () => {
  it('正常設定數量', () => {
    let state = reducer(getInitialState(), addToCart(productB));
    state = reducer(state, updateQuantity({ id: 2, quantity: 5 }));
    expect(state.cartItems[0].quantity).toBe(5);
  });

  it('超過庫存 → 夾回庫存上限並提示', () => {
    let state = reducer(getInitialState(), addToCart(productA));
    state = reducer(state, updateQuantity({ id: 1, quantity: 99 }));
    expect(state.cartItems[0].quantity).toBe(3);
    expect(state.toast).toMatchObject({ type: 'error' });
  });

  it('小於 1 → 夾回 1', () => {
    let state = reducer(getInitialState(), addToCart(productA));
    state = reducer(state, updateQuantity({ id: 1, quantity: 0 }));
    expect(state.cartItems[0].quantity).toBe(1);
  });

  it('非數字 → 不變動', () => {
    let state = reducer(getInitialState(), addToCart(productA));
    state = reducer(state, updateQuantity({ id: 1, quantity: 'abc' }));
    expect(state.cartItems[0].quantity).toBe(1);
  });
});

describe('cartSlice - increment / decrement', () => {
  it('increment 到庫存上限後不再增加', () => {
    let state = reducer(getInitialState(), addToCart(productA));
    state = reducer(state, incrementQuantity(1));
    state = reducer(state, incrementQuantity(1));
    state = reducer(state, incrementQuantity(1));
    expect(state.cartItems[0].quantity).toBe(3);
    expect(state.toast).toMatchObject({ type: 'error' });
  });

  it('decrement 最低為 1', () => {
    let state = reducer(getInitialState(), addToCart(productA));
    state = reducer(state, decrementQuantity(1));
    expect(state.cartItems[0].quantity).toBe(1);
  });
});

describe('cartSlice - removeFromCart', () => {
  it('移除商品並重算金額', () => {
    let state = reducer(getInitialState(), addToCart(productA));
    state = reducer(state, addToCart(productB));
    state = reducer(state, removeFromCart(1));
    expect(state.cartItems).toHaveLength(1);
    expect(state.cartItems[0].id).toBe(2);
    expect(state.totalQuantity).toBe(1);
    expect(state.totalAmount).toBe(50);
  });
});

describe('cartSlice - applyCoupon', () => {
  it('WELCOME2026 → 總額打 9 折', () => {
    let state = reducer(getInitialState(), addToCart(productA));
    state = reducer(state, applyCoupon('WELCOME2026'));
    expect(state.discountCode).toBe('WELCOME2026');
    expect(state.discountAmount).toBeCloseTo(10);
    expect(state.finalAmount).toBeCloseTo(90);
  });

  it('折扣碼不分大小寫、自動去空白', () => {
    let state = reducer(getInitialState(), addToCart(productA));
    state = reducer(state, applyCoupon('  welcome2026 '));
    expect(state.discountCode).toBe('WELCOME2026');
    expect(state.finalAmount).toBeCloseTo(90);
  });

  it('無效折扣碼 → 不套用並提示', () => {
    let state = reducer(getInitialState(), addToCart(productA));
    state = reducer(state, applyCoupon('NOPE'));
    expect(state.discountCode).toBe('');
    expect(state.discountAmount).toBe(0);
    expect(state.toast).toMatchObject({ type: 'error' });
  });

  it('空字串 → 取消折扣', () => {
    let state = reducer(getInitialState(), addToCart(productA));
    state = reducer(state, applyCoupon('WELCOME2026'));
    state = reducer(state, applyCoupon(''));
    expect(state.discountCode).toBe('');
    expect(state.discountAmount).toBe(0);
    expect(state.finalAmount).toBe(100);
  });

  it('套用折扣後改數量 → 折扣金額跟著重算', () => {
    let state = reducer(getInitialState(), addToCart(productA));
    state = reducer(state, applyCoupon('WELCOME2026'));
    state = reducer(state, updateQuantity({ id: 1, quantity: 3 }));
    expect(state.totalAmount).toBe(300);
    expect(state.discountAmount).toBeCloseTo(30);
    expect(state.finalAmount).toBeCloseTo(270);
  });
});

describe('cartSlice - clearCart', () => {
  it('清空所有狀態', () => {
    let state = reducer(getInitialState(), addToCart(productA));
    state = reducer(state, applyCoupon('WELCOME2026'));
    state = reducer(state, clearCart());
    expect(state.cartItems).toHaveLength(0);
    expect(state.totalQuantity).toBe(0);
    expect(state.totalAmount).toBe(0);
    expect(state.discountAmount).toBe(0);
    expect(state.finalAmount).toBe(0);
    expect(state.discountCode).toBe('');
  });
});

describe('cartSlice - 金額一致性', () => {
  it('小計 − 折扣 = 總計', () => {
    let state = getInitialState();
    state = reducer(state, addToCart(productA));
    state = reducer(state, addToCart(productB));
    state = reducer(state, applyCoupon('WELCOME2026'));
    expect(state.totalAmount - state.discountAmount).toBeCloseTo(
      state.finalAmount,
    );
  });
});
