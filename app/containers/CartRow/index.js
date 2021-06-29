import React, { createRef, useEffect, useState } from 'react';
import Ripples from 'react-ripples';
import priceFormatter from '../../utils/priceFormatter';
import { findPriceIndex } from '../../utils/findPriceIndex';
import { setInputFilter } from '../../utils/inputFilter';

const CartRow = props => {
  let { rowIndex, tableHeader, currency, row, highlight, notificationFunc, defaultCount, updateCart } = props;

  const inputRef = createRef();

  const [itemCount, setItemCount] = useState(defaultCount || 1);
  const [cartCount, setCartCount] = useState(parseFloat(row.cart));
  let priceMatch = defaultCount ? row.pricebreaks.length - 1 : -1;

  useEffect(() => {
    setInputFilter(inputRef.current, function(value) {
      return /^\d*$/.test(value); // Allow digits and '.' only, using a RegExp
    });

    return () => {
      inputRef.current = false;
    };
  }, []);

  if (cartCount) {
    priceMatch = findPriceIndex(row.pricebreaks, cartCount);
  }

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
                  {cell === 'pricebreaks' ? (
                    <span className="cart-results__item">{priceFormatter(parseFloat(row.pricebreaks[priceMatch].price / currency.exChange).toFixed(currency.precision), currency.precision)}</span>
                  ) : cell === 'quantity' ? (
                    <div className="cart-results__count">
                      <input
                        ref={inputRef}
                        onChange={e => {
                          let val = +e.target.value;
                          if (val > 0) {
                            setCartCount(parseFloat(val));
                            console.log('row', row);
                          }
                        }}
                        onBlur={e => {
                          let val = +e.target.value;
                          if (val > 0) {
                          } else {
                            e.target.value = '1';
                          }

                          if (e.target.value.length && +e.target.value < row.moq) {
                            e.target.value = row.moq + '';
                            setItemCount(row.moq);

                            notificationFunc('success', `Для ${row.name}`, `минимальное количество: ${row.moq}`);
                          }

                          if (e.target.value.length && +e.target.value > row.quantity) {
                            e.target.value = row.quantity + '';
                            setItemCount(row.quantity);

                            notificationFunc('success', `Для ${row.name}`, `максимальное количество: ${row.quantity}`);
                          }

                          updateCart(row.id, +e.target.value, row.cur);
                        }}
                        defaultValue={cartCount}
                        type="text"
                        className="input"
                      />
                    </div>
                  ) : cell === 'total' ? (
                    <span className="cart-results__item">{priceFormatter((cartCount * parseFloat(row.pricebreaks[priceMatch].price / currency.exChange)).toFixed(currency.precision), currency.precision)}</span>
                  ) : (
                    row[cell] || '!' + cell + '!'
                  )}
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
            <button aria-label={row.name} name={'cart-row-rm-' + row.id} className="btn-inner">
              <span className="btn__icon icon icon-close" />
            </button>
          </Ripples>
        </div>
      </div>
    </div>
  );
};

export default CartRow;
