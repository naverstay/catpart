import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDetectClickOutside } from 'react-detect-click-outside';
import { Link } from 'react-router-dom';
import Ripples from 'react-ripples';
import A from './A';
import Img from './Img';
import NavBar from './NavBar';
import HeaderLink from './HeaderLink';
import Banner from './banner.jpg';
// import messages from './messages';

function Header({ openMobMenu, cartCount, setOpenMobMenu }) {
  const headerRef = useDetectClickOutside({
    onTriggered: () => {
      setOpenMobMenu(false);
    },
  });

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
              О сервисе
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

      <div className="header-right">
        {/*<Link className="header-navbar__link" to="/cabinet ">*/}
        {/*  Личный кабинет*/}
        {/*</Link>*/}
        <div className="header-order">
          <Ripples during={1000} className={'btn __blue' + (cartCount ? '' : ' __disabled')}>
            <Link to={'/cart'} className="btn-inner">
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
