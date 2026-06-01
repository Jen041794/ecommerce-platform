import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import RatingStars from './RatingStars';

describe('RatingStars', () => {
  it('預設顯示評分數值', () => {
    render(<RatingStars rating={4.5} />);
    expect(screen.getByText('4.5')).toBeInTheDocument();
  });

  it('showValue=false 時不顯示數值', () => {
    render(<RatingStars rating={3} showValue={false} />);
    expect(screen.queryByText('3.0')).not.toBeInTheDocument();
  });
});
