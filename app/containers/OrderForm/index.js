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
import FormSelect from '../../components/FormSelect';
import { validateEmail } from '../../utils/validateEmail';
import dateFormatter from '../../utils/dateFormatter';

const key = 'home';

export function OrderForm({ dndFile, delivery, updateCart, history, notificationFunc, setOrderSent, currency, totalCart, onSubmitForm, loading, error, repos, onChangeUsername }) {
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
  const [deliveryOptions, setDeliveryOptions] = useState([]);
  const [preSelectedDelivery, setPreSelectedDelivery] = useState(-1);

  const formRef = React.createRef();

  const requiredFields = ['order-email', 'order-name', 'order-phone', 'order-inn', 'order-delivery'];

  const handleChange = (field, e) => {
    console.log('handleChange', field, e);
    fields[field] = e.target.value;
    setFields(fields);

    switch (field) {
      case 'order-name':
      case 'order-inn':
      case 'order-delivery':
        errors[field] = e.target.value.length ? '' : 'Не может быть пустым';
        break;
      case 'order-phone':
        errors[field] = e.target.value.length >= 8 ? '' : 'Минимум 8 символов';
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

    const products = store.map(s => {
      const priceIndex = findPriceIndex(s.pricebreaks, s.cart);
      const { price } = s.pricebreaks[priceIndex];
      const { pureprice } = s.pricebreaks[priceIndex];

      const now = new Date();

      return {
        partNo: s.name,
        supllier: s.manufacturer,
        manufacturer: s.brand,
        packingRate: s.pack_quant,
        amount: s.cart,
        pureprice: pureprice,
        price: price,
        priceSumm: `${priceFormatter(s.cart * (price / currency.exChange), currency.precision)} RUB на ${dateFormatter(now, true)}`,
        deliveryTime: s.delivery_period,
      };
    });

    if (products.length) {
      const order = {
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
        products,
      };

      apiORDER(url, order, {}, respData => {
        setOrderSent(true);

        ym && ym(81774553, 'reachGoal', 'senttheorder');

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

    const deliveryList = [{ value: 'Самовывоз со склада в Новосибирске', label: 'Самовывоз со склада в Новосибирске' }, { value: 'Доставка курьерской службой', label: 'Доставка курьерской службой' }];

    const user = localStorage.getItem('catpart-user');

    if (user) {
      const userFields = JSON.parse(user);
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

        setPreSelectedDelivery(deliveryList.findIndex(d => d.value === userFields['order-delivery']));

        deliveryList.forEach(d => {
          if (d.value === userFields['order-delivery']) {
            d.selected = true;
          }
        });
      }
    }

    if (!totalCart) {
      history.push('/');
    }

    setDeliveryOptions([...deliveryList]);

    return () => {
      phoneInput.current = false;
    };
  }, []);

  return (
    <div className={`form-order${delivery ? ' __delivery' : ''}`}>
      <form ref={formRef} className="form-content" onSubmit={contactSubmit}>
        {delivery && (
          <>
            {/* <div className="form-order__text">Максимальный срок доставки:</div> */}
            {/* <div className="form-order__text">3-4 недели</div> */}
            <div className="form-order__text">Итого:</div>
            <div className="form-order__text">
              <span ref={totalPriceRef} className="form-order__price" /> {currency.name}
            </div>
          </>
        )}

        <FormInput
          onChange={handleChange.bind(this, 'order-email')}
          placeholder="Ваш email"
          name="order-email"
          //
          error={errors['order-email']}
          className="__lg"
          inputRef={emailInput}
        />

        <FormInput
          onChange={handleChange.bind(this, 'order-name')}
          placeholder="ФИО"
          name="order-name"
          //
          error={errors['order-name']}
          className="__lg"
          inputRef={nameInput}
        />

        <FormInput
          onChange={handleChange.bind(this, 'order-phone')}
          placeholder="Телефон"
          name="order-phone"
          //
          error={errors['order-phone']}
          className="__lg"
          inputRef={phoneInput}
        />

        <FormInput
          onChange={handleChange.bind(this, 'order-inn')}
          placeholder="ИНН"
          name="order-inn"
          //
          error={errors['order-inn']}
          className="__lg"
          inputRef={innInput}
        />

        {/* <FormInput */}
        {/*  onChange={handleChange.bind(this, 'order-delivery')} */}
        {/*  placeholder={'Доставка'} */}
        {/*  name="order-delivery" */}
        {/*  // */}
        {/*  error={errors['order-delivery']} */}
        {/*  className={'__lg'} */}
        {/*  inputRef={deliveryInput} */}
        {/* /> */}

        <input
          //
          className="hide"
          ref={deliveryInput || null}
        />

        {deliveryOptions.length ? <FormSelect onChange={handleChange} options={deliveryOptions} placeholder="Доставка" name="order-delivery" error={errors['order-delivery']} preSelectedValue={preSelectedDelivery} className="__lg" inputRef={deliveryInput} /> : null}

        <FormInput textarea placeholder="Комментарий" name="order-comment" error={null} className="__lg" inputRef={commentInput} />

        <div className="form-control">
          <Ripples className={`__w-100p btn __blue __lg${!validForm ? ' __disabled' : ''}`} during={1000}>
            <button name="order-submit" className="btn-inner">
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
    // onSubmitForm: evt => {
    //  console.log('## dispatch onSubmitForm');
    //  if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    //  dispatch(loadRepos());
    // },
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
