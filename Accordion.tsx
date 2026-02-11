import React, { useState } from 'react';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({ title, children }) => {
  // Track whether this accordion is open or not
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div style={styles.accordionContainer}>
      <button style={styles.accordionHeader} onClick={toggleOpen}>
        <span>{title}</span>
        <span>{isOpen ? '▲' : '▼'}</span>
      </button>
      {isOpen && <div style={styles.accordionContent}>{children}</div>}
    </div>
  );
};

const styles = {
  accordionContainer: {
    marginBottom: '1rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  accordionHeader: {
    width: '100%',
    backgroundColor: '#8B5A67', // example color, idk what to use
    color: 'white',
    padding: '0.75rem 1rem',
    fontSize: '1rem',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    border: 'none',
    outline: 'none',
  },
  accordionContent: {
    padding: '1rem',
    backgroundColor: '#f9f9f9',
  },
} as const;

export default Accordion;
