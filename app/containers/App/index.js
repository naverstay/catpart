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
import Form from '../SearchForm/Form';
import { readFile } from '../../utils/fileReader';
import Input from '../SearchForm/Input';
import LoadingIndicator from '../../components/LoadingIndicator';
import apiGET from '../../utils/search';
import PolicyPage from '../PolicyPage';

export default function App() {
  const history = useHistory();

  const [searchData, setSearchData] = useState([]);
  const [openMobMenu, setOpenMobMenu] = useState(false);
  const [orderSent, setOrderSent] = useState(false);
  const [searchCount, setSearchCount] = useState(1);
  const [cartCount, setCartCount] = useState(0);
  const [searchResult, setSearchResult] = useState(false);
  const [appDrag, setAppDrag] = useState(false);
  const [dragText, setDragText] = useState('');

  const [centeredForm, setCenteredForm] = useState(true);
  const [formBusy, setFormBusy] = useState(false);
  const [formDrag, setFormDrag] = useState(false);

  history.listen(function(loc) {
    setCenteredForm(loc.pathname === '/');
  });

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

  const updateCart = (id = null, count = 0, cur = {}) => {
    console.log('updateCart', id, count);

    let store = localStorage.getItem('catpart');

    if (store) {
      store = JSON.parse(store);
    } else {
      store = [];
    }

    if (id) {
      let storeItem = store.find(f => f.id === id);

      if (count === 0) {
        if (storeItem) {
          createNotification('success', `Удален: ${storeItem.name}`, `Количество: ${storeItem.count}`);

          store = [...store.filter(f => f.id !== id)];
        }
      } else {
        let item = searchData.find(f => f.id === id);

        if (item) {
          createNotification('success', `Добавлен: ${item.name}`, `Количество: ${count}`);

          if (storeItem) {
            storeItem.cart = count;
            storeItem.cur = cur;
          } else {
            item.cart = count;
            item.cur = cur;
            store.push(item);
          }
        }
      }

      localStorage.setItem('catpart', JSON.stringify(store));
    }

    setCartCount(store.length);
  };

  const onSubmitSearchForm = evt => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();

    const form = evt.currentTarget;

    let tempData = [
      {
        manufacturer: 'Rochester (возможен старый DC)',
        name: 'SMBJ40AHE3/52 (DC:1851)',
        brand: 'Yangjie Electronic Technology',
        quantity: 705000,
        price_unit: 24000,
        moq: 24000,
        pack_quant: 24000,
        delivery_period: '3-4 недели',
        pricebreaks: [
          {
            price: 226.29,
            quant: 1,
            pureprice: 248.94,
          },
          {
            price: 203.64,
            quant: 8,
            pureprice: 226.29,
          },
          {
            price: 190.38,
            quant: 15,
            pureprice: 203.64,
          },
          {
            price: 183.06,
            quant: 29,
            pureprice: 190.38,
          },
          {
            price: 178.65,
            quant: 50,
            pureprice: 183.06,
          },
        ],
      },
      {
        manufacturer: 'Digi-Key Electronics',
        name: 'SMBJ40A-E3/52',
        brand: 'Yangjie Electronic Technology',
        quantity: 284,
        price_unit: 1,
        moq: 1,
        pack_quant: 1,
        delivery_period: '3-4 недели',
        pricebreaks: [
          {
            price: 175.43,
            quant: 1,
            pureprice: 182.35,
          },
          {
            price: 166.8,
            quant: 5,
            pureprice: 175.43,
          },
          {
            price: 159.99,
            quant: 10,
            pureprice: 166.8,
          },
          {
            price: 153.7,
            quant: 19,
            pureprice: 159.99,
          },
          {
            price: 147.39,
            quant: 37,
            pureprice: 153.7,
          },
        ],
      },
    ];

    tempData = tempData
      .concat(tempData)
      .concat(tempData)
      .concat(tempData)
      .concat(tempData)
      .concat(tempData)
      .concat(tempData)
      .concat(tempData)
      .concat(tempData);

    if (form) {
      const art = form.querySelector('#art-number');
      const quantity = form.querySelector('#quantity');

      if (art.value.length) {
        const requestURL = '/search';
        setSearchResult(true);
        setFormBusy(true);

        setSearchCount(quantity.value || 1);

        history.push(`/search/?art=${art.value || ''}&q=${quantity.value || 1}`);

        let options = {
          q: art.value,
          c: quantity.value || 1,
        };

        apiGET(requestURL, options, data => {
          setFormBusy(false);

          //setSearchData(data.length ? data : tempData);
          setSearchData(data);
        });
      }
    }

    return false;
  };

  const appHeight = () => {
    const doc = document.documentElement;
    const sab = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sab')) || 0;
    doc.style.setProperty('--app-height', `${window.innerHeight - sab}px`);
  };

  const handleScroll = event => {
    setOpenMobMenu(false);
  };

  useEffect(() => {
    setCenteredForm(window.location.pathname === '/');

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
    };
  }, []);

  return (
    <>
      <div className={`app-wrapper${appDrag ? ' __over' : ''}`}>
        <Header cartCount={cartCount} openMobMenu={openMobMenu} setOpenMobMenu={setOpenMobMenu} />

        <main className={`main${centeredForm ? ' __center' : ''}`}>
          <SearchForm setOpenMobMenu={setOpenMobMenu} busy={formBusy} onSubmitForm={onSubmitSearchForm} notificationFunc={createNotification} />

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
                      <title>Home Page</title>
                      <meta name="description" content="A catpart.ru application SearchForm" />
                    </Helmet>
                  )}
                />
                {/* <Route path="/about" component={FeaturePage} /> */}
                {/* <Route path="/search" component={FilterForm} /> */}
                <Route path="/about" render={routeProps => <FeaturePage setOpenMobMenu={setOpenMobMenu} {...routeProps} />} />
                <Route path="/policy" render={routeProps => <PolicyPage setOpenMobMenu={setOpenMobMenu} {...routeProps} />} />
                <Route path="/search" render={routeProps => <FilterForm updateCart={updateCart} notificationFunc={createNotification} setOpenMobMenu={setOpenMobMenu} searchData={searchData} showResults={!formBusy} cart={false} props={{ ...routeProps }} />} />
                <Route path="/cart" render={routeProps => <FilterForm updateCart={updateCart} notificationFunc={createNotification} setOpenMobMenu={setOpenMobMenu} showResults={!formBusy} cart={true} props={{ ...routeProps }} />} />

                <Route path="" render={routeProps => <NotFoundPage setOpenMobMenu={setOpenMobMenu} {...routeProps} />} />
              </Switch>
            )}
          </div>
        </main>
        <Footer />
      </div>

      <ReactNotification />
    </>
  );
}
