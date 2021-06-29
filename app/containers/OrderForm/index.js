/*
 * OrderForm
 *
 */

import React, { useEffect, memo, useState } from 'react';

import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import Ripples from 'react-ripples';

import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import { makeSelectRepos, makeSelectLoading, makeSelectError } from 'containers/App/selectors';

import { changeArtNumber } from './actions';
import { makeSelectArtNumber } from './selectors';
import { setInputFilter } from '../../utils/inputFilter';
import reducer from './reducer';
import saga from './saga';
import FormInput from '../../components/FormInput';
import priceFormatter from '../../utils/priceFormatter';
import { counterEffect } from '../../utils/counterEffect';
import apiORDER from '../../utils/order';
import { findPriceIndex } from '../../utils/findPriceIndex';

const key = 'home';

export function OrderForm({ dndFile, delivery, updateCart, notificationFunc, setOrderSent, currency, totalCart, onSubmitForm, loading, error, repos, onChangeUsername }) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });

  const emailInput = React.createRef();
  const nameInput = React.createRef();
  const innInput = React.createRef();
  const commentInput = React.createRef();
  const deliveryInput = React.createRef();
  const phoneInput = React.createRef();
  const totalPriceRef = React.createRef();
  const [fields, setFields] = useState({
    'order-email': '',
    'order-name': '',
    'order-phone': '',
    'order-inn': '',
    'order-delivery': '',
  });
  const [justRedraw, setJustRedraw] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [errors, setErrors] = useState({
    'order-email': null,
    'order-name': null,
    'order-phone': null,
    'order-inn': null,
    'order-delivery': null,
  });
  const [validForm, setValidForm] = useState(false);

  const formRef = React.createRef();

  const requiredFields = ['order-email', 'order-name', 'order-phone', 'order-inn', 'order-delivery'];

  const validateEmail = email => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const leadingZero = val => {
    return ('0' + val).slice(-2);
  };

  const handleChange = (field, e) => {
    fields[field] = e.target.value;
    setFields(fields);

    switch (field) {
      case 'order-name':
      case 'order-inn':
      case 'order-delivery':
        errors[field] = e.target.value.length ? '' : 'Не может быть пустым';
        break;
      case 'order-phone':
        errors[field] = e.target.value.length > 8 ? '' : 'Минимум 8 символов';
        break;
      case 'order-email':
        errors[field] = e.target.value.length && validateEmail(e.target.value) ? '' : 'Проверьте формат e-mail';
        break;
    }

    localStorage.setItem('catpart-user', JSON.stringify(fields));

    setErrors(errors);

    setValidForm(!Object.values(errors).filter(er => er === null || er.length).length);

    setJustRedraw(justRedraw + 1);
  };

  const contactSubmit = e => {
    e.preventDefault();

    const url = '/set/deal';

    let store = localStorage.getItem('catpart');

    if (store) {
      store = JSON.parse(store);
    } else {
      store = {};
    }

    if (!store.hasOwnProperty('order')) {
      store.order = [];
      localStorage.setItem('catpart', JSON.stringify(store));
    }

    function join(t, a, s) {
      function format(m) {
        let f = new Intl.DateTimeFormat('en', m);
        return f.format(t);
      }

      return a.map(format).join(s);
    }

    let products = store.map(s => {
      let priceIndex = findPriceIndex(s.pricebreaks, s.cart);
      let price = s.pricebreaks[priceIndex].price;
      let pureprice = s.pricebreaks[priceIndex].pureprice;

      let time = new Date();
      let now = join(time, [{ day: '2-digit' }, { month: '2-digit' }, { year: 'numeric' }], '.');

      return {
        partNo: s.name,
        supllier: s.manufacturer,
        manufacturer: s.brand,
        packingRate: s.pack_quant,
        amount: s.cart,
        pureprice: price,
        price: price,
        priceSumm: priceFormatter(s.cart * (price / currency.exChange), currency.precision) + ' RUB на ' + now + ' ' + leadingZero(time.getHours()) + ':' + leadingZero(time.getMinutes()),
        deliveryTime: s.delivery_period,
      };
    });

    if (products.length) {
      let order = {
        authCode: '123456',
        catpartCompanyId: 213,
        catpartDealId: 133,
        INN: parseInt(fields['order-inn']),
        name: fields['order-name'],
        email: fields['order-email'],
        phone: fields['order-phone'],
        delivery: fields['order-delivery'],
        comment: commentInput.current.value || '',
        maxDeliveryTime: 'Максимальный срок',
        summ: (totalCart / currency.exChange).toFixed(2),
        products: products,
      };

      apiORDER(url, order, {}, respData => {
        console.log('respData', respData);
        setOrderSent(true);

        if (respData && respData.hasOwnProperty('status') && respData.status === 'ok') {
          notificationFunc('success', 'Заказ доставлен!', 'И уже обрабатывается ;)');
          updateCart(null, 0, {}, true);
        } else {
          notificationFunc('success', 'Ошибка обработки заказа.', 'Повторите позже.');
        }
      });
    } else {
      notificationFunc('success', 'В заказе не товаров.', `Заказ не отправлен.`);
    }
  };

  useEffect(() => {
    if (delivery) {
      counterEffect(totalPriceRef.current, totalPrice, totalCart / currency.exChange, 800, currency.precision);

      setTotalPrice(totalCart / currency.exChange);
    }
  }, [totalCart, currency]);

  useEffect(() => {
    setInputFilter(phoneInput.current, function(value) {
      return /^\+?\d*$/.test(value); // Allow digits and '+' on beginning only, using a RegExp
    });

    let user = localStorage.getItem('catpart-user');

    if (user) {
      let userFields = JSON.parse(user);
      setFields(userFields);

      if (userFields['order-email']) {
        emailInput.current.value = userFields['order-email'];
        handleChange('order-email', { target: emailInput.current });
      }

      if (userFields['order-name']) {
        nameInput.current.value = userFields['order-name'];
        handleChange('order-name', { target: nameInput.current });
      }

      if (userFields['order-phone']) {
        phoneInput.current.value = userFields['order-phone'];
        handleChange('order-phone', { target: phoneInput.current });
      }

      if (userFields['order-inn']) {
        innInput.current.value = userFields['order-inn'];
        handleChange('order-inn', { target: innInput.current });
      }

      if (userFields['order-delivery']) {
        deliveryInput.current.value = userFields['order-delivery'];
        handleChange('order-delivery', { target: deliveryInput.current });
      }
    }

    return () => {
      phoneInput.current = false;
    };
  }, []);

  return (
    <div className={'form-order' + (delivery ? ' __delivery' : '')}>
      <form ref={formRef} className="form-content" onSubmit={contactSubmit}>
        {delivery && (
          <>
            <div className="form-order__text">Максимальный срок доставки:</div>
            <div className="form-order__text">3-4 недели</div>
            <div className="form-order__text">Итого:</div>
            <div className="form-order__text">
              <span ref={totalPriceRef} className="form-order__price" /> {currency.name}
            </div>
          </>
        )}

        <FormInput
          onChange={handleChange.bind(this, 'order-email')}
          placeholder={'Ваш email'}
          name="order-email"
          //
          error={errors['order-email']}
          className={'__lg'}
          inputRef={emailInput}
        />

        <FormInput
          onChange={handleChange.bind(this, 'order-name')}
          placeholder={'ФИО'}
          name="order-name"
          //
          error={errors['order-name']}
          className={'__lg'}
          inputRef={nameInput}
        />

        <FormInput
          onChange={handleChange.bind(this, 'order-phone')}
          placeholder={'Телефон'}
          name="order-phone"
          //
          error={errors['order-phone']}
          className={'__lg'}
          inputRef={phoneInput}
        />

        <FormInput
          onChange={handleChange.bind(this, 'order-inn')}
          placeholder={'ИНН'}
          name="order-inn"
          //
          error={errors['order-inn']}
          className={'__lg'}
          inputRef={innInput}
        />

        <FormInput
          onChange={handleChange.bind(this, 'order-delivery')}
          placeholder={'Доставка'}
          name="order-delivery"
          //
          error={errors['order-delivery']}
          className={'__lg'}
          inputRef={deliveryInput}
        />

        <FormInput textarea={true} placeholder={'Комментарий'} name="order-delivery" error={null} className="__lg" inputRef={commentInput} />

        <div className="form-control">
          <Ripples className={'__w-100p btn __blue __lg' + (!validForm ? ' __disabled' : '')} during={1000}>
            <button name={'order-submit'} className="btn-inner">
              <span>Оформить заказ</span>
            </button>
          </Ripples>
        </div>
      </form>
    </div>
  );
}

OrderForm.propTypes = {
  dndFile: PropTypes.string,
  busy: PropTypes.bool,
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  repos: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  notificationFunc: PropTypes.func,
  onSubmitForm: PropTypes.func,
  artNumber: PropTypes.string,
  onChangeUsername: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  repos: makeSelectRepos(),
  artNumber: makeSelectArtNumber(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
});

export function mapDispatchToProps(dispatch) {
  return {
    onChangeUsername: evt => dispatch(changeArtNumber(evt.target.value)),
    //onSubmitForm: evt => {
    //  console.log('## dispatch onSubmitForm');
    //  if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    //  dispatch(loadRepos());
    //},
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(OrderForm);
