/**
 * OrdersPage
 *
 * Lists the name and the issue count of a repository
 */

import React, { useEffect, useRef, useState } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Ripples from 'react-ripples';
import Collapsible from 'react-collapsible';
import { smoothScrollTo } from '../../utils/smoothScrollTo';
import CabinetTabs from '../CabinetTabs';
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

  const [ordersList, setOrdersList] = useState([]);
  const [requisitesList, setRequisitesList] = useState([]);
  const [requisitesFilter, setRequisitesFilter] = useState('');
  const [ordersFilter, setOrdersFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);

  // const statusOptions = [
  //  { value: 'Сделка', label: 'Сделка' },
  //  { value: 'Заявка', label: 'Заявка' },
  //  { value: 'Запрос отправлен', label: 'Запрос отправлен' },
  //  { value: 'Есть условия поставки частично', label: 'Есть условия поставки частично' },
  //  { value: 'Пришел ответ, надо посчитать', label: 'Пришел ответ, надо посчитать' },
  //  { value: 'Есть условия поставки', label: 'Есть условия поставки' },
  //  { value: 'Коммерческое предложение', label: 'Коммерческое предложение' },
  //  { value: 'Счет выставлен', label: 'Счет выставлен' },
  //  { value: 'Согласование заказа', label: 'Согласование заказа' },
  // ];

  const tableHeaderOrders = {
    id: 'Заказ №',
    requisites: 'Реквизиты',
    contact_name: 'Заказал',
    payed: 'Сумма',
    in_stock: 'Остаток',
    created_at: 'Дата\nсоздания',
    delivery_date: 'Дата\nпоставки',
    chronology_health: ' ',
    chronology: 'Хронология',
    //
    // amount: 7377,
    // contact_name: 'Aleen Harvey',
    // created_at: '2021-07-08T15:40:06.000000Z',
    // delivery_type: 'test',
    // id: 28,
    // in_stock: 60,
    // payed: 9903,
    // unloaded: 19,
    // updated_at: '2021-07-08T15:40:06.000000Z',
  };

  const tableHeaderRequisites = {
    // address: '39846 Demetris Fords',
    // bank_name: 'Volkman-Schmitt',
    // contact_email: 'crist.baby@example.net',
    // contact_phone: '79999999999',
    // created_at: '2021-07-08T15:40:06.000000Z',
    // id: 28,
    // notes: 'test',
    // profile_id: 10,
    // updated_at: '2021-07-08T15:40:06.000000Z',
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
  const stateInput = React.createRef();

  const tHeadOrders = (
    <div className="orders-results__row __even __head">
      {Object.keys(tableHeaderOrders).map((head, hi) => (
        <div key={hi} className={`orders-results__cell __${head}`}>
          <span>{tableHeaderOrders[head]}</span>
        </div>
      ))}
    </div>
  );

  const tHeadRequisites = (
    <div className="requisites-results__row __even __head">
      {Object.keys(tableHeaderRequisites).map((head, hi) => (
        <div key={hi} className={`requisites-results__cell __${head}`}>
          <span>{tableHeaderRequisites[head]}</span>
        </div>
      ))}
      <div className="requisites-results__cell __rm">&nbsp;</div>
    </div>
  );

  const updateTableHeader = () => {
    setTableHeadFixed(<div className="search-results__table __sticky">{activeTab === 0 ? tHeadOrders : tHeadRequisites}</div>);
  };

  const handleScroll = event => {
    if (tableHead.current) {
      tableHead.current.closest('.main').classList[tableHead.current.getBoundingClientRect().y <= 0 ? 'add' : 'remove']('__stick');
    }

    // console.log('handleScroll', list, listCounter);
  };

  const onlyUnique = (value, index, self) => self.indexOf(value) === index;

  const getOrders = () => {
    const requestURL = '/orders';

    apiGET(requestURL, {}, data => {
      console.log('getOrders', data);

      if (data.error) {
        needLogin();
      } else {
        const statuses = data.reduce((all, d) => all.concat(d.products.reduce((ret, p) => ret.concat(p.statuses.map(s => s.name)), [])), []);
        console.log('statuses', statuses, statuses.filter(onlyUnique));

        setStatusOptions(statuses.filter(onlyUnique).map(u => ({ value: u, label: u })));

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
    } else {
      getRequisites();
    }
  };

  useEffect(() => {
    getData();
    updateTableHeader();
  }, [activeTab]);

  useEffect(() => {
    updateTableHeader();

    getData();

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

  const handleChange = (field, e) => {
    console.log('handleChange', field, e);

    const filter = e.target.map(f => f.value);

    setStatusFilter(filter);
  };

  return (
    <div className="orders-results">
      <CabinetTabs history={history} setOpenProfile={setOpenProfile} activeIndex={activeTab} />

      {activeTab === 0 ? (
        <>
          <div className="form-filter">
            <div className="form-filter__controls">
              <div className="form-filter__controls_left">
                <div className="form-filter__control __search">
                  <input
                    onChange={e => {
                      setOrdersFilter(e.target.value);
                    }}
                    // value={itemCount}
                    placeholder="Быстрый поиск"
                    type="text"
                    className="input"
                  />
                </div>

                <input
                  //
                  className="hide"
                  ref={stateInput || null}
                />

                {statusOptions.length ? <FormSelect multi onChange={handleChange} options={statusOptions} placeholder="Статус" name="order-state" error={null} preSelectedValue={preSelectedState} inputRef={stateInput} /> : null}
              </div>
            </div>
          </div>

          <div className="orders-results__table">
            {ordersList && ordersList.length ? (
              <>
                <div ref={tableHead} className="orders-results__head-wrapper">
                  {tHeadOrders}
                </div>

                {ordersList.map((row, ri) => {
                  let ret = (
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
                  );

                  if (ordersFilter) {
                    if (!(`${row.id}`.indexOf(ordersFilter) === 0)) {
                      ret = null;
                    }
                  }

                  if (statusFilter.length) {
                    let count = 0;

                    for (const product of row.products) {
                      for (const status of product.statuses) {
                        if (statusFilter.indexOf(status.name) > -1) {
                          count++;
                          break;
                        }
                      }

                      if (count) {
                        break;
                      }
                    }

                    if (!count) {
                      ret = null;
                    }
                  }

                  return ret;
                })}
              </>
            ) : null}
          </div>
        </>
      ) : (
        <>
          <div className="form-filter">
            <div className="form-filter__controls __requisites">
              <div className="form-filter__controls_left">
                <div className="form-filter__control __search">
                  <input
                    onChange={e => {
                      setRequisitesFilter(e.target.value);
                    }}
                    // value={itemCount}
                    placeholder="Быстрый поиск"
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

          <div className="requisites-results__table">
            {requisitesList && requisitesList.length ? (
              <>
                <div ref={tableHead} className="requisites-results__head-wrapper">
                  {tHeadRequisites}
                </div>

                {requisitesList.map((row, ri) => {
                  let ret = (
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
                  );

                  if (requisitesFilter) {
                    if (!(`${row.company_name}`.toLowerCase().indexOf(requisitesFilter.toLowerCase()) === 0 || `${row.inn}`.indexOf(requisitesFilter) === 0)) {
                      ret = null;
                    }
                  }

                  return ret;
                })}
              </>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}

OrdersPage.propTypes = {};

export default connect(null)(OrdersPage);
