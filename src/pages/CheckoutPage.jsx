import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';
import {
  selectCartItems,
  selectTotalAmount,
  selectDiscountAmount,
  selectFinalAmount,
  selectDiscountCode,
  clearCart,
} from '../store/slices/cartSlice';
import { saveOrder } from '../utils/orderStorage';

const STEPS = ['收件資料', '付款方式', '確認送出'];

const PAYMENT_LABELS = {
  credit: '信用卡',
  transfer: 'ATM 轉帳',
  cod: '貨到付款',
};

function CheckoutPage() {
  const items = useSelector(selectCartItems);
  const totalAmount = useSelector(selectTotalAmount);
  const discountAmount = useSelector(selectDiscountAmount);
  const finalAmount = useSelector(selectFinalAmount);
  const discountCode = useSelector(selectDiscountCode);
  const dispatch = useDispatch();

  const [step, setStep] = useState(1);
  const [shipping, setShipping] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
  });
  const [payment, setPayment] = useState({ method: 'credit', cardNumber: '' });
  const [errors, setErrors] = useState({});
  const [completedOrder, setCompletedOrder] = useState(null);

  const updateShipping = (field) => (event) =>
    setShipping((prev) => ({ ...prev, [field]: event.target.value }));

  const validateStep1 = () => {
    const e = {};
    if (!shipping.name.trim()) e.name = '請填寫姓名';
    if (!shipping.phone.trim()) {
      e.phone = '請填寫電話';
    } else if (!/^09\d{8}$/.test(shipping.phone.trim())) {
      e.phone = '請輸入 09 開頭、共 10 碼的手機號碼';
    }
    if (
      shipping.email.trim() &&
      !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(shipping.email.trim())
    ) {
      e.email = 'Email 格式不正確';
    }
    const address = shipping.address.trim();
    if (!address) {
      e.address = '請填寫地址';
    } else if (address.length < 8 || !/\d/.test(address)) {
      e.address = '請輸入完整地址（至少 8 字並含門牌號碼）';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e = {};
    if (!payment.method) e.method = '請選擇付款方式';
    if (
      payment.method === 'credit' &&
      !/^\d{12,19}$/.test(payment.cardNumber.replace(/\s/g, ''))
    ) {
      e.cardNumber = '請輸入 12～19 位數字的卡號';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setErrors({});
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setErrors({});
    setStep((prev) => prev - 1);
  };

  const handleSubmit = () => {
    const order = {
      orderNo: `ORD-${Date.now()}`,
      date: new Date().toISOString(),
      items,
      totalAmount,
      discountCode,
      discountAmount,
      finalAmount,
      shipping,
      payment: { method: payment.method },
    };
    saveOrder(order);
    dispatch(clearCart());
    setCompletedOrder(order);
  };

  if (completedOrder) {
    return (
      <div className="text-center py-5">
        <FaCheckCircle size={72} className="text-success mb-3" />
        <h1 className="h3 mb-2">訂單已成立！</h1>
        <p className="text-muted mb-1">訂單編號：{completedOrder.orderNo}</p>
        <p className="mb-1">
          實付金額：
          <strong className="text-danger">
            ${completedOrder.finalAmount.toFixed(2)}
          </strong>
        </p>
        <p className="text-muted">收件人：{completedOrder.shipping.name}</p>
        <p className="text-muted small">
          （訂單已存入瀏覽器 LocalStorage，可供歷史紀錄讀取）
        </p>
        <Link to="/" className="btn btn-primary mt-3">
          繼續購物
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-5">
        <h1 className="h4 mb-3">購物車是空的，無法結帳</h1>
        <Link to="/" className="btn btn-primary">
          去逛逛商品
        </Link>
      </div>
    );
  }

  return (
    <div className="row justify-content-center">
      <div className="col-lg-8">
        <h1 className="h3 mb-4">結帳</h1>

        <div className="d-flex mb-4">
          {STEPS.map((label, index) => {
            const stepNo = index + 1;
            const isActive = stepNo === step;
            const isDone = stepNo < step;
            return (
              <div key={label} className="flex-fill text-center">
                <div
                  className={`rounded-circle d-inline-flex align-items-center justify-content-center mb-1 ${
                    isDone
                      ? 'bg-success text-white'
                      : isActive
                        ? 'bg-primary text-white'
                        : 'bg-light text-muted border'
                  }`}
                  style={{ width: 36, height: 36 }}
                >
                  {isDone ? '✓' : stepNo}
                </div>
                <div
                  className={`small ${isActive ? 'fw-bold' : 'text-muted'}`}
                >
                  {label}
                </div>
              </div>
            );
          })}
        </div>

        <div className="card shadow-sm border-0">
          <div className="card-body p-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {step === 1 && (
                  <div>
                    <h2 className="h5 mb-3">收件資料</h2>
                    <div className="mb-3">
                      <label className="form-label">姓名 *</label>
                      <input
                        type="text"
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        value={shipping.name}
                        onChange={updateShipping('name')}
                      />
                      <div className="invalid-feedback">{errors.name}</div>
                    </div>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">電話 *</label>
                        <input
                          type="tel"
                          inputMode="numeric"
                          maxLength={10}
                          placeholder="09xxxxxxxx"
                          className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                          value={shipping.phone}
                          onChange={(event) =>
                            setShipping((prev) => ({
                              ...prev,
                              phone: event.target.value
                                .replace(/\D/g, '')
                                .slice(0, 10),
                            }))
                          }
                        />
                        <div className="invalid-feedback">{errors.phone}</div>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Email</label>
                        <input
                          type="email"
                          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                          value={shipping.email}
                          onChange={updateShipping('email')}
                        />
                        <div className="invalid-feedback">{errors.email}</div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">地址 *</label>
                      <input
                        type="text"
                        className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                        value={shipping.address}
                        onChange={updateShipping('address')}
                      />
                      <div className="invalid-feedback">{errors.address}</div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">城市</label>
                      <input
                        type="text"
                        className="form-control"
                        value={shipping.city}
                        onChange={updateShipping('city')}
                      />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <h2 className="h5 mb-3">付款方式</h2>
                    {Object.entries(PAYMENT_LABELS).map(([value, label]) => (
                      <div className="form-check mb-2" key={value}>
                        <input
                          className="form-check-input"
                          type="radio"
                          name="payment"
                          id={`pay-${value}`}
                          checked={payment.method === value}
                          onChange={() =>
                            setPayment((prev) => ({ ...prev, method: value }))
                          }
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`pay-${value}`}
                        >
                          {label}
                        </label>
                      </div>
                    ))}

                    {payment.method === 'credit' && (
                      <div className="mt-3">
                        <label className="form-label">信用卡卡號</label>
                        <input
                          type="text"
                          inputMode="numeric"
                          className={`form-control ${errors.cardNumber ? 'is-invalid' : ''}`}
                          placeholder="1234 5678 9012 3456"
                          value={payment.cardNumber}
                          onChange={(event) =>
                            setPayment((prev) => ({
                              ...prev,
                              cardNumber: event.target.value,
                            }))
                          }
                        />
                        <div className="invalid-feedback">
                          {errors.cardNumber}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <h2 className="h5 mb-3">確認訂單</h2>

                    <h3 className="h6 text-muted">收件資料</h3>
                    <p className="mb-3">
                      {shipping.name}　{shipping.phone}
                      {shipping.email && <>　{shipping.email}</>}
                      <br />
                      {shipping.city} {shipping.address}
                    </p>

                    <h3 className="h6 text-muted">付款方式</h3>
                    <p className="mb-3">{PAYMENT_LABELS[payment.method]}</p>

                    <h3 className="h6 text-muted">商品</h3>
                    <ul className="list-group list-group-flush mb-3">
                      {items.map((item) => (
                        <li
                          key={item.id}
                          className="list-group-item d-flex justify-content-between px-0"
                        >
                          <span>
                            {item.title} × {item.quantity}
                          </span>
                          <span>
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="d-flex justify-content-between">
                      <span className="text-muted">小計</span>
                      <span>${totalAmount.toFixed(2)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="d-flex justify-content-between text-success">
                        <span>折扣（{discountCode}）</span>
                        <span>-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="d-flex justify-content-between fs-5 fw-bold mt-2">
                      <span>總計</span>
                      <span className="text-danger">
                        ${finalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="d-flex justify-content-between mt-4">
              {step > 1 ? (
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={handleBack}
                >
                  上一步
                </button>
              ) : (
                <Link to="/cart" className="btn btn-outline-secondary">
                  回購物車
                </Link>
              )}

              {step < 3 ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleNext}
                >
                  下一步
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleSubmit}
                >
                  確認送出
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
