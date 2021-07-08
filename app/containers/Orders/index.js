/**
 * OrdersPage
 *
 * Lists the name and the issue count of a repository
 */

import React, { useEffect, useRef, useState } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { smoothScrollTo } from '../../utils/smoothScrollTo';
import Ripples from 'react-ripples';
import CabinetTabs from '../CabinetTabs';
import Collapsible from 'react-collapsible';
import SearchRow from '../SearchRow';
import OrderRow from '../OrderRow';
import RequisitesRow from '../RequisitesRow';

export function OrdersPage(props) {
  const { requisitesList, ordersList, currency, setTableHeadFixed, setOpenRequisites, setOpenProfile, count, notificationFunc, updateCart } = props;

  const defaultCount = count;

  const tableHead = useRef();
  const requisitesSearchRef = useRef();

  const tableHeaderOrders = {
    order_num: 'Заказ №',
    requisites: 'Реквизиты',
    client: 'Заказал',
    total: 'Сумма',
    rest: 'Остаток',
    date_create: 'Дата\nсоздания',
    date_delivery: 'Дата\nпоставки',
    chronology: 'Хронология',
  };

  const tableHeaderRequisites = {
    company: 'Компания',
    inn: 'ИНН',
    account: 'Расчетный счет',
    bank: 'Банк',
    bik: 'БИК',
    unallocated: 'Нераспределенные\nсредства',
    available: 'Доступно',
    contact: 'Контактное\nлицо',
  };

  const [activeTab, setActiveTab] = useState(1);
  const [tableHeader, setTableHeader] = useState(tableHeaderRequisites);

  let tHead = (
    <div className="orders-results__row __even __head">
      {Object.keys(tableHeader).map((head, hi) => (
        <div key={hi} className={`orders-results__cell __${head}`}>
          {tableHeader[head]}
        </div>
      ))}
      <div className="orders-results__cell __cart">&nbsp;</div>
    </div>
  );

  const updateTableHeader = () => {
    setTableHeadFixed(<div className="search-results__table __sticky">{tHead}</div>);
  };

  const handleScroll = event => {
    tableHead.current.closest('.main').classList[tableHead.current.getBoundingClientRect().y <= 0 ? 'add' : 'remove']('__stick');

    // console.log('handleScroll', list, listCounter);
  };

  useEffect(() => {
    updateTableHeader();

    document.body.addEventListener('scroll', handleScroll);

    if (window.innerWidth < 1200) {
      setTimeout(() => {
        smoothScrollTo(document.body, document.body.scrollTop, tableHead.current.getBoundingClientRect().top - 10, 600);
      }, 200);
    }

    return () => {
      document.body.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    setTableHeader(activeTab === 0 ? tableHeaderRequisites : tableHeaderOrders);
    updateTableHeader();
  }, [activeTab]);

  return (
    <div className="orders-results">
      <CabinetTabs setOpenProfile={setOpenProfile} activeIndex={activeTab} setActiveIndex={setActiveTab} />

      {activeTab === 1 ? (
        <div className="form-filter">
          <div className={`form-filter__controls`}>
            <div className="form-filter__controls_left">
              <div className="form-filter__control">
                <input
                  ref={requisitesSearchRef}
                  onChange={e => {
                    console.log('requisitesSearchRef', e.target.value);
                  }}
                  // value={itemCount}
                  placeholder={'Быстрый поиск'}
                  type="text"
                  className="input"
                />
              </div>
            </div>
            <div className="form-filter__controls_right">
              <div className="form-filter__control">
                <Ripples
                  onClick={() => {
                    setOpenRequisites(-1);
                  }}
                  className="btn __blue"
                  during={1000}
                >
                  <span className="btn-inner">Добавить реквизиты</span>
                </Ripples>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="form-filter">
          <div className={`form-filter__controls`}>
            <div className="form-filter__controls_left">
              <div className="form-filter__control">
                <input
                  ref={requisitesSearchRef}
                  onChange={e => {
                    console.log('requisitesSearchRef', e.target.value);
                  }}
                  // value={itemCount}
                  placeholder={'Быстрый поиск'}
                  type="text"
                  className="input"
                />
              </div>
            </div>
            <div className="form-filter__controls_right">
              <div className="form-filter__control">
                <Ripples
                  onClick={() => {
                    setOpenRequisites(-1);
                  }}
                  className="btn __blue"
                  during={1000}
                >
                  <span className="btn-inner">Добавить реквизиты</span>
                </Ripples>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="orders-results__table">
        <div ref={tableHead} className="orders-results__head-wrapper">
          {tHead}
        </div>

        {activeTab === 1
          ? ordersList && ordersList.length
            ? ordersList[0].hasOwnProperty('data')
              ? ordersList[0].data.map((row, ri) => (
                  <OrderRow
                    key={ri}
                    rowClick={e => {
                      setOpenRequisites(e);
                    }}
                    updateCart={updateCart}
                    tableHeader={tableHeaderOrders}
                    defaultCount={defaultCount}
                    currency={currency}
                    notificationFunc={notificationFunc}
                    row={row}
                    rowIndex={ri}
                  />
                ))
              : null
            : null
          : requisitesList && requisitesList.length
          ? requisitesList[0].hasOwnProperty('data')
            ? requisitesList[0].data.map((row, ri) => (
                <RequisitesRow
                  key={ri}
                  rowClick={e => {
                    setOpenRequisites(e);
                  }}
                  updateCart={updateCart}
                  tableHeader={tableHeaderOrders}
                  defaultCount={defaultCount}
                  currency={currency}
                  notificationFunc={notificationFunc}
                  row={row}
                  rowIndex={ri}
                />
              ))
            : null
          : null}
      </div>
    </div>
  );
}

OrdersPage.propTypes = {};

export default connect(null)(OrdersPage);
