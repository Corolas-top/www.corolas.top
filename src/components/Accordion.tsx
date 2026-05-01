import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
}

export default function Accordion({ title, children }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      style={{
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '8px',
        backgroundColor: '#0e0e10',
        overflow: 'hidden',
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 24px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: '#ffffff',
        }}
      >
        <span style={{ fontSize: '18px', fontWeight: 500 }}>{title}</span>
        <ChevronDown
          size={18}
          style={{
            color: 'rgba(255,255,255,0.4)',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
          }}
        />
      </button>
      <div
        style={{
          maxHeight: isOpen ? '800px' : '0',
          opacity: isOpen ? 1 : 0,
          overflow: 'hidden',
          transition: 'max-height 0.4s ease, opacity 0.3s ease',
        }}
      >
        <div
          style={{
            padding: '0 24px 24px',
            fontSize: '14px',
            color: 'rgba(255,255,255,0.6)',
            lineHeight: 1.7,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
