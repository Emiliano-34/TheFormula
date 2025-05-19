// src/components/FlashDeals.jsx
import React from 'react';
import ProductCard from './ProductCard';

const FlashDeals = ({ products = [], timeLeft }) => {
  return (
    <section className="flash-deals">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Ofertas fugaces</h2>
          <div className="countdown-timer">
            {['days', 'hours', 'minutes', 'seconds'].map((unit, i) => (
              <React.Fragment key={unit}>
                <div className="time-block">
                  <div className="time-value">{timeLeft?.[unit] || '00'}</div>
                  <div className="time-label">{unit.charAt(0).toUpperCase() + unit.slice(1)}</div>
                </div>
                {i < 3 && <div className="time-separator">:</div>}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="products-grid">
          {products.map(product => (
            <ProductCard key={product.id} product={product} isDeal={true} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FlashDeals;
