import React, { useEffect, useState } from 'react';
import Ripples from 'react-ripples';
import FormInput from '../../components/FormInput';
import { setInputFilter } from '../../utils/inputFilter';
import { validateEmail } from '../../utils/validateEmail';
import dateFormatter from '../../utils/dateFormatter';
import apiGET from '../../utils/search';
import { xlsDownload } from '../../utils/xlsDownload';
import priceFormatter from '../../utils/priceFormatter';
import DetailsRow from '../DetailsRow';

const OrderDetails = props => {
  let { detailsId, setOrderDetails, RUB, profile, order, notificationFunc } = props;

  const authRef = React.createRef();
  const phoneInput = React.createRef();
  const commentInput = React.createRef();
  const contactInput = React.createRef();
  const emailInput = React.createRef();

  const [currentOrder, setCurrentOrder] = useState({});

  const [fields, setFields] = useState({
    'details-inn': '',
    'details-account': '',
    'details-bik': '',
    'details-address': '',
    'details-contact': '',
    'details-phone': '',
    'details-email': '',
  });
  const [errors, setErrors] = useState({
    'details-inn': null,
    'details-account': null,
    'details-bik': null,
    'details-address': null,
    'details-contact': null,
    'details-phone': null,
    'details-email': null,
  });

  const [validForm, setValidForm] = useState(false);
  const [justRedraw, setJustRedraw] = useState(0);

  const changeSubmit = e => {
    e.preventDefault();

    console.log('changeSubmit');

    //const url = '/set/deal';
    //
    //let store = localStorage.getItem('catpart');
    //
    //if (store) {
    //  store = JSON.parse(store);
    //} else {
    //  store = {};
    //}
    //
    //if (!store.hasOwnProperty('order')) {
    //  store.order = [];
    //  localStorage.setItem('catpart', JSON.stringify(store));
    //}
  };

  const handleChange = (field, e) => {
    console.log('handleChange', field, e);
    fields[field] = e.target.value;
    setFields(fields);

    switch (field) {
      case 'details-bik':
      case 'details-inn':
      case 'details-address':
      case 'details-contact':
        errors[field] = e.target.value.length ? '' : 'Не может быть пустым';
        break;
      case 'details-account':
        errors[field] = e.target.value.length >= 8 ? '' : 'Минимум 8 символов';
        break;
      case 'details-phone':
        errors[field] = e.target.value.length >= 8 ? '' : 'Минимум 8 символов';
        break;
      case 'details-email':
        errors[field] = e.target.value.length && validateEmail(e.target.value) ? '' : 'Проверьте формат e-mail';
        break;
    }

    //localStorage.setItem('catpart-user', JSON.stringify(fields));

    setErrors(errors);

    setValidForm(!Object.values(errors).filter(er => er === null || er.length).length);

    setJustRedraw(justRedraw + 1);
  };

  let tableHeader = {
    name: 'Компоненты',
    supplier: 'Поставщик',
    manufacturer: 'Бренд',
    quantity: 'Кол-во',
    price: 'Цена\nза шт.',
    sum: 'Сумма',
    statuses: 'Статус',
    calculated_delivery_date: 'Расчетная дата',
    real_delivery_date: 'дата поставки',
    comment: 'Комментарий менеджера',
  };

  let tHead = (
    <div className="details-results__row __even __head">
      {Object.keys(tableHeader).map((head, hi) =>
        ['real_delivery_date', 'manufacturer', 'supplier'].indexOf(head) > -1 ? null : (
          <div key={hi} className={`details-results__cell __${head}`}>
            {head === 'calculated_delivery_date' ? tableHeader[head] + '/\n' + tableHeader.real_delivery_date : tableHeader[head]}
          </div>
        ),
      )}
    </div>
  );

  useEffect(() => {
    setInputFilter(phoneInput.current, function(value) {
      return /^\+?\d*$/.test(value); // Allow digits and '+' on beginning only, using a RegExp
    });

    const requestURL = '/orders/' + detailsId;

    apiGET(requestURL, {}, data => {
      console.log('OrderDetails', detailsId, data);
    });

    return () => {
      phoneInput.current = false;
    };
  }, []);

  const healthGradient = percent => {
    let start = Math.min(96, Math.max(0, percent - 2));

    return (
      <span
        style={{
          backgroundImage: `linear-gradient(to right, rgb(190, 243, 49) ${start}%, rgb(220, 247, 150) ${start + 4}%,  rgb(250, 250, 250) 100%)`,
        }}
        className={'orders-health__bar'}
      >
        <span>{percent}%</span>
      </span>
    );
  };

  return order.hasOwnProperty('id') ? (
    <div className="profile __details">
      <div className="aside-title">{`Заказ №${order.id} от ${dateFormatter(new Date(order.created_at))}`}</div>

      <div className="orders-details">
        <div className="orders-details__left">
          <ul className={'orders-health__list'}>
            <li>
              <span>Оплачено</span>
              {healthGradient(parseInt(100 * Math.random()))}
            </li>
            <li>
              <span>На складе</span>
              {healthGradient(parseInt(100 * Math.random()))}
            </li>
            <li>
              <span>Отгружено</span>
              {healthGradient(parseInt(100 * Math.random()))}
            </li>
          </ul>

          <ul className="orders-info">
            <li>
              <span>Заказчик:&nbsp;</span> <b>{`${order.contact_name}, ИНН ${order.inn || ''}`}</b>
            </li>
            <li>
              <span>Заказал:&nbsp;</span> <b>{order.contact_name}</b>
            </li>
            <li>
              <span>Доставка:&nbsp;</span> <b>курьерская доставка</b>
            </li>
            <li>
              <span>Адрес доставки:&nbsp;</span> <b>630005, г. Новосибирск, ул. Достоевского 58, 605</b>
            </li>
            <li>
              <span>Получатель заказа:&nbsp;</span> <b>Телков Вячеслав Алексеевич</b>
            </li>
          </ul>
        </div>

        <div className="orders-details__right">
          <div className="profile-info">
            <ul>
              <li>
                <span>Сумма (RUB)&nbsp;</span>: <b>{priceFormatter(order.amount, 2)}</b>
              </li>
              <li>
                <span>НДС (RUB)&nbsp;</span>: <b>{priceFormatter(order.amount * 0.2, 2)}</b>
              </li>
              <li>
                <span>Остаток (RUB)&nbsp;</span>: <b>{priceFormatter(order.amount - order.payed, 2)}</b>
              </li>
            </ul>
          </div>

          <div className={'orders-chronology__scroller'}>
            <ul className={'orders-chronology__list'}>
              <li className={'__odd'}>
                <span>25.05.2021 — отгружено 20%</span>
                <a className={'orders-chronology__link __green'} href="#">
                  упд xlsx
                </a>
              </li>
              <li className={'__even'}>
                <span>25.05.2021 — на складе 10%</span>
              </li>
              <li className={'__odd'}>
                <span>07.06.2021 — товар заказан</span>
              </li>
              <li className={'__even'}>
                <span>26.05.2021 — оплачено 30%</span>
              </li>
              <li className={'__odd'}>
                <span>25.05.2021 — счёт выставлен</span>
                <a className={'orders-chronology__link __green'} href="#">
                  xlsx
                </a>
                <a className={'orders-chronology__link __red'} href="#">
                  pdf
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="aside-order">
        <div className={`form-filter__controls`}>
          <div className="form-filter__controls_left">
            <div className="form-filter__control">
              <Ripples
                onClick={() => {
                  if (order.products && order.products.length) {
                    xlsDownload([...order.products], RUB, 2);
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
                  <span>Скачать данные о заказе</span>
                </div>
              </Ripples>
            </div>
          </div>
        </div>

        <div className="search-results">
          <div className="search-results__table">
            <div className="search-results__head-wrapper">{tHead}</div>

            {order.products && order.products.length ? order.products.map((row, ri) => <DetailsRow key={ri} tableHeader={tableHeader} currency={RUB} notificationFunc={notificationFunc} row={row} rowIndex={ri} />) : null}
          </div>
        </div>
      </div>

      <div className="aside-caption">Ваш менеджер</div>

      <div className="profile-info">
        <ul>
          <li>{profile.responsible_name}</li>
          <li>{profile.responsible_phone}</li>
          <li>{profile.responsible_email}</li>
        </ul>
      </div>

      <div className="aside-caption __mb-18">Нужно отправить сообщение менеджеру об этом заказе?</div>

      <form ref={authRef} className="form-content" onSubmit={changeSubmit}>
        <FormInput
          onChange={handleChange.bind(this, 'details-email')}
          placeholder="Ваш email"
          name="details-email"
          //
          error={errors['details-email']}
          className="__lg"
          inputRef={emailInput}
        />

        <FormInput
          onChange={handleChange.bind(this, 'details-contact')}
          placeholder="ФИО"
          name="details-contact"
          //
          error={errors['details-contact']}
          className="__lg"
          inputRef={contactInput}
        />

        <FormInput
          onChange={handleChange.bind(this, 'details-phone')}
          placeholder="Телефон"
          name="details-phone"
          //
          error={errors['details-phone']}
          className="__lg"
          inputRef={phoneInput}
        />

        <FormInput textarea placeholder="Ваш вопрос, пожелание или другое сообщение менеджеру" name="details-delivery" error={null} className="__lg" inputRef={commentInput} />

        <div className="form-control">
          <Ripples className={`__w-100p btn __blue __lg${!validForm ? ' __disabled' : ''}`} during={1000}>
            <button name="details-submit" className="btn-inner">
              <span>Отправить</span>
            </button>
          </Ripples>
        </div>
      </form>
    </div>
  ) : null;
};
export default OrderDetails;