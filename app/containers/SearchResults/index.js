/**
 * SearchResults
 *
 * Lists the name and the issue count of a repository
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { FormattedNumber } from 'react-intl';

import { makeSelectCurrentUser } from 'containers/App/selectors';
import Ripples from 'react-ripples';
import priceFormatter from '../../utils/priceFormatter';

export function SearchResults(props) {
  let { list, cart, currency, count } = props;
  let prevY = 0;

  //const query = new URLSearchParams(location.search);

  let defaultCount = count;

  let tableHeader = {
    manufacturer: 'Поставщик',
    name: 'Наименование',
    brand: 'Бренд',
    quantity: 'Доступно',
    price_unit: 'Кратность',
    moq: 'MIN',
    pack_quant: 'Норма уп.',
    pricebreaks: 'Цена за ед.',
    total: 'Сумма',
    delivery_period: 'Срок',
  };

  //list = list.concat(list).concat(list);

  //useEffect(() => {
  //  console.log('useEffect', window);
  //
  //  window.addEventListener('scroll', evt => {
  //    let action = window.scrollY > 50 && window.scrollY - prevY > 0 ? 'add' : 'remove';
  //
  //    console.log('scroll-down', action);
  //
  //    //document.getElementById('root').classList[action]('scroll-down');
  //
  //    prevY = window.scrollY;
  //  });
  //}, []);

  // Render the content into a list item
  return (
    <div className="search-results">
      <div className="search-results__table">
        <div className="search-results__row __even __head">
          {Object.keys(tableHeader).map((head, hi) => (
            <div key={hi} className={`search-results__cell __${head}`}>
              {tableHeader[head]}
            </div>
          ))}
          <div className="search-results__cell __cart">&nbsp;</div>
        </div>

        {list.map((row, rowIndex) => (
          <div key={rowIndex} className={`search-results__row${rowIndex % 2 === 0 ? ' __odd' : ' __even'}`}>
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
                    : row[cell] || '!' + cell + '!'}
                </span>
              </div>
            ))}

            <div className="search-results__cell __cart">
              <div className="search-results__cart">
                <input defaultValue={defaultCount || row.min} type="text" className="input" />
                <div className="search-results__add">
                  <Ripples during={1000}>
                    <div className="btn __blue">
                      <span className="btn__icon icon icon-cart" />
                    </div>
                  </Ripples>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

SearchResults.propTypes = {
  list: PropTypes.array,
};

export default connect(null)(SearchResults);
