/**
 * Cart
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
import priceFormatter from '../../utils/priceFormatter';
import SearchRow from '../SearchRow';
import CartRow from '../CartRow';

export function CartResults(props) {
  let { cart, currency, count, updateCart, notificationFunc } = props;

  let list = [];
  let store = localStorage.getItem('catpart');
  if (store) {
    list = [...JSON.parse(store)];
  }

  let tableHeader = {
    name: 'Компонент',
    manufacturer: 'Поставщик',
    brand: 'Бренд',
    pack_quant: 'Норма уп.',
    quantity: 'Количество',
    pricebreaks: 'Цена за ед.',
    total: 'Сумма',
    delivery_period: 'Срок',
  };

  // Render the content into a list item
  return (
    <div className="cart-results">
      <div className={'cart-results__table'}>
        <div className="cart-results__row __even __head">
          {Object.keys(tableHeader).map((head, hi) =>
            head === 'brand' ? null : (
              <div key={hi} className={`cart-results__cell __${head}`}>
                {head === 'manufacturer' ? <>&nbsp;</> : tableHeader[head]}
              </div>
            ),
          )}
          <div className="cart-results__cell __cart">&nbsp;</div>
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
