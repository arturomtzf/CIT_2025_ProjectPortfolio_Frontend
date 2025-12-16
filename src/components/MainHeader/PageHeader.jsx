import React from 'react';

function PageHeader({ title, subtitle }) {
  return (
    <header style={{
      background: 'linear-gradient(90deg, rgba(245,197,24,0.06), rgba(0,0,0,0))',
      padding: '48px 0',
      borderBottom: '1px solid rgba(255,255,255,0.04)'
    }}>
      <div className="container">
        <h1 style={{
          margin: 0,
          fontSize: '3rem',
          lineHeight: 1.05,
          fontWeight: 700,
          color: '#fff',
          letterSpacing: '-0.02rem',
          textShadow: '0 4px 18px rgba(0,0,0,0.6)'
        }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{
            marginTop: 8,
            color: 'rgba(255,255,255,0.75)',
            fontSize: '1rem'
          }}>
            {subtitle}
          </p>
        )}
      </div>
    </header>
  );
}

export default PageHeader;
