import { FaSearch, FaTimes } from 'react-icons/fa';

function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar mb-4">
      <FaSearch className="search-bar__icon" />
      <input
        type="text"
        className="form-control form-control-lg search-bar__input shadow-sm"
        placeholder="搜尋商品關鍵字…"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label="搜尋商品"
      />
      {value && (
        <button
          type="button"
          className="search-bar__clear"
          onClick={() => onChange('')}
          aria-label="清除搜尋"
        >
          <FaTimes size={14} />
        </button>
      )}
    </div>
  );
}

export default SearchBar;
