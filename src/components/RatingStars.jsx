import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

function RatingStars({ rating = 0, showValue = true }) {
  const stars = [];
  for (let i = 1; i <= 5; i += 1) {
    if (rating >= i) {
      stars.push(<FaStar key={i} className="text-warning" />);
    } else if (rating >= i - 0.5) {
      stars.push(<FaStarHalfAlt key={i} className="text-warning" />);
    } else {
      stars.push(<FaRegStar key={i} className="text-warning" />);
    }
  }

  return (
    <span className="d-inline-flex align-items-center gap-1">
      {stars}
      {showValue && <small className="text-muted ms-1">{rating.toFixed(1)}</small>}
    </span>
  );
}

export default RatingStars;
