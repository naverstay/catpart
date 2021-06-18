/**
 * SearchResults
 *
 * Lists the name and the issue count of a repository
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { FormattedNumber } from 'react-intl';

import { makeSelectCurrentUser } from 'containers/App/selectors';
import Ripples from 'react-ripples';

export function SearchResults(props) {
  let { list } = props;

  //list = list.concat(list).concat(list);

  const tableHeader = {
    provider: 'Поставщик',
    item: 'Наименование',
    brand: 'Бренд',
    available: 'Доступно',
    multiplicity: 'Кратность',
    min: 'MIN',
    norm: 'Норма уп.',
    price: 'Цена за ед.',
    total: 'Сумма',
    term: 'Срок',
  };

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
                <span className="search-results__label">{tableHeader[cell]}</span>
                <span className={'search-results__value'}>
                  {cell === 'price'
                    ? Object.keys(row.price).map((p, pi) => (
                        <span key={pi} className="search-results__item">
                          {parseFloat(row.price[p])}
                        </span>
                      ))
                    : cell === 'total'
                    ? Object.keys(row.price).map((p, pi) => (
                        <span key={pi} className="search-results__item">
                          x{p}={(parseFloat(p) * parseFloat(row.price[p])).toFixed(2)}
                        </span>
                      ))
                    : row[cell]}
                </span>
              </div>
            ))}

            <div className="search-results__cell __cart">
              <div className="search-results__cart">
                <input type="text" className="input" />
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
