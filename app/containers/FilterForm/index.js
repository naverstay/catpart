/*
 * FilterForm
 *
 */

import React, { useEffect, memo, useState } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
// import {FileDrop} from 'react-file-drop';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import Ripples from 'react-ripples';

import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import { makeSelectRepos, makeSelectLoading, makeSelectError } from 'containers/App/selectors';

import { changeCurrency } from './actions';
import { makeSelectCurrency } from './selectors';
import reducer from './reducer';
import saga from './saga';
import Share from '../../components/Share';
import { SearchResults } from '../SearchResults';
import { CartResults } from '../CartResults';
import apiGET from '../../utils/search';
import { OrderForm } from '../OrderForm';
import priceFormatter from '../../utils/priceFormatter';

const key = 'home';

export function FilterForm({ props, cart, showResults, notificationFunc, updateCart, setOpenMobMenu, searchData, loading, error, onChangeCurrency }) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });

  const query = new URLSearchParams(props.location.search);

  const RUB = { name: 'RUB', exChange: 1 };
  const [count, setCount] = useState(0);
  const [openShare, setOpenShare] = useState(false);
  const [currencyList, setCurrencyList] = useState([RUB]);
  const [currency, setCurrency] = useState(RUB);

  useEffect(() => {
    setOpenMobMenu(false);

    const requestURL = '/currencies';

    apiGET(requestURL, {}, data => {
      console.log('setCurrencyList', data);

      setCurrencyList(
        Object.keys(data)
          .map(c => {
            return {
              name: c,
              exChange: data[c],
            };
          })
          .concat(RUB),
      );
    });
  }, []);

  const reposListProps = {
    loading,
    error,
  };

  let cartData = [
    {
      manufacturer: 'Rochester (возможен старый DC)',
      name: 'SMBJ40AHE3/52 (DC:1851)',
      brand: 'Yangjie Electronic Technology',
      quantity: 705000,
      price_unit: 24000,
      moq: 24000,
      pack_quant: 24000,
      delivery_period: '3-4 недели',
      pricebreaks: [
        {
          price: 175.43,
          quant: 100500,
          pureprice: 182.35,
        },
      ],
    },
    {
      manufacturer: 'Digi-Key Electronics',
      name: 'SMBJ40A-E3/52',
      brand: 'Yangjie Electronic Technology',
      quantity: 284,
      price_unit: 1,
      moq: 1,
      pack_quant: 1,
      delivery_period: '3-4 недели',
      pricebreaks: [
        {
          price: 226.29,
          quant: 1,
          pureprice: 248.94,
        },
      ],
    },
  ];

  /*  searchData = [
    {
      manufacturer: 'Rochester (возможен старый DC)',
      name: 'SMBJ40AHE3/52 (DC:1851)',
      brand: 'Yangjie Electronic Technology',
      quantity: 705000,
      price_unit: 24000,
      moq: 24000,
      pack_quant: 24000,
      delivery_period: '3-4 недели',
      pricebreaks: [
        {
          price: 226.29,
          quant: 1,
          pureprice: 248.94,
        },
        {
          price: 203.64,
          quant: 8,
          pureprice: 226.29,
        },
        {
          price: 190.38,
          quant: 15,
          pureprice: 203.64,
        },
        {
          price: 183.06,
          quant: 29,
          pureprice: 190.38,
        },
        {
          price: 178.65,
          quant: 50,
          pureprice: 183.06,
        },
      ],
    },
    {
      manufacturer: 'Digi-Key Electronics',
      name: 'SMBJ40A-E3/52',
      brand: 'Yangjie Electronic Technology',
      quantity: 284,
      price_unit: 1,
      moq: 1,
      pack_quant: 1,
      delivery_period: '3-4 недели',
      pricebreaks: [
        {
          price: 175.43,
          quant: 1,
          pureprice: 182.35,
        },
        {
          price: 166.8,
          quant: 5,
          pureprice: 175.43,
        },
        {
          price: 159.99,
          quant: 10,
          pureprice: 166.8,
        },
        {
          price: 153.7,
          quant: 19,
          pureprice: 159.99,
        },
        {
          price: 147.39,
          quant: 37,
          pureprice: 153.7,
        },
      ],
    },
  ];

  searchData = searchData
    .concat(searchData)
    .concat(searchData)
    .concat(searchData)
    .concat(searchData)
    .concat(searchData)
    .concat(searchData)
    .concat(searchData)
    .concat(searchData);*/

  cartData = cartData
    .concat(cartData)
    .concat(cartData)
    .concat(cartData)
    .concat(cartData)
    .concat(cartData)
    .concat(cartData)
    .concat(cartData)
    .concat(cartData)
    .concat(cartData);

  const onChangeSwitch = evt => {
    console.log('onChangeSwitch', currency, evt.target);
    //onChangeCurrency(evt.target.value, evt.target.dataset.currency);
    setCurrency({ exChange: parseFloat(evt.target.value), name: evt.target.dataset.currency });
  };

  const plural = (n, str1, str2, str5) => {
    return n + ' ' + (n % 10 == 1 && n % 100 != 11 ? str1 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? str2 : str5);
  };

  return (
    <>
      <div className="form-filter">
        {!cart && showResults ? (
          <div className="form-filter__stat">{'По запросу «' + (query.get('art') || '') + '» ' + (searchData.length ? 'найдено ' + plural(searchData.length, 'наименование', 'наименования', 'наименований') + '.' : 'ничего не найдено :(')}</div>
        ) : (
          <div className="form-filter__stat">&nbsp;</div>
        )}

        <div className={'form-filter__controls' + (cart ? ' __cart' : '')}>
          {cart ? (
            <div className="form-filter__controls_left">
              <div className="form-filter__control">
                <Ripples className="btn __gray" during={1000}>
                  <div className="btn-inner">
                    <span className="btn __blue">
                      <span className="btn-icon icon icon-download" />
                    </span>
                    <span>Скачать список</span>
                  </div>
                </Ripples>
              </div>
            </div>
          ) : (
            <div className="form-filter__controls_left">
              <div className="form-filter__control">
                <Ripples className="btn __gray" during={1000}>
                  <span className="btn-inner">
                    <span className="btn __blue">
                      <span className="btn-icon icon icon-download" />
                    </span>
                    <span>Скачать результат поиска</span>
                  </span>
                </Ripples>
              </div>
              <div className="form-filter__control">
                <Ripples
                  onClick={() => {
                    setOpenShare(true);
                  }}
                  className="btn __gray"
                  during={1000}
                >
                  <span className="btn-inner">Поделиться</span>
                </Ripples>
                {openShare && <Share setOpenFunc={setOpenShare} />}
              </div>
            </div>
          )}

          <div onChange={onChangeSwitch} className="form-filter__controls_right">
            {currencyList.length > 1 &&
              currencyList.map((cur, ind) => (
                <Ripples key={ind} className="form-filter__control" during={1000}>
                  <label className="form-radio__btn">
                    <input
                      name="currency"
                      className="hide"
                      //checked={}
                      defaultChecked={currency.name === cur.name}
                      data-currency={cur.name}
                      type="radio"
                      value={cur.exChange}
                    />
                    <span className="btn __gray">
                      <b>{cur.name}</b>
                      {cur.name !== 'RUB' && <span>{priceFormatter(cur.exChange)}</span>}
                    </span>
                  </label>
                </Ripples>
              ))}
          </div>
        </div>
      </div>

      {cart ? (
        <>
          <CartResults updateCart={updateCart} notificationFunc={notificationFunc} showResults={showResults} count={count} currency={currency} />

          <OrderForm />
        </>
      ) : (
        <SearchResults updateCart={updateCart} notificationFunc={notificationFunc} highlight={query.get('art') || ''} showResults={showResults} count={query.get('q') || ''} currency={currency} list={searchData} />
      )}
    </>
  );
}

FilterForm.propTypes = {
  showResults: PropTypes.bool,
  searchData: PropTypes.array,
  cart: PropTypes.bool,
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  notificationFunc: PropTypes.func,
  onSubmitForm: PropTypes.func,
  //currency: PropTypes.string,
  onChangeCurrency: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  //currency: makeSelectCurrency(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
});

export function mapDispatchToProps(dispatch) {
  return {
    onChangeCurrency: (exchange, currency) => dispatch(changeCurrency(exchange, currency)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(FilterForm);
