import React, { createRef, useEffect, useState } from 'react';
import priceFormatter from '../../utils/priceFormatter';
import Ripples from 'react-ripples';

import { setInputFilter } from '../../utils/inputFilter';
import { closestIndex } from '../../utils/closestIndex';

function escapeRegExp(string) {
  console.log('escapeRegExp', string, string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

const SearchRow = props => {
  let { rowIndex, tableHeader, currency, row, highlight, defaultCount, updateCart } = props;
  defaultCount = +defaultCount;

  const inputRef = createRef();
  const [disableAddBtn, setDisableAddBtn] = useState(false);
  let priceMatch = defaultCount ? row.pricebreaks.length - 1 : -1;

  let textHighlighter = txt => {
    let ret = <>{txt}</>;

    if (highlight.length) {
      let rx = new RegExp(escapeRegExp(highlight), 'i');

      ret = (
        <>
          <b>{highlight}</b>
          {txt.replace(rx, '')}
        </>
      );
    }

    return ret;
  };

  let priceHighlighter = (ind, price) => {
    return ind === priceMatch ? <b>{price}</b> : <>{price}</>;
  };

  useEffect(() => {
    setInputFilter(inputRef.current, function(value) {
      return /^\d*$/.test(value); // Allow digits and '.' only, using a RegExp
    });

    return () => {
      inputRef.current = false;
    };
  }, []);

  if (defaultCount) {
    priceMatch = closestIndex(row.pricebreaks, defaultCount);
  }

  return (
    <div className={`search-results__row${rowIndex % 2 === 0 ? ' __odd' : ' __even'}`}>
      {Object.keys(tableHeader).map((cell, ci) => (
        <div key={ci} className={`search-results__cell __${cell}`}>
          {cell === 'name' ? null : <span className="search-results__label">{tableHeader[cell]}</span>}
          <span className={'search-results__value'}>
            {cell === 'pricebreaks'
              ? row.pricebreaks.map((p, pi) => (
                  <span key={pi} className="search-results__item">
                    {priceHighlighter(pi, priceFormatter(parseFloat(p.price / currency.exChange).toFixed(2)))}
                  </span>
                ))
              : cell === 'total'
              ? row.pricebreaks.map((p, pi) => (
                  <span key={pi} className="search-results__item">
                    {priceHighlighter(pi, `x${pi === priceMatch ? defaultCount : p.quant}=${priceFormatter((parseFloat(p.quant) * parseFloat(p.price / currency.exChange)).toFixed(2))}`)}
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
            //onChange={e => {
            //  setDisableAddBtn(!e.target.value.length || +e.target.value < 1);
            //}}
            onChange={e => {
              let val = +e.target.value;
              if (val > 0) {
                //updateCart(row.id, val, row.cur);
              } else {
                //e.target.value = '1';
              }
            }}
            placeholder={defaultCount || row.min}
            type="text"
            className="input"
          />
          <div className="search-results__add">
            <Ripples
              onClick={() => {
                updateCart(row.id, +inputRef.current.value || defaultCount || row.min, currency);
              }}
              during={1000}
              className={'btn __blue' + (disableAddBtn ? ' __disabled' : '')}
            >
              <button name={'search-add-' + row.id} disabled={disableAddBtn} className="btn-inner">
                <span className="btn__icon icon icon-cart" />
              </button>
            </Ripples>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchRow;
