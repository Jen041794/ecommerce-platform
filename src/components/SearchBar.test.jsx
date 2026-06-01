import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from './SearchBar';

describe('SearchBar', () => {
  it('輸入時呼叫 onChange', async () => {
    const onChange = vi.fn();
    render(<SearchBar value="" onChange={onChange} />);
    await userEvent.type(screen.getByPlaceholderText('搜尋商品關鍵字…'), 'a');
    expect(onChange).toHaveBeenCalledWith('a');
  });

  it('有值時顯示清除鈕，點擊清空', async () => {
    const onChange = vi.fn();
    render(<SearchBar value="phone" onChange={onChange} />);
    await userEvent.click(screen.getByLabelText('清除搜尋'));
    expect(onChange).toHaveBeenCalledWith('');
  });

  it('value 為空時不顯示清除鈕', () => {
    render(<SearchBar value="" onChange={() => {}} />);
    expect(screen.queryByLabelText('清除搜尋')).not.toBeInTheDocument();
  });
});
