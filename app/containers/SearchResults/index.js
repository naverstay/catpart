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
  let { bom, listTitles, list, cart, pageY, setTableHeadFixed, currency, count, showResults, highlight, notificationFunc, updateCart } = props;

  const tableHead = React.createRef();

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

  let tHead = (
    <div className={'search-results__row __even __head'}>
      {Object.keys(tableHeader).map((head, hi) => (
        <div key={hi} className={`search-results__cell __${head}`}>
          {tableHeader[head]}
        </div>
      ))}
      <div className="search-results__cell __cart">&nbsp;</div>
    </div>
  );

  useEffect(() => {
    setTableHeadFixed(tableHead.current.getBoundingClientRect().y <= 0 ? <div className={'search-results__table __sticky'}>{tHead}</div> : null);

    return () => {
      tableHead.current = false;
    };
  }, [pageY]);

  return (
    <div className="search-results">
      <div className="search-results__table">
        <div ref={tableHead} className={'search-results__head-wrapper'}>
          {tHead}
        </div>
        {list && list.length ? (
          bom ? (
            listTitles.map((t, ti) => (
              <div key={ti}>
                <div className={'search-results__title'}>{t.q}</div>
                {list.map((row, ri) => (
                  <SearchRow key={ri} updateCart={updateCart} tableHeader={tableHeader} defaultCount={defaultCount} currency={currency} highlight={highlight} notificationFunc={notificationFunc} row={row} rowIndex={ri} />
                ))}
              </div>
            ))
          ) : (
            list.map((row, ri) => <SearchRow key={ri} updateCart={updateCart} tableHeader={tableHeader} defaultCount={defaultCount} currency={currency} highlight={highlight} notificationFunc={notificationFunc} row={row} rowIndex={ri} />)
          )
        ) : showResults ? null : (
          <Skeleton />
        )}
      </div>
    </div>
  );
}

SearchResults.propTypes = {
  list: PropTypes.array,
};

export default connect(null)(SearchResults);
