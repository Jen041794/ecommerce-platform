import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, makeStore } from '../test/test-utils';
import CartPage from './CartPage';
import { addToCart } from '../store/slices/cartSlice';

const product = {
  id: 1,
  title: '測試商品',
  price: 100,
  thumbnail: 't.jpg',
  stock: 5,
};

describe('CartPage 整合測試', () => {
  it('空購物車顯示空狀態', () => {
    renderWithProviders(<CartPage />);
    expect(screen.getByText('購物車是空的')).toBeInTheDocument();
  });

  it('顯示購物車內的商品', () => {
    const store = makeStore();
    store.dispatch(addToCart(product));
    renderWithProviders(<CartPage />, { store });
    expect(screen.getByText('測試商品')).toBeInTheDocument();
  });

  it('按「+」數量增加、總計同步更新', async () => {
    const store = makeStore();
    store.dispatch(addToCart(product));
    renderWithProviders(<CartPage />, { store });
    await userEvent.click(screen.getByLabelText('增加數量'));
    expect(store.getState().cart.cartItems[0].quantity).toBe(2);
    expect(store.getState().cart.totalAmount).toBe(200);
  });

  it('數量為 1 時「−」鈕 disabled', () => {
    const store = makeStore();
    store.dispatch(addToCart(product));
    renderWithProviders(<CartPage />, { store });
    expect(screen.getByLabelText('減少數量')).toBeDisabled();
  });

  it('移除商品 → 回到空狀態', async () => {
    const store = makeStore();
    store.dispatch(addToCart(product));
    renderWithProviders(<CartPage />, { store });
    await userEvent.click(screen.getByLabelText('移除商品'));
    expect(screen.getByText('購物車是空的')).toBeInTheDocument();
  });

  it('套用 WELCOME2026 → 顯示折扣金額', async () => {
    const store = makeStore();
    store.dispatch(addToCart(product));
    renderWithProviders(<CartPage />, { store });
    await userEvent.type(
      screen.getByPlaceholderText('輸入折扣碼'),
      'WELCOME2026',
    );
    await userEvent.click(screen.getByRole('button', { name: '套用' }));
    expect(store.getState().cart.discountCode).toBe('WELCOME2026');
    expect(screen.getByText('-$10.00')).toBeInTheDocument();
  });
});
