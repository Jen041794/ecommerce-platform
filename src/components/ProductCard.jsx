import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { addToCart } from '../store/slices/cartSlice';
import RatingStars from './RatingStars';

function ProductCard({ product }) {
  const dispatch = useDispatch();
  const { id, title, price, discountPercentage, rating, stock, thumbnail } =
    product;

  const isSoldOut = stock <= 0;
  const hasDiscount = discountPercentage > 0;
  const finalPrice = +(price * (1 - discountPercentage / 100)).toFixed(2);

  const handleAdd = () => {
    dispatch(
      addToCart({ id, title, price: finalPrice, thumbnail, stock }),
    );
  };

  return (
    <motion.div
      className="card h-100 shadow-sm border-0"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
    >
      <Link
        to={`/product/${id}`}
        className="text-decoration-none text-reset position-relative"
      >
        {hasDiscount && (
          <span className="badge bg-danger position-absolute top-0 start-0 m-2">
            -{Math.round(discountPercentage)}%
          </span>
        )}
        <img
          src={thumbnail}
          alt={title}
          className="card-img-top p-3"
          style={{ height: 200, objectFit: 'contain' }}
          loading="lazy"
        />
      </Link>

      <div className="card-body d-flex flex-column">
        <Link
          to={`/product/${id}`}
          className="text-decoration-none text-reset"
        >
          <h2
            className="card-title fs-6 mb-1 text-truncate"
            title={title}
          >
            {title}
          </h2>
        </Link>

        <div className="mb-2">
          <RatingStars rating={rating} />
        </div>

        <div className="mb-3">
          <span className="fw-bold text-danger me-2">${finalPrice}</span>
          {hasDiscount && (
            <small className="text-muted text-decoration-line-through">
              ${price}
            </small>
          )}
        </div>

        <button
          type="button"
          className="btn btn-primary w-100 mt-auto"
          disabled={isSoldOut}
          onClick={handleAdd}
        >
          {isSoldOut ? '已售罄' : '加入購物車'}
        </button>
      </div>
    </motion.div>
  );
}

export default ProductCard;
