import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, makeStore } from '../test/test-utils';
import ProductCard from './ProductCard';

const product = {
  id: 1,
  title: '測試手機',
  price: 100,
  discountPercentage: 10,
  rating: 4,
  stock: 5,
  thumbnail: 't.jpg',
};

describe('ProductCard', () => {
  it('顯示標題、折扣價與原價', () => {
    renderWithProviders(<ProductCard product={product} />);
    expect(screen.getByText('測試手機')).toBeInTheDocument();
    expect(screen.getByText('$90')).toBeInTheDocument();
    expect(screen.getByText('$100')).toBeInTheDocument();
  });

  it('點「加入購物車」→ store 新增該商品', async () => {
    const store = makeStore();
    renderWithProviders(<ProductCard product={product} />, { store });
    await userEvent.click(screen.getByRole('button', { name: '加入購物車' }));
    const state = store.getState();
    expect(state.cart.cartItems).toHaveLength(1);
    expect(state.cart.totalQuantity).toBe(1);
  });

  it('庫存 0 → 按鈕顯示「已售罄」且 disabled', () => {
    renderWithProviders(<ProductCard product={{ ...product, stock: 0 }} />);
    expect(screen.getByRole('button', { name: '已售罄' })).toBeDisabled();
  });
});
