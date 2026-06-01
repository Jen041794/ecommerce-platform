import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import { selectToast, clearToast } from '../store/slices/cartSlice';

const BG_BY_TYPE = {
  success: 'bg-success',
  error: 'bg-danger',
  info: 'bg-secondary',
};

function Toast() {
  const toast = useSelector(selectToast);
  const dispatch = useDispatch();
  const timerRef = useRef();

  useEffect(() => {
    if (!toast) return undefined;
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => dispatch(clearToast()), 2500);
    return () => clearTimeout(timerRef.current);
  }, [toast, dispatch]);

  return (
    <div
      className="toast-container position-fixed end-0 p-3"
      style={{ top: 72, zIndex: 1100 }}
    >
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.message}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.25 }}
            className={`toast show text-white border-0 ${
              BG_BY_TYPE[toast.type] ?? 'bg-dark'
            }`}
            role="alert"
          >
            <div className="toast-body">{toast.message}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Toast;
