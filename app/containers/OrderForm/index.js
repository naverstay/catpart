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
import messages from './messages';
import { loadRepos } from '../App/actions';
import { changeArtNumber } from './actions';
import { makeSelectArtNumber } from './selectors';
import { setInputFilter } from '../../utils/inputFilter';
import reducer from './reducer';
import saga from './saga';
import FormInput from '../../components/FormInput';

const key = 'home';

export function OrderForm({ dndFile, notificationFunc, onSubmitForm, loading, error, repos, onChangeUsername }) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });

  const [fields, setFields] = useState({});
  const [errors, setErrors] = useState({});
  const [validForm, setValidForm] = useState(false);

  const formRef = React.createRef();

  const requiredFields = ['order-email', 'order-name', 'order-phone', 'order-inn', 'order-delivery'];

  const handleValidation = () => {
    let formIsValid = true;

    //Name
    if (!fields['name']) {
      formIsValid = false;
      errors['name'] = 'Cannot be empty';
    }

    if (typeof fields['name'] !== 'undefined') {
      if (!fields['name'].match(/^[a-zA-Z]+$/)) {
        formIsValid = false;
        errors['name'] = 'Only letters';
      }
    }

    //Email
    if (!fields['email']) {
      formIsValid = false;
      errors['email'] = 'Cannot be empty';
    }

    if (typeof fields['email'] !== 'undefined') {
      let lastAtPos = fields['email'].lastIndexOf('@');
      let lastDotPos = fields['email'].lastIndexOf('.');

      if (!(lastAtPos < lastDotPos && lastAtPos > 0 && fields['email'].indexOf('@@') == -1 && lastDotPos > 2 && fields['email'].length - lastDotPos > 2)) {
        formIsValid = false;
        errors['email'] = 'Email is not valid';
      }
    }

    setErrors(errors);

    return formIsValid;
  };

  const handleChange = (field, e) => {
    fields[field] = e.target.value;
    setFields(fields);

    let v = requiredFields.filter(f => {
      return !(fields.hasOwnProperty(f) && fields[f].length);
    });

    setValidForm(!v.length);
  };

  const contactSubmit = e => {
    e.preventDefault();

    if (handleValidation()) {
      alert('Form submitted');
    } else {
      alert('Form has errors.');
    }
  };

  return (
    <div className="form-order">
      <form ref={formRef} className="form-content" onSubmit={contactSubmit}>
        <div className="form-order__text">Максимальный срок доставки:</div>
        <div className="form-order__text">3-4 недели</div>
        <div className="form-order__text">Итого:</div>
        <div className="form-order__text">
          <span className="form-order__price">61 116 268,08 </span> RUB
        </div>

        <FormInput onChange={handleChange.bind(this, 'order-email')} value={fields['order-email']} placeholder={'Ваш email'} name="order-email" className="__lg" />

        <FormInput onChange={handleChange.bind(this, 'order-name')} value={fields['order-name']} placeholder={'ФИО'} name="order-name" className="__lg" />

        <FormInput onChange={handleChange.bind(this, 'order-phone')} value={fields['order-phone']} placeholder={'Телефон'} name="order-phone" className="__lg" />

        <FormInput onChange={handleChange.bind(this, 'order-inn')} value={fields['order-inn']} placeholder={'ИНН'} name="order-inn" className="__lg" />

        <FormInput onChange={handleChange.bind(this, 'order-delivery')} value={fields['order-delivery']} placeholder={'Доставка'} name="order-delivery" className="__lg" />

        <FormInput textarea={true} placeholder={'Комментарий'} name="order-delivery" className="__lg" />

        <div className="form-control">
          <Ripples className="__w-100p" during={1000}>
            <button disabled={!validForm} className="btn __blue __lg __w-100p">
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
