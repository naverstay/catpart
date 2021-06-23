/*
 * OrderForm
 *
 */

import React, { useEffect, memo, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
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
import H2 from 'components/H2';
import ReposList from 'components/ReposList';
import { readFile } from '../../utils/fileReader';
import AtPrefix from './AtPrefix';
import CenteredSection from './CenteredSection';
import Form from './Form';
import Input from './Input';
import Section from './Section';
// import messages from './messages';
import { loadRepos } from '../App/actions';
import { changeArtNumber } from './actions';
import { makeSelectArtNumber } from './selectors';
import { setInputFilter } from '../../utils/inputFilter';
import reducer from './reducer';
import saga from './saga';
import FormInput from '../../components/FormInput';
import priceFormatter from '../../utils/priceFormatter';
import { counterEffect } from '../../utils/counterEffect';

const key = 'home';

export function OrderForm({ dndFile, delivery, notificationFunc, currency, totalCart, onSubmitForm, loading, error, repos, onChangeUsername }) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });

  const innInput = React.createRef();
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

    setErrors(errors);

    setValidForm(!Object.values(errors).filter(er => er === null || er.length).length);

    setJustRedraw(justRedraw + 1);
  };

  const contactSubmit = e => {
    e.preventDefault();

    console.log('submit');
  };

  useEffect(() => {
    counterEffect(totalPriceRef.current, totalPrice, totalCart / currency.exChange, 800);
    setTotalPrice(totalCart / currency.exChange);
  }, [totalCart, currency]);

  useEffect(() => {
    setInputFilter(phoneInput.current, function(value) {
      return /^\+?\d*$/.test(value); // Allow digits and '+' on beginning only, using a RegExp
    });

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
        />

        <FormInput
          onChange={handleChange.bind(this, 'order-name')}
          placeholder={'ФИО'}
          name="order-name"
          //
          error={errors['order-name']}
          className={'__lg'}
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
        />

        <FormInput textarea={true} placeholder={'Комментарий'} name="order-delivery" error={null} className="__lg" />

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
