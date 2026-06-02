export default function SkeletonCard({ wide = false }: { wide?: boolean }) {
  return (
    <div className={`skeleton-card${wide ? ' recipe-card--wide' : ''}`}>
      <div className={`skeleton-card__image skeleton ${wide ? 'skeleton-card__image--wide' : ''}`} />
      <div className="skeleton-card__body">
        <div className="skeleton skeleton-card__line" style={{ height: 10, width: '45%' }} />
        <div className="skeleton skeleton-card__line" style={{ height: 16, width: '85%' }} />
        <div className="skeleton skeleton-card__line" style={{ height: 16, width: '65%' }} />
        <div className="skeleton skeleton-card__line" style={{ height: 10, width: '40%', marginTop: 4 }} />
      </div>
    </div>
  );
}
