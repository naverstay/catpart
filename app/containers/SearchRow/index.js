import React, { createRef, useEffect, useState } from 'react';
import priceFormatter from '../../utils/priceFormatter';
import Ripples from 'react-ripples';
import { setInputFilter } from '../../utils/inputFilter';

const SearchRow = props => {
  let { rowIndex, tableHeader, currency, row, highlight, defaultCount, updateCart } = props;

  const inputRef = createRef();
  const [disableAddBtn, setDisableAddBtn] = useState(false);

  let textHighlighter = txt => {
    let ret = <>{txt}</>;

    if (highlight.length) {
      let rx = new RegExp(highlight, 'i');
      ret = (
        <>
          <b>{highlight}</b>
          {txt.replace(rx, '')}
        </>
      );
    }

    return ret;
  };

  useEffect(() => {
    setInputFilter(inputRef.current, function(value) {
      return /^\d*\.?\d*$/.test(value); // Allow digits and '.' only, using a RegExp
    });
  }, []);

  return (
    <div className={`search-results__row${rowIndex % 2 === 0 ? ' __odd' : ' __even'}`}>
      {Object.keys(tableHeader).map((cell, ci) => (
        <div key={ci} className={`search-results__cell __${cell}`}>
          {cell === 'name' ? null : <span className="search-results__label">{tableHeader[cell]}</span>}
          <span className={'search-results__value'}>
            {cell === 'pricebreaks'
              ? row.pricebreaks.map((p, pi) => (
                  <span key={pi} className="search-results__item">
                    {priceFormatter(parseFloat(p.price / currency.exChange).toFixed(2))}
                  </span>
                ))
              : cell === 'total'
              ? row.pricebreaks.map((p, pi) => (
                  <span key={pi} className="search-results__item">
                    x{p.quant}={priceFormatter((parseFloat(p.quant) * parseFloat(p.price / currency.exChange)).toFixed(2))}
                  </span>
                ))
              : row[cell]
              ? cell === 'name'
                ? textHighlighter(row[cell])
                : row[cell]
              : '!' + cell + '!'}
          </span>
        </div>
      ))}

      <div className="search-results__cell __cart">
        <div className="search-results__cart">
          <input
            ref={inputRef}
            onChange={e => {
              setDisableAddBtn(!e.target.value.length || +e.target.value < 1);
            }}
            defaultValue={defaultCount || row.min}
            type="text"
            className="input"
          />
          <div className="search-results__add">
            <Ripples
              onClick={() => {
                updateCart(row.id, +inputRef.current.value, currency);
              }}
              during={1000}
              className={'btn __blue' + (disableAddBtn ? ' __disabled' : '')}
            >
              <btn disabled={disableAddBtn} className="btn-inner">
                <span className="btn__icon icon icon-cart" />
              </btn>
            </Ripples>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchRow;
