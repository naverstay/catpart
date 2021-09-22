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

// import { useInjectReducer } from 'utils/injectReducer';
// import { useInjectSaga } from 'utils/injectSaga';
import { makeSelectRepos, makeSelectLoading, makeSelectError } from 'containers/App/selectors';

import { useDetectClickOutside } from 'react-detect-click-outside';
import { changeCurrency } from './actions';
// import reducer from './reducer';
// import saga from './saga';
import Share from '../../components/Share';
import { SearchResults } from '../SearchResults';
import { CartResults } from '../CartResults';
import apiGET from '../../utils/search';
import { OrderForm } from '../OrderForm';
import priceFormatter from '../../utils/priceFormatter';
import { xlsDownload } from '../../utils/xlsDownload';
import { findPriceIndex } from '../../utils/findPriceIndex';
// import Skeleton from '../Skeleton';
import SkeletonWide from '../SkeletonWide';
import SkeletonDt from '../SkeletonDt';
import SkeletonTab from '../SkeletonTab';
import { smoothScrollTo } from '../../utils/smoothScrollTo';

// const key = 'home';
const TRIGGER_DROPDOWN_LIMIT = 11;

export function FilterForm({
  props,
  cart,
  profile,
  RUB,
  busy,
  setBusyOrder,
  currency,
  history,
  setOpenAuthPopup,
  setCurrency,
  setOrderSent,
  setShowTableHeadFixed,
  setTableHeadFixed,
  showResults,
  totalCart,
  notificationFunc,
  updateCart,
  setOpenMobMenu,
  searchData,
  loading,
  error,
  onChangeCurrency,
}) {
  // useInjectReducer({ key, reducer });
  // useInjectSaga({ key, saga });

  const query = new URLSearchParams(props.location.search);

  const [count, setCount] = useState(0);
  const [cartData, setCartData] = useState([]);
  const [scrollTriggers, setScrollTriggers] = useState([]);
  const [openShare, setOpenShare] = useState(false);
  const [openMoreTriggers, setOpenMoreTriggers] = useState(false);
  const [currencyList, setCurrencyList] = useState([RUB]);

  const moreTriggersRef = useDetectClickOutside({
    onTriggered: () => {
      setOpenMoreTriggers(false);
    },
  });

  useEffect(() => {
    const user = localStorage.getItem('catpart-user');
    let userFields = {};

    if (user) {
      userFields = JSON.parse(user);

      if (userFields.hasOwnProperty('currency')) {
        const userCurrency = currencyList.find(c => c.name === userFields.currency);
        if (userCurrency) {
          setCurrency(userCurrency);
        }
      }
    }
  }, [currencyList]);

  useEffect(() => {
    setOpenMobMenu(false);

    const requestURL = '/currencies';

    apiGET(requestURL, {}, data => {
      setCurrencyList(
        Object.keys(data)
          .map(c => ({
            name: c,
            precision: 4,
            exChange: parseFloat(data[c]),
          }))
          .concat(RUB),
      );
    });

    const store = localStorage.getItem('catpart');
    if (store) {
      setCartData([...JSON.parse(store)]);
    }
  }, []);

  const scrollTriggerHandler = goto => {
    setOpenMoreTriggers(false);

    const target = document.querySelector(`.search-results__table .trigger-${goto}`);

    if (target) {
      smoothScrollTo(document.body, document.body.scrollTop, target.getBoundingClientRect().top - 50, 600);
    }
  };

  useEffect(() => {
    if (searchData && searchData.bom) {
      setScrollTriggers(
        searchData.res.map((c, ci) =>
          ci >= TRIGGER_DROPDOWN_LIMIT ? (
            <Ripples
              key={ci}
              onClick={() => {
                scrollTriggerHandler(ci);
              }}
              className="dropdown-link"
              during={1000}
            >
              {c.q}
            </Ripples>
          ) : (
            <Ripples
              key={ci}
              onClick={() => {
                scrollTriggerHandler(ci);
              }}
              className="btn __gray"
              during={1000}
            >
              <span className="btn-inner">{c.q}</span>
            </Ripples>
          ),
        ),
      );
    } else {
      setScrollTriggers([]);
    }
  }, [searchData]);

  const reposListProps = {
    loading,
    error,
  };

  const onChangeSwitch = evt => {
    const user = localStorage.getItem('catpart-user');
    let userFields = { currency: evt.target.dataset.currency };

    if (user) {
      userFields = JSON.parse(user);
      userFields.currency = evt.target.dataset.currency;
    }

    localStorage.setItem('catpart-user', JSON.stringify(userFields));

    // console.log('onChangeSwitch', currency, evt.target);
    // onChangeCurrency(evt.target.value, evt.target.dataset.currency);
    setCurrency({
      exChange: parseFloat(evt.target.value),
      name: evt.target.dataset.currency,
      precision: evt.target.dataset.currency === 'RUB' ? 2 : 4,
    });
  };

  const plural = (n, str1, str2, str5) => `${n} ${n % 10 == 1 && n % 100 != 11 ? str1 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? str2 : str5}`;

  let totalData = 0;
  let searchInfo = '';

  if (!cart && searchData && searchData.hasOwnProperty('res')) {
    totalData = searchData.res.reduce((total, c) => total + (c.hasOwnProperty('data') ? c.data.length : 0), 0);
    searchInfo = (searchData.bom ? 'BOM-поиск. ' : `По запросу «${query.get('art') || ''}» `) + (totalData ? `найдено ${plural(totalData, 'наименование', 'наименования', 'наименований')}.` : 'ничего не найдено :(');
  }

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

      {!cart && busy ? (
        <div className="skeleton-holder">
          <div className="skeleton skeleton-mob">
            <SkeletonWide />
          </div>
          <div className="skeleton skeleton-tab">
            <SkeletonTab />
          </div>
          <div className="skeleton skeleton-dt">
            <SkeletonDt />
          </div>
          <div className="skeleton skeleton-wide">
            <SkeletonWide />
          </div>
        </div>
      ) : null}

      <div className="form-filter">
        {!cart &&
          (scrollTriggers.length ? (
            <div className="form-filter__controls __wide">
              {scrollTriggers.slice(0, TRIGGER_DROPDOWN_LIMIT).map((t, ti) => (
                <div key={ti} className="form-filter__control">
                  {t}
                </div>
              ))}
              {scrollTriggers.length > TRIGGER_DROPDOWN_LIMIT && (
                <div ref={moreTriggersRef} className="form-filter__control">
                  <Ripples
                    onClick={() => {
                      setOpenMoreTriggers(true);
                    }}
                    className="btn __gray"
                    during={1000}
                  >
                    <span className="btn-inner">Перейти к</span>
                  </Ripples>
                  {openMoreTriggers && (
                    <div className="dropdown-container">
                      <ul className="dropdown-list">
                        {scrollTriggers.slice(TRIGGER_DROPDOWN_LIMIT).map((t, ti) => (
                          <li key={ti}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : null)}

        {!cart && showResults ? <div className="form-filter__stat">{searchInfo}</div> : <div className="form-filter__stat">&nbsp;</div>}

        {busy ? null : (
          <div className={`form-filter__controls${cart ? ' __cart' : ''}`}>
            {cart ? (
              <div className="form-filter__controls_left">
                <div className="form-filter__control">
                  <Ripples
                    onClick={() => {
                      const store = localStorage.getItem('catpart');
                      if (store) {
                        xlsDownload([...JSON.parse(store)], currency, 0);
                      } else {
                        notificationFunc('success', 'Корзина пуста.', 'Нечего скачивать.');
                      }
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
            ) : totalData ? (
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
                  {openShare && <Share shareUrl={encodeURIComponent(window.location.href)} shareText={encodeURIComponent(searchInfo)} notificationFunc={notificationFunc} setOpenFunc={setOpenShare} />}
                </div>
              </div>
            ) : null}

            {cart || totalData ? (
              <div onChange={onChangeSwitch} className="form-filter__controls_right">
                {currencyList.length > 1 &&
                  currencyList.map((cur, ind) => (
                    <Ripples key={ind} className="form-filter__control" during={1000}>
                      <label className="form-radio__btn">
                        <input
                          name="currency"
                          className="hide"
                          // checked={}
                          defaultChecked={currency.name === cur.name}
                          data-currency={cur.name}
                          type="radio"
                          value={cur.exChange}
                        />
                        <span className="btn __gray">
                          <b>{cur.name}</b>
                          {cur.name !== 'RUB' && <span>{priceFormatter(cur.exChange, cur.precision)}</span>}
                        </span>
                      </label>
                    </Ripples>
                  ))}
              </div>
            ) : null}
          </div>
        )}
      </div>

      {cart ? (
        <>
          <CartResults setTableHeadFixed={setTableHeadFixed} setShowTableHeadFixed={setShowTableHeadFixed} updateCart={updateCart} list={cartData} notificationFunc={notificationFunc} showResults={showResults} count={count} currency={currency} />

          <OrderForm profile={profile} history={history} setOpenAuthPopup={setOpenAuthPopup} setBusyOrder={setBusyOrder} updateCart={updateCart} notificationFunc={notificationFunc} setOrderSent={setOrderSent} totalCart={totalCart} currency={currency} delivery />
        </>
      ) : busy || !totalData ? null : (
        <SearchResults
          scrollTriggers={scrollTriggers}
          setScrollTriggers={setScrollTriggers}
          setTableHeadFixed={setTableHeadFixed}
          setShowTableHeadFixed={setShowTableHeadFixed}
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
  // currency: PropTypes.string,
  onChangeCurrency: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  // currency: makeSelectCurrency(),
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
