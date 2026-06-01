import { useState } from "react";
import {
  useGetProductsQuery,
  useSearchProductsQuery,
} from "../store/api/productsApi";
import { useDebounce } from "../hooks/useDebounce";
import SearchBar from "../components/SearchBar";
import ProductCard from "../components/ProductCard";
import ProductCardSkeleton from "../components/ProductCardSkeleton";

const COL_CLASS = "col-12 col-sm-6 col-lg-4 col-xl-3";
const SKELETON_COUNT = 12;

function HomePage() {
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 500);
  const trimmed = debouncedKeyword.trim();
  const isSearching = trimmed.length > 0;

  const listQuery = useGetProductsQuery(12, { skip: isSearching });
  const searchQuery = useSearchProductsQuery(trimmed, { skip: !isSearching });

  const { data, isLoading, isError, refetch } = isSearching
    ? searchQuery
    : listQuery;
  const products = data?.products ?? [];

  return (
    <div>
      <h1 className="h3 mb-4">
        {isSearching ? `搜尋結果：「${trimmed}」` : "熱門商品"}
      </h1>

      <SearchBar value={keyword} onChange={setKeyword} />

      {isError && (
        <div className="alert alert-danger d-flex justify-content-between align-items-center">
          <span>商品載入失敗，請檢查網路後再試。</span>
          <button
            type="button"
            className="btn btn-sm btn-outline-danger"
            onClick={refetch}
          >
            重新載入
          </button>
        </div>
      )}

      <div className="row g-4">
        {isLoading
          ? Array.from({ length: SKELETON_COUNT }).map((_, index) => (
              <div className={COL_CLASS} key={`skeleton-${index}`}>
                <ProductCardSkeleton />
              </div>
            ))
          : products.map((product) => (
              <div className={COL_CLASS} key={product.id}>
                <ProductCard product={product} />
              </div>
            ))}
      </div>

      {!isLoading && !isError && products.length === 0 && (
        <p className="text-center text-muted py-5">
          {isSearching
            ? `找不到「${trimmed}」相關商品，換個關鍵字試試。`
            : "目前沒有商品。"}
        </p>
      )}
    </div>
  );
}

export default HomePage;
