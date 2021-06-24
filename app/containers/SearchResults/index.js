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

  let smoothScrollTo = (target, startY, endY, duration) => {
    let distanceY = endY - startY;
    let startTime = new Date().getTime();

    function easeInOutQuart(time, from, distance, duration) {
      if ((time /= duration / 2) < 1) {
        return (distance / 2) * Math.pow(time, 4) + from;
      }

      return (-distance / 2) * ((time -= 2) * Math.pow(time, 3) - 2) + from;
    }

    let timer = window.setInterval(() => {
      let time = new Date().getTime() - startTime;
      let newY = easeInOutQuart(time, startY, distanceY, duration);

      if (time >= duration) {
        window.clearInterval(timer);
      }

      target.scrollTo(0, newY);
    }, 1000 / 60);
  };

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
              const triggerRef = React.createRef();
              const triggerBtn = <span ref={triggerRef}>{query.q}</span>;

              const scrollBtn = (
                <Ripples
                  onClick={() => {
                    console.log('scrollTo', triggerRef.current);
                  }}
                  className="btn __gray"
                  during={1000}
                >
                  <span className="btn-inner">{query.q}</span>
                </Ripples>
              );

              //setCollapseTriggers([...collapseTriggers, triggerBtn]);
              //setScrollTriggers([...scrollTriggers, scrollBtn]);

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
                  trigger={triggerBtn}
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
