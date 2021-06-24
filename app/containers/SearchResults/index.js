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
import Collapsible from 'react-collapsible';
import Ripples from 'react-ripples';

export function SearchResults(props) {
  let { bom, list, cart, pageY, scrollTriggers, setScrollTriggers, setTableHeadFixed, currency, count, showResults, highlight, notificationFunc, updateCart } = props;

  const tableHead = React.createRef();
  const [collapseTriggers, setCollapseTriggers] = useState([]);

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
            list.map((query, qi) => {
              return (
                <Collapsible
                  key={qi}
                  open={true}
                  transitionTime={200}
                  transitionCloseTime={200}
                  triggerTagName={'div'}
                  className={'search-results__collapsed'}
                  triggerClassName={'search-results__trigger __collapsed trigger-' + qi}
                  triggerOpenedClassName={'search-results__trigger __expanded trigger-' + qi}
                  openedClassName={'search-results__expanded'}
                  trigger={<span>{query.q}</span>}
                >
                  {query.data.map((row, ri) => (
                    <SearchRow key={ri} updateCart={updateCart} tableHeader={tableHeader} defaultCount={defaultCount} currency={currency} highlight={highlight} notificationFunc={notificationFunc} row={row} rowIndex={ri} />
                  ))}
                </Collapsible>
              );
            })
          ) : (
            list[0].data.map((row, ri) => <SearchRow key={ri} updateCart={updateCart} tableHeader={tableHeader} defaultCount={defaultCount} currency={currency} highlight={highlight} notificationFunc={notificationFunc} row={row} rowIndex={ri} />)
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
