import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrash, FaPlus, FaMinus, FaShoppingCart } from 'react-icons/fa';
import {
  selectCartItems,
  selectTotalAmount,
  selectDiscountAmount,
  selectFinalAmount,
  selectDiscountCode,
  incrementQuantity,
  decrementQuantity,
  updateQuantity,
  removeFromCart,
  applyCoupon,
} from '../store/slices/cartSlice';

function CartPage() {
  const items = useSelector(selectCartItems);
  const totalAmount = useSelector(selectTotalAmount);
  const discountAmount = useSelector(selectDiscountAmount);
  const finalAmount = useSelector(selectFinalAmount);
  const discountCode = useSelector(selectDiscountCode);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [couponInput, setCouponInput] = useState(discountCode);

  if (items.length === 0) {
    return (
      <div className="text-center py-5">
        <FaShoppingCart size={64} className="text-muted mb-3" />
        <h1 className="h4 mb-3">購物車是空的</h1>
        <p className="text-muted mb-4">快去挑幾樣喜歡的商品吧！</p>
        <Link to="/" className="btn btn-primary">
          去逛逛商品
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="h3 mb-4">購物車（{items.length} 項）</h1>

      <div className="row g-4">
        <div className="col-lg-8">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.2 }}
                className="card mb-3 shadow-sm border-0"
              >
                <div className="card-body d-flex flex-wrap align-items-center gap-3">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    width={72}
                    height={72}
                    style={{ objectFit: 'contain' }}
                  />

                  <div className="flex-grow-1" style={{ minWidth: 140 }}>
                    <Link
                      to={`/product/${item.id}`}
                      className="text-decoration-none text-reset fw-semibold"
                    >
                      {item.title}
                    </Link>
                    <div className="text-muted small">單價 ${item.price}</div>
                  </div>

                  <div
                    className="input-group input-group-sm"
                    style={{ width: 120 }}
                  >
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      disabled={item.quantity <= 1}
                      onClick={() => dispatch(decrementQuantity(item.id))}
                      aria-label="減少數量"
                    >
                      <FaMinus />
                    </button>
                    <input
                      type="number"
                      className="form-control text-center"
                      value={item.quantity}
                      min={1}
                      max={item.stock}
                      onChange={(event) =>
                        dispatch(
                          updateQuantity({
                            id: item.id,
                            quantity: Number(event.target.value),
                          }),
                        )
                      }
                      aria-label="數量"
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      disabled={item.quantity >= item.stock}
                      onClick={() => dispatch(incrementQuantity(item.id))}
                      aria-label="增加數量"
                    >
                      <FaPlus />
                    </button>
                  </div>

                  <div
                    className="fw-bold text-end"
                    style={{ minWidth: 80 }}
                  >
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>

                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => dispatch(removeFromCart(item.id))}
                    aria-label="移除商品"
                  >
                    <FaTrash />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="col-lg-4">
          <div
            className="card shadow-sm border-0 sticky-top"
            style={{ top: 80 }}
          >
            <div className="card-body">
              <h2 className="h5 mb-3">訂單摘要</h2>

              <div className="mb-3">
                <label className="form-label small text-muted">折扣碼</label>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="輸入折扣碼"
                    value={couponInput}
                    onChange={(event) => setCouponInput(event.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={() => dispatch(applyCoupon(couponInput))}
                  >
                    套用
                  </button>
                </div>
                {discountCode && (
                  <small className="text-success d-block mt-1">
                    已套用折扣碼：{discountCode}
                  </small>
                )}
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">小計</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="d-flex justify-content-between mb-2 text-success">
                  <span>折扣</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <hr />

              <div className="d-flex justify-content-between mb-3 fs-5 fw-bold">
                <span>總計</span>
                <span className="text-danger">${finalAmount.toFixed(2)}</span>
              </div>

              <button
                type="button"
                className="btn btn-primary btn-lg w-100"
                onClick={() => navigate('/checkout')}
              >
                前往結帳
              </button>

              <Link
                to="/"
                className="btn btn-link w-100 mt-2 text-decoration-none"
              >
                繼續購物
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
