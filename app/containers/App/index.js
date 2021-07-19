/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Switch, Route, useHistory } from 'react-router-dom';
import ReactNotification, { store } from 'react-notifications-component';
import SearchForm from 'containers/SearchForm/Loadable';
import FilterForm from 'containers/FilterForm/Loadable';
import FeaturePage from 'containers/FeaturePage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import Header from 'components/Header';
import Footer from 'components/Footer';

import apiGET from '../../utils/search';
import PolicyPage from '../PolicyPage';
import { findPriceIndex } from '../../utils/findPriceIndex';
import DeliveryPage from '../DeliveryPage';
import AsideContainer from '../AsideContainer';
import Profile from '../Profile';
import ProfileRequisites from '../ProfileRequisites';
import { validateJSON } from '../../utils/validateJSON';
import OrderDetails from '../OrderDetails';
import { OrdersPage } from '../OrdersPage';

export default function App() {
  const history = useHistory();

  const RUB = { name: 'RUB', exChange: 1, precision: 2 };
  const [currency, setCurrency] = useState(RUB);
  const [tableHeadFixed, setTableHeadFixed] = useState(null);
  const [showTableHeadFixed, setShowTableHeadFixed] = useState(false);
  const [searchData, setSearchData] = useState({});
  const [openMobMenu, setOpenMobMenu] = useState(false);
  const [orderSent, setOrderSent] = useState(false);
  const [searchCount, setSearchCount] = useState(1);
  const [cartCount, setCartCount] = useState(0);
  const [totalCart, setTotalCart] = useState(0);

  const [searchResult, setSearchResult] = useState(false);
  const [appDrag, setAppDrag] = useState(false);
  const [dragText, setDragText] = useState('');

  const [pageY, setPageY] = useState(0);
  const [centeredForm, setCenteredForm] = useState(true);
  const [formBusy, setFormBusy] = useState(false);
  const [formDrag, setFormDrag] = useState(false);

  const [profile, setProfile] = useState({});
  const [profileRequisites, setProfileRequisites] = useState({});
  const [openProfile, setOpenProfile] = useState(false);
  const [openRequisites, setOpenRequisites] = useState(0);
  const [openDetails, setOpenDetails] = useState(0);
  const [asideOpen, setAsideOpen] = useState(false);
  const [asideContent, setAsideContent] = useState(null);

  const updateLocationParams = loc => {
    setCenteredForm(loc.pathname === '/');
  };

  history.listen(function(loc) {
    updateLocationParams(loc);
    setOrderSent(false);
  });

  const ordersList = [
    {
      data: [
        {
          id: 1,
          order_num: '1596321',
          requisites: 'ООО "СИБЭЛКОМ-ЛОГИСТИК"',
          client: 'Телков Вячеслав Алексеевич',
          total: 20156321.36,
          rest: 385962.21,
          date_create: '25.05.2021',
          date_delivery: '25.05.2021',
          chronology: '25.05.2021 — отгружено 20%',
        },
        {
          id: 2,
          order_num: '1596322',
          requisites: 'ООО "СИБЭЛКОМ-ЛОГИСТИК"',
          client: 'Телков Вячеслав Алексеевич',
          total: 20156321.36,
          rest: 385962.21,
          date_create: '25.05.2021',
          date_delivery: '25.05.2021',
          chronology: '25.05.2021 — счёт выставлен',
        },
      ],
    },
  ];

  const requisitesList = [
    {
      data: [
        {
          id: 1,
          company: 'ООО "СИБЭЛКОМ-ЛОГИСТИК"',
          inn: '5406617971',
          account: '40702810504000002378',
          bank: 'Банк «Левобережный» (ПАО)',
          bik: '045004850',
          unallocated: '20 156 698,1235 RUB',
          available: '20 156 698,1235 RUB',
          contact: 'Телков Вячеслав Алексеевич',
        },
        {
          id: 2,
          company: 'ООО "СИБЭЛКОМ-ЛОГИСТИК"',
          inn: '5406617971',
          account: '40702810504000002378',
          bank: 'Банк «Левобережный» (ПАО)',
          bik: '045004850',
          unallocated: '20 156 698,1235 RUB',
          available: '20 156 698,1235 RUB',
          contact: 'Телков Вячеслав Алексеевич',
        },
        {
          id: 3,
          company: 'ООО "СИБЭЛКОМ-ЛОГИСТИК"',
          inn: '5406617971',
          account: '40702810504000002378',
          bank: 'Банк «Левобережный» (ПАО)',
          bik: '045004850',
          unallocated: '20 156 698,1235 RUB',
          available: '20 156 698,1235 RUB',
          contact: 'Телков Вячеслав Алексеевич',
        },
      ],
    },
  ];

  const logOut = () => {
    console.log('logOut');
    localStorage.removeItem('access_token');
    localStorage.removeItem('catpart-profile');
    history.push('/');
    setProfile({});
  };

  const needLogin = () => {
    console.log('needLogin', profile);

    logOut();
    createNotification('success', `Требуется авторизация`, ' ');
  };

  const createNotification = (type, title, text) => {
    console.log('createNotification', type, text);

    switch (type) {
      case 'info':
        break;
      case 'success':
        store.addNotification({
          title,
          message: text,
          type: 'default',
          insert: 'top',
          container: 'top-right',
          animationIn: ['animate__animated', 'animate__bounceInRight'],
          animationOut: ['animate__animated', 'animate__bounceOutRight'],
          dismiss: {
            duration: 2000,
            waitForAnimation: true,
            pauseOnHover: true,
            onScreen: false,
          },
        });
        break;
      case 'warning':
        break;
      case 'error':
        break;
    }
  };

  const updateCart = (id = null, count = 0, cur = {}, clear = false) => {
    console.log('updateCart', id, count);

    let store = localStorage.getItem('catpart');

    if (store) {
      store = JSON.parse(store);
    } else {
      store = [];
    }

    if (clear) {
      store = [];
    } else if (id) {
      const storeItem = store.find(f => f.id === id);

      if (count === 0) {
        if (storeItem) {
          createNotification('success', `Удален: ${storeItem.name}`, `Количество: ${storeItem.cart}`);

          if (typeof ym === 'function') {
            ym(81774553, 'reachGoal', 'removedfromcart');
          }

          store = [...store.filter(f => f.id !== id)];
        }
      } else if (storeItem) {
        if (storeItem.cart !== count) {
          storeItem.cart = count;
          storeItem.cur = cur;

          createNotification('success', `Обновлен: ${storeItem.name}`, `Количество: ${count}`);
        }
      } else {
        searchData.res.every(query => {
          const item = query.data.find(f => f.id === id);

          if (item) {
            createNotification('success', `Добавлен: ${item.name}`, `Количество: ${count}`);

            if (typeof ym === 'function') {
              ym(81774553, 'reachGoal', 'addtocart');
            }

            item.cart = count;
            item.cur = cur;
            store.push(item);

            return false;
          }

          return true;
        });
      }
    }

    localStorage.setItem('catpart', JSON.stringify(store));
    setCartCount(store.length);

    if (store.length) {
      setTotalCart(store.reduce((total, c) => total + c.cart * c.pricebreaks[findPriceIndex(c.pricebreaks, c.cart)].price, 0));
    } else if (window.location.pathname === '/order' && !clear) {
      history.push('/');
    }
  };

  const onSubmitSearchForm = evt => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();

    const form = evt.currentTarget;

    if (form) {
      const art = form.querySelector('#art-number');
      const quantity = form.querySelector('#quantity');

      console.log('onSubmitSearchForm', art.value);

      if (art.value.length) {
        const requestURL = '/search';
        setSearchResult(true);
        setFormBusy(true);

        setSearchData({});

        setSearchCount(quantity.value || 1);

        history.push(`/search/?art=${encodeURIComponent(art.value) || ''}&q=${encodeURIComponent(quantity.value || 1)}`);

        const options = {
          q: art.value,
          c: quantity.value || 1,
        };

        if (typeof ym === 'function') {
          ym(81774553, 'reachGoal', 'usedsearch');
        }

        apiGET(requestURL, options, data => {
          setFormBusy(false);
          setSearchData(data);
        });
      }
    }

    return false;
  };

  const appHeight = () => {
    const doc = document.documentElement;
    const sab = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sab')) || 0;
    doc.style.setProperty('--app-height', `${Math.max(700, window.innerHeight - sab)}px`);
  };

  const handleScroll = event => {
    setOpenMobMenu(false);

    // setPageY(event.target.scrollTop);
  };

  useEffect(() => {
    // preprod

    if (!showCabinet) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('catpart-profile');
      setProfile({});
    }

    // preprod

    updateLocationParams(window.location);

    const profileLS = localStorage.getItem('catpart-profile');

    if (profileLS) {
      if (validateJSON(profileLS)) {
        setProfile(JSON.parse(profileLS));
      } else {
        localStorage.removeItem('catpart-profile');
      }
    }

    const dropContainer = document.getElementById('app');

    document.body.addEventListener('scroll', handleScroll);

    window.addEventListener('resize', appHeight);

    appHeight();

    if ('ontouchstart' in document.documentElement) {
      document.body.style.cursor = 'pointer';
    }

    updateCart();

    dropContainer.ondragover = dropContainer.ondragenter = function(evt) {
      evt.preventDefault();
      setAppDrag(true);
    };

    dropContainer.ondragleave = function(evt) {
      evt.preventDefault();
      setAppDrag(false);
    };

    dropContainer.ondrop = function(evt) {
      evt.preventDefault();

      const fileInput = document.getElementById('file');

      setAppDrag(false);

      const dT = new DataTransfer();

      dT.items.add(evt.dataTransfer.files[0]);

      fileInput.files = dT.files;

      fileInput.dispatchEvent(new Event('change', { bubbles: true }));
    };

    return () => {
      document.body.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', appHeight);

      dropContainer.ondragover = null;

      dropContainer.ondragleave = null;

      dropContainer.ondrop = null;
    };
  }, []);

  const updateAsideContent = content => {
    if (content !== null) {
      setAsideContent(content);
    }
  };

  useEffect(() => {
    setAsideOpen(openProfile);
    updateAsideContent(openProfile ? <Profile notificationFunc={createNotification} logOut={logOut} profile={profile} setProfile={setProfile} /> : null);
  }, [openProfile]);

  useEffect(() => {
    setAsideOpen(openRequisites);

    updateAsideContent(openRequisites ? <ProfileRequisites notificationFunc={createNotification} requisitesId={openRequisites ? openRequisites.id : null} profile={profile} requisites={openRequisites} setProfileRequisites={setProfile} /> : null);
  }, [openRequisites]);

  useEffect(() => {
    setAsideOpen(openDetails && openDetails.id);

    updateAsideContent(openDetails ? <OrderDetails RUB={RUB} notificationFunc={createNotification} detailsId={openDetails ? openDetails.id : null} profile={profile} order={openDetails} setProfileRequisites={setProfile} /> : null);
  }, [openDetails]);

  useEffect(() => {
    if (!profile.hasOwnProperty('id')) {
      setOpenProfile(false);
    }
  }, [profile]);

  useEffect(() => {
    if (!asideOpen) {
      setOpenProfile(false);
      setOpenRequisites(0);
      setOpenDetails(0);
    }
  }, [asideOpen]);

  let showCabinet = ['localhost', 'html'].indexOf(location.hostname.split('.')[0]) > -1;

  return (
    <>
      <div className={`app-wrapper${appDrag ? ' __over' : ''}`}>
        <Header showCabinet={showCabinet} notificationFunc={createNotification} setProfile={setProfile} history={history} profile={profile} cartCount={cartCount} openMobMenu={openMobMenu} setOpenMobMenu={setOpenMobMenu} />

        <main className={`main${centeredForm ? ' __center' : ''}`}>
          <SearchForm setFormBusy={setFormBusy} history={history} setSearchData={setSearchData} setOpenMobMenu={setOpenMobMenu} busy={formBusy} onSubmitForm={onSubmitSearchForm} notificationFunc={createNotification} />

          <div className="main-content">
            {orderSent ? (
              <article className="article text-center __lg">
                <h1 className="article-title">Готово! Заказ отправлен!</h1>
                <p>Спасибо за заказ. В течение 5 минут счет будет на вашей почте.</p>
              </article>
            ) : (
              <Switch>
                <Route
                  exact
                  path="/"
                  component={() => (
                    <Helmet>
                      <title>Поиск электронных компонентов - CATPART.RU</title>
                      <meta name="description" content="Поиск электронных компонентов - CATPART.RU" />
                      <meta name="keywords" content="Поиск электронных компонентов - CATPART.RU" />
                      <link rel="canonical" href="https://catpart.ru/" />
                    </Helmet>
                  )}
                />

                <Route path="/about" render={routeProps => <FeaturePage updateCart={updateCart} notificationFunc={createNotification} setOrderSent={setOrderSent} totalCart={totalCart} currency={currency} setOpenMobMenu={setOpenMobMenu} {...routeProps} />} />

                <Route path="/delivery" render={routeProps => <DeliveryPage setOpenMobMenu={setOpenMobMenu} {...routeProps} />} />

                <Route
                  path="/orders"
                  render={routeProps => (
                    <OrdersPage
                      activeTab={0}
                      profile={profile}
                      needLogin={needLogin}
                      requisitesList={requisitesList}
                      ordersList={ordersList}
                      currency={currency}
                      setOpenProfile={setOpenProfile}
                      setOpenRequisites={setOpenRequisites}
                      setOpenDetails={setOpenDetails}
                      history={history}
                      setTableHeadFixed={setTableHeadFixed}
                      {...routeProps}
                    />
                  )}
                />

                <Route
                  path="/bankinformation"
                  render={routeProps => (
                    <OrdersPage
                      activeTab={1}
                      profile={profile}
                      needLogin={needLogin}
                      requisitesList={requisitesList}
                      ordersList={ordersList}
                      notificationFunc={createNotification}
                      currency={currency}
                      setOpenProfile={setOpenProfile}
                      setOpenRequisites={setOpenRequisites}
                      setOpenDetails={setOpenDetails}
                      history={history}
                      setTableHeadFixed={setTableHeadFixed}
                      {...routeProps}
                    />
                  )}
                />

                <Route path="/privacy-policy" render={routeProps => <PolicyPage setOpenMobMenu={setOpenMobMenu} {...routeProps} />} />

                <Route
                  path="/search"
                  render={routeProps => (
                    <FilterForm
                      history={history}
                      busy={formBusy}
                      currency={currency}
                      setCurrency={setCurrency}
                      RUB={RUB}
                      setTableHeadFixed={setTableHeadFixed}
                      setShowTableHeadFixed={setShowTableHeadFixed}
                      setOrderSent={setOrderSent}
                      totalCart={totalCart}
                      updateCart={updateCart}
                      notificationFunc={createNotification}
                      setOpenMobMenu={setOpenMobMenu}
                      searchData={searchData}
                      showResults={!formBusy}
                      cart={false}
                      props={{ ...routeProps }}
                    />
                  )}
                />

                <Route
                  path="/order"
                  render={routeProps => (
                    <FilterForm
                      history={history}
                      busy={formBusy}
                      currency={currency}
                      setCurrency={setCurrency}
                      RUB={RUB}
                      setShowTableHeadFixed={setShowTableHeadFixed}
                      setTableHeadFixed={setTableHeadFixed}
                      setOrderSent={setOrderSent}
                      totalCart={totalCart}
                      updateCart={updateCart}
                      notificationFunc={createNotification}
                      setOpenMobMenu={setOpenMobMenu}
                      showResults={!formBusy}
                      cart
                      props={{ ...routeProps }}
                    />
                  )}
                />

                <Route path="" render={routeProps => <NotFoundPage setOpenMobMenu={setOpenMobMenu} {...routeProps} />} />
              </Switch>
            )}
          </div>

          {tableHeadFixed}
        </main>
        <Footer />
      </div>

      <AsideContainer className={asideOpen ? ' __opened' : ''} setAsideOpen={setAsideOpen}>
        {asideContent}
      </AsideContainer>

      <ReactNotification />
    </>
  );
}
