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
import FormSelect from '../../components/FormSelect';
import { validateEmail } from '../../utils/validateEmail';
import apiGET from '../../utils/search';
import apiPOST from '../../utils/upload';

export function OrdersPage(props) {
  const { currency, history, activeTab, setTableHeadFixed, setOpenRequisites, needLogin, setOpenDetails, setOpenProfile, count, notificationFunc, updateCart } = props;

  const defaultCount = count;

  const tableHead = useRef();
  const requisitesSearchRef = useRef();

  const [ordersList, setOrdersList] = useState([]);
  const [requisitesList, setRequisitesList] = useState([]);

  const tableHeaderOrders = {
    id: 'Заказ №',
    requisites: 'Реквизиты',
    contact_name: 'Заказал',
    payed: 'Сумма',
    in_stock: 'Остаток',
    created_at: 'Дата\nсоздания',
    updated_at: 'Дата\nпоставки',
    chronology: '  ',
    //
    //amount: 7377,
    //contact_name: 'Aleen Harvey',
    //created_at: '2021-07-08T15:40:06.000000Z',
    //delivery_type: 'test',
    //id: 28,
    //in_stock: 60,
    //payed: 9903,
    //unloaded: 19,
    //updated_at: '2021-07-08T15:40:06.000000Z',
  };

  const tableHeaderRequisites = {
    //address: '39846 Demetris Fords',
    //bank_name: 'Volkman-Schmitt',
    //contact_email: 'crist.baby@example.net',
    //contact_phone: '79999999999',
    //created_at: '2021-07-08T15:40:06.000000Z',
    //id: 28,
    //notes: 'test',
    //profile_id: 10,
    //updated_at: '2021-07-08T15:40:06.000000Z',
    //
    company_name: 'Компания',
    inn: 'ИНН',
    bank_account: 'Расчетный счет',
    bank_name: 'Банк',
    bic: 'БИК',
    undistributed_amount: 'Нераспределенные\nсредства',
    available: 'Доступно',
    contact_name: 'Контактное\nлицо',
  };

  const [preSelectedState, setPreSelectedDelivery] = useState(-1);
  //const [activeTab, setActiveTab] = useState(1);
  const [tableHeader, setTableHeader] = useState(activeTab === 0 ? tableHeaderOrders : tableHeaderRequisites);
  const stateInput = React.createRef();

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

  const getOrders = () => {
    const requestURL = '/orders';

    apiGET(requestURL, {}, data => {
      console.log('getOrders', data);

      if (data.error) {
        needLogin();
      } else {
        setOrdersList(data);
      }
    });
  };

  const getRequisites = () => {
    const requestURL = '/requisites';

    apiGET(requestURL, {}, data => {
      console.log('getRequisites', data);

      if (data.error) {
        needLogin();
      } else {
        setRequisitesList(data);
      }
    });
  };

  const getData = () => {
    if (activeTab === 0) {
      getOrders();
      setTableHeader(tableHeaderOrders);
    } else {
      getRequisites();
      setTableHeader(tableHeaderRequisites);
    }
  };

  useEffect(() => {
    updateTableHeader();
  }, [tableHeader]);

  useEffect(() => {
    getData();
  }, [activeTab]);

  useEffect(() => {
    updateTableHeader();

    getData();

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

  const stateOptions = [
    { value: 'Сделка', label: 'Сделка' },
    { value: 'Заявка', label: 'Заявка' },
    { value: 'Запрос отправлен', label: 'Запрос отправлен' },
    { value: 'Есть условия поставки частично', label: 'Есть условия поставки частично' },
    { value: 'Пришел ответ, надо посчитать', label: 'Пришел ответ, надо посчитать' },
    { value: 'Есть условия поставки', label: 'Есть условия поставки' },
    { value: 'Коммерческое предложение', label: 'Коммерческое предложение' },
    { value: 'Счет выставлен', label: 'Счет выставлен' },
    { value: 'Согласование заказа', label: 'Согласование заказа' },
  ];

  //useEffect(() => {
  //  console.log('activeTab', activeTab);
  //  setTableHeader(activeTab === 0 ? tableHeaderOrders : tableHeaderRequisites);
  //
  //  updateTableHeader();
  //}, [activeTab]);

  const handleChange = (field, e) => {
    console.log('handleChange', field, e);
  };

  return (
    <div className="orders-results">
      <CabinetTabs history={history} setOpenProfile={setOpenProfile} activeIndex={activeTab} />

      {activeTab === 0 ? (
        <>
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

                <input
                  //
                  className="hide"
                  ref={stateInput || null}
                />

                {stateOptions.length ? <FormSelect onChange={handleChange} options={stateOptions} placeholder="Статус" name="order-state" error={null} preSelectedValue={preSelectedState} inputRef={stateInput} /> : null}
              </div>
            </div>
          </div>

          <div className="orders-results__table">
            {requisitesList && requisitesList.length ? (
              <div ref={tableHead} className="orders-results__head-wrapper">
                {tHead}
              </div>
            ) : null}

            {ordersList && ordersList.length
              ? ordersList.map((row, ri) => (
                  <OrderRow
                    key={ri}
                    rowClick={e => {
                      setOpenDetails(e);
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
              : null}
          </div>
        </>
      ) : (
        <>
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

          <div className="orders-results__table">
            {requisitesList && requisitesList.length ? (
              <div ref={tableHead} className="orders-results__head-wrapper">
                {tHead}
              </div>
            ) : null}

            {requisitesList && requisitesList.length
              ? requisitesList.map((row, ri) => (
                  <RequisitesRow
                    key={ri}
                    rowClick={e => {
                      setOpenRequisites(e);
                    }}
                    updateCart={updateCart}
                    tableHeader={tableHeaderRequisites}
                    defaultCount={defaultCount}
                    currency={currency}
                    notificationFunc={notificationFunc}
                    row={row}
                    rowIndex={ri}
                  />
                ))
              : null}
          </div>
        </>
      )}
    </div>
  );
}

OrdersPage.propTypes = {};

export default connect(null)(OrdersPage);
