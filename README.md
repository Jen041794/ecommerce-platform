# ShopMate 現代化 RWD 電商平台

一個以前端為主的電子商務網站，展示**狀態管理、響應式切版（RWD）、非同步 API 串接**與流暢的互動體驗。採用客戶端渲染（SPA）架構。

🔗 **線上 Demo**：https://ecommerce-platform-sigma-nine.vercel.app/

> 📌 本專案為**個人練習與作品集用途**，串接公開測試 API（DummyJSON），無自建後端與真實金流。
>
> 📄 著作權所有 © Michelle。本專案僅供**個人學習與作品集展示**，未經作者同意，不得用於商業用途。

---

## 🛠️ 技術棧

| 類別 | 使用技術 |
|------|----------|
| 專案基底 | Vite 6 + React 18（JavaScript） |
| 路由 | react-router-dom v6 |
| 狀態管理 | Redux Toolkit + React-Redux |
| 資料串接 | RTK Query（內建快取與 loading 狀態） |
| 樣式 / RWD | Bootstrap 5 + 自訂 CSS |
| 動畫互動 | framer-motion（登場/換頁）、Swiper 12（商品多圖輪播） |
| 圖示 | react-icons |

**資料來源**：[DummyJSON Products API](https://dummyjson.com/docs/products)

---

## ✨ 功能總覽

1. **全域導覽列**：RWD 漢堡選單、購物車即時數量徽章
2. **商品列表頁**：Grid RWD（手機 1 / 平板 2 / 桌機 3~4 欄）、骨架螢幕載入、特價標籤與原價劃掉、售罄狀態
3. **關鍵字即時搜尋**：Debounce 防抖 500ms，停手才打 API
4. **商品詳情頁**：Swiper 多圖輪播（分頁點 + 箭頭）、規格、庫存、使用者評論
5. **購物車**：數量增減防呆（1 ≤ 數量 ≤ 庫存）、折扣碼、即時金額計算
6. **結帳**：多步驟表單（收件 → 付款 → 確認）、表單驗證、訂單寫入 LocalStorage

**試用折扣碼**：`WELCOME2026`（全站總額 9 折）

---

## 🚀 本地啟動

需求：Node.js 18 以上

```bash
npm install      # 安裝依賴
npm run dev      # 啟動開發伺服器（預設 http://localhost:5173）
npm run build    # 打包正式版到 dist/
npm run preview  # 預覽打包結果
```

---

## 📁 專案結構

```
src/
├── components/
│   ├── Navbar.jsx              # 全域導覽列 + 購物車徽章
│   ├── ProductCard.jsx         # 商品卡片
│   ├── ProductCardSkeleton.jsx # 載入骨架
│   ├── RatingStars.jsx         # 評分星星（含半星）
│   ├── SearchBar.jsx           # 搜尋框
│   └── Toast.jsx               # 全域提示訊息
├── pages/
│   ├── HomePage.jsx            # 商品列表 + 搜尋
│   ├── ProductDetailPage.jsx   # 商品詳情 + 輪播
│   ├── CartPage.jsx            # 購物車
│   └── CheckoutPage.jsx        # 多步驟結帳
├── store/
│   ├── store.js                # Redux Store
│   ├── slices/cartSlice.js     # 購物車狀態與防呆邏輯
│   └── api/productsApi.js      # RTK Query API 定義
├── hooks/useDebounce.js        # 防抖 hook
├── utils/orderStorage.js       # 訂單 LocalStorage 讀寫
├── App.jsx                     # 路由配置
└── main.jsx                    # 進入點（Provider / Router）
```

---

## ✅ QA 測試清單

> 本人 QA 背景，以下為驗收用的功能與邊界測試清單（黃金路徑 + 異常情境）。

### 商品列表頁
- [x] 首次載入顯示骨架卡片，資料回來後淡入真實商品
- [x] 卡片正確顯示圖片、標題、評分、價格
- [x] 有折扣商品顯示「-XX%」標籤、原價劃掉、紅色特價
- [x] RWD：手機 1 欄 / 平板 2 欄 / 桌機 3~4 欄
- [x] 邊界：庫存 0 → 按鈕顯示「已售罄」且不可點
- [x] 邊界：API 失敗 → 顯示錯誤訊息與重新載入按鈕

### 關鍵字搜尋
- [x] 輸入關鍵字停手約 0.5 秒後才更新列表
- [x] 標題切換為「搜尋結果：「關鍵字」」
- [x] 邊界：連續快速輸入只發出最後一次請求（可用 DevTools Network 驗證 Debounce）
- [x] 邊界：查無結果顯示友善提示
- [x] 清除（✕）回到熱門商品列表
- [x] UI：搜尋框 focus 無外框、清除鈕四角圓角

### 商品詳情頁
- [x] 多圖可左右滑動，有分頁圓點與左右箭頭
- [x] 顯示品牌/分類、評分、折扣價+原價、庫存、描述
- [x] 使用者評論顯示評論者、星等、內容、日期
- [x] 邊界：庫存 ≤ 5 顯示「即將售完」
- [x] 邊界：售罄 → 加入購物車按鈕 disabled
- [x] 邊界：無評論顯示「目前還沒有評論」
- [x] 邊界：網址輸入不存在的商品 ID → 顯示找不到並可回首頁/重載

### 購物車（防呆重點）
- [x] 正確列出商品（圖、標題、單價、數量、小計）
- [x] 小計 − 折扣 = 總計，改任何數量即時重算
- [x] 邊界：數量減到 1 時「−」鈕 disabled（不可變 0）
- [x] 邊界：數量達庫存上限時「+」鈕 disabled
- [x] 邊界：數字框直接輸入超過庫存 → 夾回上限並跳 Toast 提示
- [x] 邊界：輸入 0 或負數 → 自動修正為 1
- [x] 邊界：同商品重複加入 → 數量累加，不新增重複列
- [x] 移除商品 → 滑出動畫 + 總計重算
- [x] 折扣碼 `WELCOME2026`（大小寫皆可）→ 總額打 9 折
- [x] 邊界：錯誤折扣碼 → Toast「折扣碼無效」
- [x] 空車 → 顯示空狀態與「去逛逛」按鈕

### 結帳
- [x] 三步驟流程與步驟指示器正確高亮
- [x] 送出後顯示訂單編號、購物車清空、徽章歸零
- [x] 訂單寫入 LocalStorage（鍵：`ecommerce_orders`）
- [x] 邊界：必填欄位（姓名/電話/地址）留空 → 擋下並標紅
- [x] 邊界：電話需 09 開頭、共 10 碼；輸入時自動濾除非數字並限制 10 碼
- [x] 邊界：Email 格式錯誤 → 擋下（留空可過，非必填）
- [x] 邊界：信用卡卡號空白/太短 → 擋下；改貨到付款後卡號欄消失可直接過
- [x] 邊界：空車直接進入 `/checkout` → 顯示「購物車是空的，無法結帳」
- [x] 邊界：地址需符合格式（至少 8 字並含門牌號碼，過短／亂填擋下）

### 全域
- [x] Navbar RWD：手機收合成漢堡並可展開（展開後首頁與購物車並排、購物車去邊框、中間留間隔）
- [x] 購物車徽章即時反映總件數
- [x] Toast 出現在 Navbar 下方、不遮擋購物車圖示、2.5 秒自動消失
- [x] 跨頁導航正常（react-router）

---

## 🧪 自動化測試

使用 **Vitest + React Testing Library** 撰寫單元與整合測試，把上方手動 QA 清單的核心邏輯轉為自動化回歸測試。

```bash
npm test          # watch 模式（開發時自動重跑）
npm run test:run  # 跑一次（CI / 驗收用）
```

**測試範圍（共 33 個測試）**：

| 類型 | 檔案 | 重點 |
|------|------|------|
| 單元測試 | `cartSlice.test.js` | 購物車防呆邏輯：加入、數量上下限、折扣碼、金額重算 |
| 整合測試 | `CartPage.test.jsx` | 購物車 UI 互動：+/− 數量、移除、套用折扣碼 |
| 元件測試 | `ProductCard.test.jsx` | 折扣價渲染、加入購物車、售罄 disabled |
| 元件測試 | `Toast.test.jsx` | 加入購物車後提示訊息出現 |
| 元件測試 | `SearchBar.test.jsx`、`RatingStars.test.jsx` | 輸入/清除互動、評分顯示 |

> 整合測試使用真實的 Redux store（非 mock），確保元件與狀態管理串接正確。

## 🤖 開發說明

本專案於開發過程中使用 **AI 輔助（Claude Code）** 協助搭建專案架構、撰寫元件與除錯，並由本人理解、驗收與測試。

## 作者

Michelle
