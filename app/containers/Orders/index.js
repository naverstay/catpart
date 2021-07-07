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

export function OrdersPage(props) {
  const { history, list, cart, setTableHeadFixed, setOpenProfile, count, notificationFunc, updateCart } = props;

  const tableHead = useRef();

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
    <div className="search-results__row __even __head">
      {Object.keys(tableHeader).map((head, hi) => (
        <div key={hi} className={`search-results__cell __${head}`}>
          {tableHeader[head]}
        </div>
      ))}
      <div className="search-results__cell __cart">&nbsp;</div>
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

    console.log('search mount');

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

      <div className="orders-results__table" />
    </div>
  );
}

OrdersPage.propTypes = {
  list: PropTypes.array,
};

export default connect(null)(OrdersPage);
