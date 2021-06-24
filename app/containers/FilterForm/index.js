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
import { findPriceIndex } from '../../utils/findPriceIndex';
import { xlsDownload } from '../../utils/xlsDownload';

const key = 'home';

export function FilterForm({ props, pageY, cart, setTableHeadFixed, showResults, totalCart, notificationFunc, updateCart, setOpenMobMenu, searchData, loading, error, onChangeCurrency }) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });

  const query = new URLSearchParams(props.location.search);

  const RUB = { name: 'RUB', exChange: 1 };
  const [count, setCount] = useState(0);
  const [cartData, setCartData] = useState([]);
  const [scrollTriggers, setScrollTriggers] = useState([]);
  const [openShare, setOpenShare] = useState(false);
  const [currencyList, setCurrencyList] = useState([RUB]);
  const [currency, setCurrency] = useState(RUB);

  useEffect(() => {
    setOpenMobMenu(false);

    const requestURL = '/currencies';

    apiGET(requestURL, {}, data => {
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

    let store = localStorage.getItem('catpart');
    if (store) {
      setCartData([...JSON.parse(store)]);
    }
  }, []);

  const reposListProps = {
    loading,
    error,
  };

  const onChangeSwitch = evt => {
    console.log('onChangeSwitch', currency, evt.target);
    //onChangeCurrency(evt.target.value, evt.target.dataset.currency);
    setCurrency({ exChange: parseFloat(evt.target.value), name: evt.target.dataset.currency });
  };

  const plural = (n, str1, str2, str5) => {
    return n + ' ' + (n % 10 == 1 && n % 100 != 11 ? str1 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? str2 : str5);
  };

  let searchInfo =
    !cart && searchData && searchData.hasOwnProperty('res')
      ? (searchData.bom ? 'BOM-поиск. Н' : 'По запросу «' + (query.get('art') || '') + '» н') + (searchData.res.length ? 'айдено ' + plural(searchData.res.length, 'наименование', 'наименования', 'наименований') + '.' : 'ичего не найдено :(')
      : '';

  return (
    <>
      {cart ? (
        <Helmet>
          <title>Оформление заказа - CATPART.RU</title>
          <meta name="description" content="Оформление заказа - CATPART.RU" />
          <meta name="keywords" content="Оформление заказа - CATPART.RU" />
          <link rel="canonical" href="https://catpart.ru/order/" />
        </Helmet>
      ) : (
        <Helmet>
          <title>{searchInfo}</title>
          <meta name="description" content={searchInfo} />
          <meta name="keywords" content={searchInfo} />
          <link rel="canonical" href="https://catpart.ru/" />
        </Helmet>
      )}

      <div className="form-filter">
        {!cart &&
          (scrollTriggers.length ? (
            <div className={'form-filter__controls'}>
              {scrollTriggers.map((t, ti) => (
                <div className={'form-filter__control'}>{t}</div>
              ))}
            </div>
          ) : null)}

        {!cart && showResults ? <div className="form-filter__stat">{searchInfo}</div> : <div className="form-filter__stat">&nbsp;</div>}

        <div className={'form-filter__controls' + (cart ? ' __cart' : '')}>
          {cart ? (
            <div className="form-filter__controls_left">
              <div className="form-filter__control">
                <Ripples
                  onClick={() => {
                    xlsDownload(cartData, currency, 0);
                  }}
                  className="btn __gray"
                  during={1000}
                >
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
                <Ripples
                  onClick={() => {
                    xlsDownload(searchData.res, currency, searchData.bom ? 1 : -1);
                  }}
                  className="btn __gray"
                  during={1000}
                >
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
          <CartResults setTableHeadFixed={setTableHeadFixed} pageY={pageY} updateCart={updateCart} list={cartData} notificationFunc={notificationFunc} showResults={showResults} count={count} currency={currency} />

          <OrderForm totalCart={totalCart} currency={currency} delivery={true} />
        </>
      ) : (
        <SearchResults
          scrollTriggers={scrollTriggers}
          setScrollTriggers={setScrollTriggers}
          setTableHeadFixed={setTableHeadFixed}
          pageY={pageY}
          updateCart={updateCart}
          notificationFunc={notificationFunc}
          highlight={decodeURIComponent(query.get('art') || '')}
          showResults={showResults}
          count={query.get('q') || ''}
          currency={currency}
          bom={searchData.bom}
          list={searchData.res}
        />
      )}
    </>
  );
}

FilterForm.propTypes = {
  showResults: PropTypes.bool,
  searchData: PropTypes.object,
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
