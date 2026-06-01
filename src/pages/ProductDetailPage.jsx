import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import { FaArrowLeft, FaShoppingCart } from 'react-icons/fa';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { useGetProductByIdQuery } from '../store/api/productsApi';
import { addToCart } from '../store/slices/cartSlice';
import RatingStars from '../components/RatingStars';

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: product, isLoading, isError, refetch } =
    useGetProductByIdQuery(id);

  if (isLoading) {
    return (
      <div className="row g-4">
        <div className="col-lg-6">
          <div className="skeleton" style={{ height: 400, borderRadius: 8 }} />
        </div>
        <div className="col-lg-6">
          <div className="skeleton mb-3" style={{ height: 32, width: '70%' }} />
          <div className="skeleton mb-3" style={{ height: 20, width: '40%' }} />
          <div className="skeleton mb-3" style={{ height: 24, width: '30%' }} />
          <div className="skeleton mb-2" style={{ height: 14, width: '100%' }} />
          <div className="skeleton mb-2" style={{ height: 14, width: '90%' }} />
          <div className="skeleton mt-4" style={{ height: 48, width: '100%' }} />
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="text-center py-5">
        <p className="text-muted mb-3">找不到這個商品，或載入失敗。</p>
        <button
          type="button"
          className="btn btn-outline-secondary me-2"
          onClick={() => navigate('/')}
        >
          回首頁
        </button>
        <button type="button" className="btn btn-primary" onClick={refetch}>
          重新載入
        </button>
      </div>
    );
  }

  const {
    title,
    description,
    price,
    discountPercentage,
    rating,
    stock,
    brand,
    category,
    images,
    thumbnail,
    reviews = [],
  } = product;

  const isSoldOut = stock <= 0;
  const hasDiscount = discountPercentage > 0;
  const finalPrice = +(price * (1 - discountPercentage / 100)).toFixed(2);
  const gallery = images?.length ? images : [thumbnail];

  const handleAdd = () => {
    dispatch(
      addToCart({ id: product.id, title, price: finalPrice, thumbnail, stock }),
    );
  };

  return (
    <div>
      <button
        type="button"
        className="btn btn-link text-decoration-none ps-0 mb-3"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft className="me-2" />
        返回
      </button>

      <div className="row g-4">
        <div className="col-lg-6">
          <Swiper
            className="detail-gallery shadow-sm"
            modules={[Pagination, Navigation]}
            pagination={{ clickable: true }}
            navigation
            spaceBetween={10}
            slidesPerView={1}
          >
            {gallery.map((img, index) => (
              <SwiperSlide key={`${img}-${index}`}>
                <img src={img} alt={`${title} 圖 ${index + 1}`} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="col-lg-6">
          <div className="d-flex gap-2 mb-2">
            {brand && <span className="badge bg-secondary">{brand}</span>}
            {category && (
              <span className="badge bg-light text-dark border">{category}</span>
            )}
          </div>

          <h1 className="h3 mb-2">{title}</h1>

          <div className="mb-3">
            <RatingStars rating={rating} />
          </div>

          <div className="mb-3">
            <span className="fs-3 fw-bold text-danger me-2">${finalPrice}</span>
            {hasDiscount && (
              <>
                <span className="text-muted text-decoration-line-through me-2">
                  ${price}
                </span>
                <span className="badge bg-danger align-middle">
                  -{Math.round(discountPercentage)}%
                </span>
              </>
            )}
          </div>

          <p className="mb-3">
            {isSoldOut ? (
              <span className="badge bg-secondary">已售罄</span>
            ) : (
              <span className="text-success">
                庫存：{stock} 件{stock <= 5 && '（即將售完）'}
              </span>
            )}
          </p>

          <p className="text-muted">{description}</p>

          <button
            type="button"
            className="btn btn-primary btn-lg w-100 mt-3 d-inline-flex align-items-center justify-content-center gap-2"
            disabled={isSoldOut}
            onClick={handleAdd}
          >
            <FaShoppingCart />
            {isSoldOut ? '已售罄' : '加入購物車'}
          </button>
        </div>
      </div>

      <hr className="my-5" />

      <section>
        <h2 className="h4 mb-4">使用者評論（{reviews.length}）</h2>
        {reviews.length === 0 ? (
          <p className="text-muted">目前還沒有評論。</p>
        ) : (
          <div className="row g-3">
            {reviews.map((review, index) => (
              <div className="col-12 col-md-6" key={index}>
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <strong>{review.reviewerName}</strong>
                      <RatingStars rating={review.rating} showValue={false} />
                    </div>
                    <p className="mb-2">{review.comment}</p>
                    <small className="text-muted">
                      {new Date(review.date).toLocaleDateString('zh-TW')}
                    </small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default ProductDetailPage;
