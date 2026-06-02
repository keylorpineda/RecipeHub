import { useState } from 'react';

interface StarRatingProps {
  value: number;
  onChange?: (v: number) => void;
  size?: string;
}

export default function StarRating({ value, onChange, size = '1.2rem' }: StarRatingProps) {
  const [hovered, setHovered] = useState(0);
  const interactive = Boolean(onChange);
  const display = hovered || value;

  return (
    <div className="star-rating" role={interactive ? 'radiogroup' : undefined}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={['star', n <= display ? 'star--filled' : '', interactive ? 'star--interactive' : ''].join(' ')}
          style={{ fontSize: size }}
          onMouseEnter={() => interactive && setHovered(n)}
          onMouseLeave={() => interactive && setHovered(0)}
          onClick={() => onChange?.(n)}
          role={interactive ? 'radio' : undefined}
          aria-checked={interactive ? n === value : undefined}
          aria-label={interactive ? `${n} estrella${n > 1 ? 's' : ''}` : undefined}
          tabIndex={interactive ? 0 : -1}
          onKeyDown={(e) => {
            if (interactive && (e.key === 'Enter' || e.key === ' ')) onChange?.(n);
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}
