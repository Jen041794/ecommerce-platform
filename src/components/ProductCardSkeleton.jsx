function ProductCardSkeleton() {
  return (
    <div className="card h-100 shadow-sm border-0" aria-hidden="true">
      <div className="skeleton" style={{ height: 200, margin: '1rem' }} />
      <div className="card-body">
        <div className="skeleton mb-2" style={{ height: 18, width: '85%' }} />
        <div className="skeleton mb-2" style={{ height: 14, width: '55%' }} />
        <div className="skeleton mb-3" style={{ height: 14, width: '40%' }} />
        <div className="skeleton" style={{ height: 38, width: '100%' }} />
      </div>
    </div>
  );
}

export default ProductCardSkeleton;
