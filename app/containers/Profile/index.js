import React, { useEffect, useState } from 'react';
import Ripples from 'react-ripples';
import FormInput from '../../components/FormInput';

const Profile = props => {
  let { activeIndex, setProfile } = props;

  const authRef = React.createRef();
  const resetRef = React.createRef();
  const emailInput = React.createRef();
  const loginInput = React.createRef();
  const passwordInput = React.createRef();

  const [fields, setFields] = useState({
    'auth-login': '',
    'auth-password': '',
  });
  const [errors, setErrors] = useState({
    'auth-login': null,
    'auth-password': null,
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
      case 'auth-login':
        errors[field] = e.target.value.length ? '' : 'Не может быть пустым';
        break;
      case 'auth-password':
        errors[field] = e.target.value.length >= 8 ? '' : 'Минимум 8 символов';
        break;
    }

    //localStorage.setItem('catpart-user', JSON.stringify(fields));

    setErrors(errors);

    setValidForm(!Object.values(errors).filter(er => er === null || er.length).length);

    setJustRedraw(justRedraw + 1);
  };

  return (
    <div className="profile">
      <div className="aside-title">Профиль</div>

      <form ref={authRef} className="form-content" onSubmit={changeSubmit}>
        <FormInput
          onChange={handleChange.bind(this, 'auth-login')}
          placeholder="Логин"
          name="auth-login"
          //
          error={errors['auth-login']}
          defaultValue={'test@test.ru'}
          className="__lg"
          inputRef={loginInput}
        />
        <FormInput
          onChange={handleChange.bind(this, 'auth-password')}
          placeholder="Пароль"
          name="auth-password"
          //
          error={errors['auth-password']}
          defaultValue={'12345678'}
          className="__lg"
          inputRef={passwordInput}
        />

        <div className="form-control">
          <Ripples className={`__w-100p btn __blue __lg${!validForm ? ' __disabled' : ''}`} during={1000}>
            <button name="auth-submit" className="btn-inner">
              <span>Изменить</span>
            </button>
          </Ripples>
        </div>
      </form>

      <div className="profile-info">
        <ul>
          <li>
            <span>Сумма заказов:&nbsp;</span>
            <b>423 123 812,1234 RUB</b>
          </li>
          <li>
            <span>В этом месяце:&nbsp;</span>
            <b>423 123 812,1234 RUB</b>
          </li>
          <li>
            <span>Всего счетов:&nbsp;</span>
            <b>100500</b>
          </li>
          <li>
            <span>Счета в работу:&nbsp;</span>
            <b>100500</b>
          </li>
        </ul>
      </div>

      <div className="aside-caption">Ваш менеджер</div>

      <div className="profile-info">
        <ul>
          <li>Иван Иванов</li>
          <li>+7 923 456-54-54</li>
          <li>skjghlwuieg@sibelcom54.com</li>
        </ul>
      </div>

      <div className="profile-logout">
        <div className="form-control">
          <Ripples
            onClick={() => {
              setProfile({});
            }}
            className={`__w-100p btn __blue __lg`}
            during={1000}
          >
            <button name="auth-submit" className="btn-inner">
              <span>Выйти</span>
            </button>
          </Ripples>
        </div>
      </div>
    </div>
  );
};

export default Profile;
