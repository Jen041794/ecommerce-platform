import '@testing-library/jest-dom';
import { vi } from 'vitest';

// jsdom 沒有實作以下瀏覽器 API，framer-motion / Bootstrap / UI 元件會用到，補上 stub
if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  });
}

class ObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.IntersectionObserver = window.IntersectionObserver || ObserverStub;
window.ResizeObserver = window.ResizeObserver || ObserverStub;
