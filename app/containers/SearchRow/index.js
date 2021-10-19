import React, { createRef, useEffect, useState } from 'react';
import Ripples from 'react-ripples';
import priceFormatter from '../../utils/priceFormatter';

import { setInputFilter } from '../../utils/inputFilter';
import { findPriceIndex } from '../../utils/findPriceIndex';

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

const SearchRow = props => {
  let { rowIndex, tableHeader, currencyList, updateSupplierItems, currency, row, highlight, defaultCount, updateCart, notificationFunc } = props;
  defaultCount = +defaultCount;

  if (!defaultCount || defaultCount < row.moq) {
    defaultCount = row.moq;
  }

  if (!defaultCount || defaultCount > row.quantity) {
    defaultCount = row.quantity;
  }

  const getUSDExchange = () => {
    const USD = currencyList.find(f => f.name === 'USD');
    return USD && USD.hasOwnProperty('exChange') ? USD.exChange : 1;
  };

  const LOUISYEN_PRICE_LIMIT = 1500;
  let priceMatch = defaultCount ? row.pricebreaks.length - 1 : -1;
  const inputRef = createRef();
  const [disableAddBtn, setDisableAddBtn] = useState(false);
  const [itemCount, setItemCount] = useState(defaultCount || 1);
  const [isAbove1500, setIsAbove1500] = useState((defaultCount * row.pricebreaks[priceMatch].price) / getUSDExchange() > LOUISYEN_PRICE_LIMIT);
  const extraSymbols = [',', '.', '-', ' ', '#', '_', '+', ')', '(', '[', ']'];

  const textHighlighter = (txt, bold) => {
    let ret = <>{txt}</>;

    if (bold && bold.length) {
      // let rx = new RegExp(escapeRegExp(highlight), 'i');

      ret = (
        <>
          <b>{bold}</b>
          {txt.slice(bold.length)}
        </>
      );
    }

    return ret;
  };

  const updateItemCount = count => {
    if (row.supplier === 'Louisyen') {
      updateSupplierItems('Louisyen', row, priceMatch, count);

      if ((count * row.pricebreaks[priceMatch].price) / getUSDExchange() > LOUISYEN_PRICE_LIMIT) {
        if (!isAbove1500) {
          console.log('updateItemPrice up');
          setIsAbove1500(true);
        }
      } else {
        if (isAbove1500) {
          console.log('updateItemPrice down');
          setIsAbove1500(false);
        }
      }
    }

    setItemCount(count);
  };

  const priceHighlighter = (ind, price) => (ind === priceMatch ? <b>{price}</b> : <>{price}</>);

  useEffect(() => {
    setInputFilter(inputRef.current, function(value) {
      return /^\d*$/.test(value); // Allow digits and '.' only, using a RegExp
    });

    return () => {
      inputRef.current = false;
    };
  }, []);

  if (itemCount) {
    priceMatch = findPriceIndex(row.pricebreaks, itemCount);
  }

  return (
    <div className={`search-results__row${rowIndex % 2 === 0 ? ' __odd' : ' __even'}`}>
      {Object.keys(tableHeader).map((cell, ci) => (
        <div key={ci} className={`search-results__cell __${cell}`}>
          {cell === 'name' ? null : <span className="search-results__label">{tableHeader[cell]}</span>}
          <span className="search-results__value">
            {cell === 'pricebreaks' ? (
              row.pricebreaks.map((p, pi) => (
                <span key={pi} className="search-results__item">
                  {priceHighlighter(pi, priceFormatter(parseFloat(p.price / currency.exChange).toFixedCustom(currency.precision), currency.precision))}
                </span>
              ))
            ) : cell === 'total' ? (
              row.pricebreaks.map((p, pi) => (
                <span key={pi} className="search-results__item">
                  {priceHighlighter(pi, `x${pi === priceMatch ? itemCount : p.quant}=${priceFormatter(parseFloat(((pi === priceMatch ? itemCount : p.quant) * p.price) / currency.exChange).toFixedCustom(currency.precision), currency.precision)}`)}
                </span>
              ))
            ) : cell === 'supplier' ? (
              row.supplierAlias
            ) : row[cell] ? (
              cell === 'name' ? (
                textHighlighter(row[cell], row.bold)
              ) : (
                row[cell]
              )
            ) : (
              <span data-empty={cell} />
            )}
          </span>
        </div>
      ))}

      <div className="search-results__cell __cart">
        <label className="search-results__cart">
          <input
            ref={inputRef}
            onChange={e => {
              // setDisableAddBtn(!e.target.value.length || +e.target.value < 1);

              const val = +(e.target.value || 1);
              if (val > 0) {
                updateItemCount(Math.max(row.moq, val));
                // updateCart(row.id, val, row.cur);
              }
            }}
            onBlur={e => {
              const val = +(e.target.value || 1);
              if (e.target.value.length && val < row.moq) {
                e.target.value = `${row.moq}`;
                updateItemCount(row.moq);
                notificationFunc('success', `Для ${row.name}`, `минимальное количество: ${row.moq}`);
              }
              if (e.target.value.length && val > row.quantity) {
                e.target.value = `${row.quantity}`;
                updateItemCount(row.quantity);
                notificationFunc('success', `Для ${row.name}`, `максимальное количество: ${row.quantity}`);
              }
            }}
            // value={itemCount}
            placeholder={itemCount}
            type="text"
            className="input"
          />
          <div className="search-results__add">
            <Ripples
              onClick={() => {
                updateCart(row.id, +inputRef.current.value || itemCount, currency);
              }}
              during={1000}
              className={`btn __blue${disableAddBtn ? ' __disabled' : ''}`}
            >
              <button aria-label={row.name} name={`search-add-${row.id}`} disabled={disableAddBtn} className="btn-inner">
                <span className="btn__icon icon icon-cart" />
              </button>
            </Ripples>
          </div>
        </label>
      </div>
    </div>
  );
};

export default SearchRow;
