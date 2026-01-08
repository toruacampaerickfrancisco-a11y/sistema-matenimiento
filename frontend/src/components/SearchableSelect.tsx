import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

interface Option {
  value: string;
  label: string;
  subLabel?: string;
  extraInfo?: string;
}

interface SearchableSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Seleccionar...",
  className = "",
  required = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filtrar opciones
  const filteredOptions = options.filter(opt => 
    opt.label.toLowerCase().includes(search.toLowerCase()) || 
    (opt.subLabel && opt.subLabel.toLowerCase().includes(search.toLowerCase())) ||
    (opt.extraInfo && opt.extraInfo.toLowerCase().includes(search.toLowerCase()))
  );

  const selectedOption = options.find(opt => opt.value === value);

  // Estilos "Windows System" Design
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    fontFamily: '"Segoe UI", "Tahoma", "Geneva", "Verdana", sans-serif',
    fontSize: '14px',
  };

  const controlStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    border: isOpen ? '1px solid #0078D7' : '1px solid #8d8d8d', // #0078D7 es el azul de Windows
    borderRadius: '2px', // Bordes más cuadrados
    padding: '4px 8px', // Altura compacta
    cursor: 'default',
    minHeight: '30px',
    boxShadow: isOpen ? '0 0 0 1px #0078D7' : 'none', // Focus ring azul
    transition: 'all 0.1s ease',
  };

  const dropdownStyle: React.CSSProperties = {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    border: '1px solid #8d8d8d',
    boxShadow: '2px 2px 5px rgba(0,0,0,0.2)',
    marginTop: '0px',
    zIndex: 100,
    maxHeight: '300px',
    display: 'flex',
    flexDirection: 'column',
  };

  const searchInputContainerStyle: React.CSSProperties = {
    padding: '4px',
    borderBottom: '1px solid #e0e0e0',
    backgroundColor: '#f9f9f9'
  };

  const searchInputStyle: React.CSSProperties = {
    width: '100%',
    padding: '4px',
    border: '1px solid #a0a0a0',
    fontSize: '13px',
    outline: 'none',
    borderRadius: '0px'
  };

  return (
    <div className={`searchable-select-container ${className}`} ref={dropdownRef} style={containerStyle}>
      {/* Botón principal (Control) */}
      <div 
        role="combobox"
        aria-expanded={isOpen}
        style={controlStyle}
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) setTimeout(() => inputRef.current?.focus(), 50);
        }}
        onMouseEnter={(e) => {
          if (!isOpen) e.currentTarget.style.borderColor = '#555';
        }}
        onMouseLeave={(e) => {
          if (!isOpen) e.currentTarget.style.borderColor = '#8d8d8d';
        }}
      >
        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, color: selectedOption ? '#000' : '#666' }}>
          {selectedOption ? (
            <span>
              <span style={{ fontWeight: 400 }}>{selectedOption.label}</span>
              {selectedOption.subLabel && <span style={{ color: '#666', marginLeft: '8px', fontSize: '0.9em' }}>{selectedOption.subLabel}</span>}
            </span>
          ) : (
            <span style={{ fontStyle: 'italic', color: '#888' }}>{placeholder}</span>
          )}
        </div>
        <ChevronDown size={14} color="#444" strokeWidth={2} />
      </div>

      {/* Menú Desplegable */}
      {isOpen && (
        <div style={dropdownStyle}>
          {/* Barra de búsqueda */}
          <div style={searchInputContainerStyle}>
            <input
              ref={inputRef}
              type="text"
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={searchInputStyle}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Lista de Opciones */}
          <div style={{ overflowY: 'auto', flex: 1, maxHeight: '260px' }}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map(opt => {
                const isSelected = value === opt.value;
                return (
                  <div
                    key={opt.value}
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                      setSearch("");
                    }}
                    style={{
                      padding: '4px 8px',
                      cursor: 'default',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: isSelected ? '#cce8ff' : 'white', // Azul de selección de lista
                      color: isSelected ? '#000' : '#000',
                      borderBottom: '1px solid transparent'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        // Simulating Windows hover
                        e.currentTarget.style.backgroundColor = '#e5f3ff';
                        e.currentTarget.style.border = '1px solid #e5f3ff'; // usually invisible or same color
                        e.currentTarget.style.margin = '0px'; 
                        e.currentTarget.style.padding = '3px 7px'; // Adjust for border? simpler is just BG
                        // Revert complexity, just BG
                         e.currentTarget.style.border = 'none';
                         e.currentTarget.style.padding = '4px 8px';
                         e.currentTarget.style.backgroundColor = '#e5f3ff';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = 'white';
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                      <span style={{ fontSize: '13px' }}>{opt.label}</span>
                      {(opt.subLabel || opt.extraInfo) && (
                         <div style={{ display: 'flex', gap: '8px', fontSize: '11px', color: '#666' }}>
                           {opt.subLabel && <span>{opt.subLabel}</span>}
                           {opt.extraInfo && <span>• {opt.extraInfo}</span>}
                         </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ padding: '8px', textAlign: 'center', color: '#888', fontStyle: 'italic', fontSize: '12px' }}>
                (Vacío)
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
