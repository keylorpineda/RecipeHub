export default function SkeletonCard({ wide = false }: { wide?: boolean }) {
  return (
    <div className={`skeleton-card${wide ? ' recipe-card--wide' : ''}`}>
      {/* Image block using padding-top trick to match recipe-card__figure ratio */}
      <div style={{ position: 'relative', paddingTop: '72%' }}>
        <div className="skeleton" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
      </div>
      <div className="skeleton-card__body" style={{ padding: '14px 4px' }}>
        <div className="skeleton skeleton-card__line" style={{ height: 9, width: '38%' }} />
        <div className="skeleton skeleton-card__line" style={{ height: 18, width: '90%', marginTop: 8 }} />
        <div className="skeleton skeleton-card__line" style={{ height: 18, width: '72%' }} />
        <div className="skeleton skeleton-card__line" style={{ height: 11, width: '55%', marginTop: 4 }} />
        <div className="skeleton skeleton-card__line" style={{ height: 9, width: '30%', marginTop: 6 }} />
      </div>
    </div>
  );
}
