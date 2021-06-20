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

export function CartResults(props) {
  let { list, cart, currency, count } = props;

  //list = list.concat(list).concat(list);

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

        {list.map((row, rowIndex) => (
          <div key={rowIndex} className={`cart-results__row${rowIndex % 2 === 0 ? ' __odd' : ' __even'}`}>
            {Object.keys(tableHeader).map((cell, ci) =>
              cell === 'brand' ? null : (
                <div key={ci} className={`cart-results__cell __${cell}`}>
                  {cell === 'manufacturer' ? (
                    <>
                      <p>
                        <span className="cart-results__label __show">{tableHeader[cell]}:</span>
                        <span className={'cart-results__value'}>{row[cell]}</span>
                      </p>
                      <p>
                        <span className="cart-results__label __show">{tableHeader.brand}:</span>
                        <span className={'cart-results__value'}>{row.brand}</span>
                      </p>
                    </>
                  ) : (
                    <>
                      {cell === 'name' ? null : <span className="cart-results__label">{tableHeader[cell]}</span>}
                      <span className={'cart-results__value'}>
                        {cell === 'pricebreaks'
                          ? row.pricebreaks.map((p, pi) => (
                              <span key={pi} className="cart-results__item">
                                {priceFormatter(parseFloat(p.price / currency.exChange).toFixed(2))}
                              </span>
                            ))
                          : cell === 'quantity'
                          ? row.pricebreaks.map((p, pi) => (
                              <div key={pi} className="cart-results__count">
                                <input defaultValue={p.quant} disabled={true} type="text" className="input" />
                              </div>
                            ))
                          : cell === 'total'
                          ? row.pricebreaks.map((p, pi) => (
                              <span key={pi} className="cart-results__item">
                                {priceFormatter((parseFloat(p.quant) * parseFloat(p.price / currency.exChange)).toFixed(2))}
                              </span>
                            ))
                          : row[cell] || '!' + cell + '!'}
                      </span>
                    </>
                  )}
                </div>
              ),
            )}

            <div className="cart-results__cell __cart">
              <div className="cart-results__remove">
                <Ripples during={1000}>
                  <div className="btn __blue">
                    <span className="btn__icon icon icon-close" />
                  </div>
                </Ripples>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

CartResults.propTypes = {
  list: PropTypes.array,
};

export default connect(null)(CartResults);
