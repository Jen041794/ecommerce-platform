import { Link, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaShoppingCart } from 'react-icons/fa';
import { selectTotalQuantity } from '../store/slices/cartSlice';

function Navbar() {
  const totalQuantity = useSelector(selectTotalQuantity);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          🛍️ ShopMate
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="切換選單"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" end>
                首頁
              </NavLink>
            </li>
          </ul>

          <Link
            to="/cart"
            className="btn btn-outline-light position-relative d-inline-flex align-items-center"
            aria-label="購物車"
          >
            <FaShoppingCart size={20} />
            <span className="ms-2 d-lg-none">購物車</span>
            {totalQuantity > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {totalQuantity}
                <span className="visually-hidden">件商品在購物車</span>
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
