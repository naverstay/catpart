/**
 * Cart
 *
 * Lists the name and the issue count of a repository
 */

import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { FormattedNumber } from 'react-intl';

import { makeSelectCurrentUser } from 'containers/App/selectors';
import Ripples from 'react-ripples';
import priceFormatter from '../../utils/priceFormatter';
import SearchRow from '../SearchRow';
import CartRow from '../CartRow';
import { smoothScrollTo } from '../../utils/smoothScrollTo';
import { getJsonData } from '../../utils/getJsonData';

export function CartResults(props) {
  let { cart, currency, count, pageY, setShowTableHeadFixed, setTableHeadFixed, updateCart, notificationFunc } = props;

  const tableHead = useRef();

  let list = [];
  let store = localStorage.getItem('catpart');
  if (store) {
    list = [...getJsonData(store)];
  }

  let tableHeader = {
    name: 'Компонент',
    supplier: 'Поставщик',
    manufacturer: 'Бренд',
    pack_quant: 'Норма уп.',
    quantity: 'Количество',
    pricebreaks: 'Цена за ед.',
    total: 'Сумма',
    delivery_period: 'Срок',
  };

  let tHead = (
    <div className="cart-results__row __even __head">
      {Object.keys(tableHeader).map((head, hi) =>
        head === 'manufacturer' ? null : (
          <div key={hi} className={`cart-results__cell __${head}`}>
            {head === 'supplier' ? <>&nbsp;</> : tableHeader[head]}
          </div>
        ),
      )}
      <div className="cart-results__cell __cart">&nbsp;</div>
    </div>
  );

  const handleScroll = event => {
    if (tableHead.current) {
      tableHead.current.closest('.main').classList[tableHead.current.getBoundingClientRect().y <= 0 ? 'add' : 'remove']('__stick');
    }
  };

  useEffect(() => {
    setTableHeadFixed(<div className={'search-results__table __sticky __cart'}>{tHead}</div>);

    document.body.addEventListener('scroll', handleScroll);

    if (window.innerWidth < 1200 && tableHead.current) {
      setTimeout(() => {
        smoothScrollTo(document.body, document.body.scrollTop, tableHead.current.getBoundingClientRect().top - 10, 600);
      }, 200);
    }

    return () => {
      document.body.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Render the content into a list item
  return (
    <div className="cart-results">
      <div className={'cart-results__table'}>
        <div ref={tableHead} className={'search-results__head-wrapper'}>
          {tHead}
        </div>

        {list && list.length ? list.map((row, ri) => <CartRow key={ri} notificationFunc={notificationFunc} updateCart={updateCart} tableHeader={tableHeader} currency={currency} row={row} rowIndex={ri} />) : null}
      </div>
    </div>
  );
}

CartResults.propTypes = {
  list: PropTypes.array,
};

export default connect(null)(CartResults);
