import { useState, useRef, useEffect } from 'react';

interface CustomSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
  style?: React.CSSProperties;
  className?: string;
}

export default function CustomSelect({ value, onChange, options, style, className }: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((o) => o.value === value) || options[0];

  return (
    <div ref={containerRef} className={`custom-select-container ${className || ''}`} style={style}>
      <button
        type="button"
        className={`form-select custom-select-trigger ${open ? 'custom-select-trigger--open' : ''}`}
        onClick={() => setOpen(!open)}
      >
        <span>{selectedOption.label}</span>
      </button>
      
      {open && (
        <div className="custom-select-dropdown">
          <ul className="custom-select-list">
            {options.map((opt) => (
              <li
                key={opt.value}
                className={`custom-select-option ${opt.value === value ? 'custom-select-option--selected' : ''}`}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
              >
                {opt.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
