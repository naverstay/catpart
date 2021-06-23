/**
 * SearchResults
 *
 * Lists the name and the issue count of a repository
 */

import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Skeleton from '../Skeleton';
import SearchRow from '../SearchRow';

export function SearchResults(props) {
  let { list, cart, currency, count, showResults, highlight, notificationFunc, updateCart } = props;

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

        {showResults && list && list.length ? list.map((row, ri) => <SearchRow key={ri} updateCart={updateCart} tableHeader={tableHeader} defaultCount={defaultCount} currency={currency} highlight={highlight} row={row} rowIndex={ri} />) : <Skeleton />}
      </div>
    </div>
  );
}

SearchResults.propTypes = {
  list: PropTypes.array,
};

export default connect(null)(SearchResults);
