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
  const [dropUp, setDropUp] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  /* Cerrar al hacer clic fuera */
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /* Decidir si abrir hacia arriba o hacia abajo */
  function handleToggle() {
    if (!open && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const dropdownH = triggerClassName?.includes('compact') ? 200 : 310;
      setDropUp(spaceBelow < dropdownH);
    }
    setOpen((o) => !o);
  }

  const selectedOption = options.find((o) => !o.isGroup && o.value === value) || options.find((o) => !o.isGroup) || options[0];

  return (
    <div ref={containerRef} id={id} className={`custom-select-container ${className || ''}`} style={style}>
      <button type="button" className={`form-select custom-select-trigger ${open ? 'custom-select-trigger--open' : ''} ${triggerClassName || ''}`} onClick={handleToggle}>
        <span>{selectedOption?.label}</span>
      </button>

      {open && (
        <div className={`custom-select-dropdown ${dropUp ? 'custom-select-dropdown--up' : ''}`}>
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
