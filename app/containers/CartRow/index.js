import React, { createRef, useEffect, useState } from 'react';
import priceFormatter from '../../utils/priceFormatter';
import Ripples from 'react-ripples';
import { setInputFilter } from '../../utils/inputFilter';

const CartRow = props => {
  let { rowIndex, tableHeader, currency, row, highlight, defaultCount, updateCart } = props;

  const inputRef = createRef();

  const [cartCount, setCartCount] = useState(parseFloat(row.cart));

  useEffect(() => {
    setInputFilter(inputRef.current, function(value) {
      return /^\d*$/.test(value); // Allow digits and '.' only, using a RegExp
    });

    return () => {
      inputRef.current = false;
    };
  }, []);

  return (
    <div className={`cart-results__row${rowIndex % 2 === 0 ? ' __odd' : ' __even'}`}>
      {Object.keys(tableHeader).map((cell, ci) =>
        cell === 'brand' ? null : (
          <div key={ci} className={`cart-results__cell __${cell}`}>
            {cell === 'manufacturer' ? (
              <>
                <p>
                  <span className="cart-results__label __show">{tableHeader[cell]}:</span>
                  <span className={'cart-results__value'}>{row[cell]}</span>
                </p>
                <p>
                  <span className="cart-results__label __show">{tableHeader.brand}:</span>
                  <span className={'cart-results__value'}>{row.brand}</span>
                </p>
              </>
            ) : (
              <>
                {cell === 'name' ? null : <span className="cart-results__label">{tableHeader[cell]}</span>}
                <span className={'cart-results__value'}>
                  {cell === 'pricebreaks'
                    ? row.pricebreaks.slice(0, 1).map((p, pi) => (
                        <span key={pi} className="cart-results__item">
                          {priceFormatter(parseFloat(p.price / currency.exChange).toFixed(2))}
                        </span>
                      ))
                    : cell === 'quantity'
                    ? row.pricebreaks.slice(0, 1).map((p, pi) => (
                        <div key={pi} className="cart-results__count">
                          <input
                            ref={inputRef}
                            onChange={e => {
                              let val = +e.target.value;
                              if (val > 0) {
                                setCartCount(parseFloat(val));
                                console.log('row', row);
                              } else {
                                e.target.value = '1';
                              }
                            }}
                            onBlur={e => {
                              updateCart(row.id, +e.target.value, row.cur);
                            }}
                            defaultValue={cartCount}
                            type="text"
                            className="input"
                          />
                        </div>
                      ))
                    : cell === 'total'
                    ? row.pricebreaks.slice(0, 1).map((p, pi) => (
                        <span key={pi} className="cart-results__item">
                          {priceFormatter((cartCount * parseFloat(p.price / currency.exChange)).toFixed(2))}
                        </span>
                      ))
                    : row[cell] || '!' + cell + '!'}
                </span>
              </>
            )}
          </div>
        ),
      )}

      <div className="cart-results__cell __cart">
        <div className="cart-results__remove">
          <Ripples
            onClick={() => {
              updateCart(row.id, 0, {});
            }}
            during={1000}
            className="btn __blue"
          >
            <button name={'cart-row-rm-' + row.id} className="btn-inner">
              <span className="btn__icon icon icon-close" />
            </button>
          </Ripples>
        </div>
      </div>
    </div>
  );
};

export default CartRow;