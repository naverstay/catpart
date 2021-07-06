import React, { useState } from 'react';
import { useDetectClickOutside } from 'react-detect-click-outside';
import { Link } from 'react-router-dom';
import Ripples from 'react-ripples';
import FormInput from '../FormInput';
import { validateEmail } from '../../utils/validateEmail';

function Header({ openMobMenu, cartCount, setOpenMobMenu }) {
  const headerRef = useDetectClickOutside({
    onTriggered: () => {
      setOpenMobMenu(false);
    },
  });

  const [fields, setFields] = useState({
    'auth-login': '',
    'auth-password': '',
  });
  const [errors, setErrors] = useState({
    'auth-login': null,
    'auth-password': null,
  });

  const [resetFields, setResetFields] = useState({
    'auth-email': '',
  });
  const [resetErrors, setResetErrors] = useState({
    'auth-email': null,
  });

  const authRef = React.createRef();
  const resetRef = React.createRef();
  const emailInput = React.createRef();
  const loginInput = React.createRef();
  const passwordInput = React.createRef();

  const [profile, setProfile] = useState({});
  const [openResetPassword, setOpenResetPassword] = useState(false);
  const [openAuthPopup, setOpenAuthPopup] = useState(false);
  const [justRedraw, setJustRedraw] = useState(0);
  const [validForm, setValidForm] = useState(false);
  const [validResetForm, setValidResetForm] = useState(false);

  const popupRef = useDetectClickOutside({
    onTriggered: () => {
      setOpenResetPassword(false);
      setOpenAuthPopup(false);
    },
  });

  const handleChange = (field, e) => {
    console.log('handleChange', field, e);
    fields[field] = e.target.value;
    setFields(fields);

    switch (field) {
      case 'auth-login':
        errors[field] = e.target.value.length ? '' : 'Не может быть пустым';
        break;
      case 'auth-password':
        errors[field] = e.target.value.length > 8 ? '' : 'Минимум 8 символов';
        break;
    }

    //localStorage.setItem('catpart-user', JSON.stringify(fields));

    setErrors(errors);

    setValidForm(!Object.values(errors).filter(er => er === null || er.length).length);

    setJustRedraw(justRedraw + 1);
  };

  const handleResetChange = (field, e) => {
    console.log('handleResetChange', field, e);
    resetFields[field] = e.target.value;
    setResetFields(resetFields);

    switch (field) {
      case 'auth-email':
        resetErrors[field] = e.target.value.length && validateEmail(e.target.value) ? '' : 'Проверьте формат e-mail';
        break;
    }

    //localStorage.setItem('catpart-user', JSON.stringify(fields));

    setResetErrors(resetErrors);

    setValidResetForm(!Object.values(resetErrors).filter(er => er === null || er.length).length);
  };

  const authSubmit = e => {
    e.preventDefault();

    console.log('authSubmit');

    setOpenAuthPopup(false);

    setProfile({ auth: 1 });

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

  const resetSubmit = e => {
    e.preventDefault();

    console.log('resetSubmit');

    setOpenResetPassword(false);

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

  return (
    <header ref={headerRef} className={`header${openMobMenu ? ' __open-mob-menu' : ''}`}>
      <div className="header-left">
        <div
          onClick={() => {
            setOpenMobMenu(!openMobMenu);
          }}
          className="header-menu btn __blue"
        >
          <span />
          <span />
          <span />
        </div>
        <Link to="/" className="header-logo">
          catpart.ru
        </Link>
        <a href="tel:88005057388" className="header-phone __blue">
          <span className="btn__icon icon icon-call" />
          <span>8-800-505-73-88</span>
        </a>
      </div>

      <div className="header-navbar">
        <ul className="header-navbar__list">
          <li>
            <Link className="header-navbar__link" to="/about">
              О компании
            </Link>
          </li>
          {/*<li>*/}
          {/*  <Link className="header-navbar__link" to="/distributors">*/}
          {/*    Поставщики*/}
          {/*  </Link>*/}
          {/*</li>*/}
          <li>
            <Link className="header-navbar__link" to="/delivery">
              Доставка
            </Link>
          </li>
          {/*<li>*/}
          {/*  <Link className="header-navbar__link" to="/conditions">*/}
          {/*    Условия*/}
          {/*  </Link>*/}
          {/*</li>*/}
          {/*<li>*/}
          {/*  <Link className="header-navbar__link" to="/requisites">*/}
          {/*    Реквизиты*/}
          {/*  </Link>*/}
          {/*</li>*/}
          {/*<li>*/}
          {/*  <Link className="header-navbar__link" to="/vacancies ">*/}
          {/*    Вакансии*/}
          {/*  </Link>*/}
          {/*</li>*/}
        </ul>
      </div>

      <div className={'header-right' + (profile.hasOwnProperty('auth') ? ' __auth' : '')}>
        {profile.hasOwnProperty('auth') ? (
          <Ripples during={1000} className={'btn __blue'}>
            <Link to={'/orders'} className="btn-inner">
              <span className={'__dotted'}>Телков Вячеслав Алексеевич</span>
            </Link>
          </Ripples>
        ) : (
          <div ref={popupRef} className={'header-popup__holder'}>
            <span
              onClick={() => {
                setOpenAuthPopup(!openAuthPopup);

                console.log('open', openAuthPopup);
              }}
              className="header-navbar__link"
            >
              Личный кабинет
            </span>

            {openAuthPopup || openResetPassword ? (
              <div className="header-popup">
                <h3 className={'header-popup__title'}>{openResetPassword ? 'Восстановление пароля' : 'Авторизация'}</h3>
                <p>{openResetPassword ? 'Укажите вашу электронную почту или логин для восстановления пароля' : 'Введите логин и пароль для входа в систему'}</p>

                {openAuthPopup ? (
                  <form ref={authRef} className="form-content" onSubmit={authSubmit}>
                    <FormInput
                      onChange={handleChange.bind(this, 'auth-login')}
                      placeholder="Логин"
                      name="auth-login"
                      //
                      error={errors['auth-login']}
                      className="__lg"
                      inputRef={loginInput}
                    />
                    <FormInput
                      onChange={handleChange.bind(this, 'auth-password')}
                      placeholder="Пароль"
                      name="auth-password"
                      //
                      error={errors['auth-password']}
                      className="__lg"
                      inputRef={passwordInput}
                    />

                    <div className="form-control">
                      <Ripples className={`__w-100p btn __blue __lg${!validForm ? ' __disabled' : ''}`} during={1000}>
                        <button name="auth-submit" className="btn-inner">
                          <span>Войти</span>
                        </button>
                      </Ripples>
                    </div>
                  </form>
                ) : (
                  <form ref={resetRef} className="form-content" onSubmit={resetSubmit}>
                    <FormInput
                      onChange={handleResetChange.bind(this, 'auth-email')}
                      placeholder="Электронная почта"
                      name="auth-email"
                      //
                      error={resetErrors['auth-email']}
                      className="__lg"
                      inputRef={emailInput}
                    />

                    <div className="form-control">
                      <Ripples className={`__w-100p btn __blue __lg${!validResetForm ? ' __disabled' : ''}`} during={1000}>
                        <button name="auth-submit" className="btn-inner">
                          <span>Восстановить</span>
                        </button>
                      </Ripples>
                    </div>
                  </form>
                )}

                <p>
                  <span
                    onClick={() => {
                      setOpenResetPassword(!openResetPassword);
                      setOpenAuthPopup(!openAuthPopup);
                    }}
                    className="header-navbar__link"
                  >
                    {openResetPassword ? 'Авторизоваться' : 'Забыли пароль?'}
                  </span>
                </p>
              </div>
            ) : null}
          </div>
        )}

        <div className="header-order">
          <Ripples during={1000} className={'btn __blue' + (cartCount ? '' : ' __disabled')}>
            <Link to={'/order'} className="btn-inner">
              <span className={'header-order__label'}>Заказ</span>
              <span className={'header-order__count'}>{cartCount}</span>
            </Link>
          </Ripples>
        </div>
      </div>
    </header>
  );
}

export default Header;
