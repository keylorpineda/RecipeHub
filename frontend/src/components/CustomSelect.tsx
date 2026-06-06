import { useState, useRef, useEffect } from 'react';

export interface SelectOption {
  value: string;
  label: string;
  /** Si es true, se renderiza como cabecera de grupo (no seleccionable) */
  isGroup?: boolean;
}

interface CustomSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: SelectOption[];
  style?: React.CSSProperties;
  className?: string;
  id?: string;
  /** Clase adicional para el botón trigger (ej. "custom-select-trigger--compact") */
  triggerClassName?: string;
}

export default function CustomSelect({ value, onChange, options, style, className, id, triggerClassName }: CustomSelectProps) {
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

  const selectedOption = options.find((o) => !o.isGroup && o.value === value) || options.find((o) => !o.isGroup) || options[0];

  return (
    <div ref={containerRef} id={id} className={`custom-select-container ${className || ''}`} style={style}>
      <button type="button" className={`form-select custom-select-trigger ${open ? 'custom-select-trigger--open' : ''} ${triggerClassName || ''}`} onClick={() => setOpen(!open)}>
        <span>{selectedOption?.label}</span>
      </button>

      {open && (
        <div className="custom-select-dropdown">
          <ul className="custom-select-list">
            {options.map((opt, i) =>
              opt.isGroup ? (
                <li key={`group-${i}`} className="custom-select-group">
                  {opt.label}
                </li>
              ) : (
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
              ),
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
