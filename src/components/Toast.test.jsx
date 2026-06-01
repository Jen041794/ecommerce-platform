import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, makeStore } from '../test/test-utils';
import ProductCard from './ProductCard';
import Toast from './Toast';

const product = {
  id: 1,
  title: '測試商品',
  price: 100,
  discountPercentage: 0,
  rating: 4,
  stock: 5,
  thumbnail: 't.jpg',
};

describe('Toast', () => {
  it('加入購物車後顯示提示訊息', async () => {
    const store = makeStore();
    renderWithProviders(
      <>
        <ProductCard product={product} />
        <Toast />
      </>,
      { store },
    );
    await userEvent.click(screen.getByRole('button', { name: '加入購物車' }));
    expect(
      await screen.findByText(/已將「測試商品」加入購物車/),
    ).toBeInTheDocument();
  });
});
