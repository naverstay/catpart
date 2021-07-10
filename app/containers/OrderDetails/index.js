import React, { useEffect, useState } from 'react';
import Ripples from 'react-ripples';
import FormInput from '../../components/FormInput';
import { setInputFilter } from '../../utils/inputFilter';
import { validateEmail } from '../../utils/validateEmail';

const OrderDetails = props => {
  let { detailsId, setOrderDetails, profile } = props;

  const authRef = React.createRef();
  const phoneInput = React.createRef();
  const commentInput = React.createRef();
  const contactInput = React.createRef();
  const emailInput = React.createRef();

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

  useEffect(() => {
    setInputFilter(phoneInput.current, function(value) {
      return /^\+?\d*$/.test(value); // Allow digits and '+' on beginning only, using a RegExp
    });

    return () => {
      phoneInput.current = false;
    };
  }, []);

  return (
    <div className="profile __details">
      <div className="aside-title">Заказ №1596321 от 25.05.2021</div>

      <div className="aside-caption">Ваш менеджер</div>

      <div className="profile-info">
        <ul>
          <li>{profile.responsible_name}</li>
          <li>{profile.responsible_phone}</li>
          <li>{profile.responsible_email}</li>
        </ul>
      </div>

      <div className="aside-caption">Нужно отправить сообщение менеджеру об этом заказе?</div>

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
  );
};

export default OrderDetails;
