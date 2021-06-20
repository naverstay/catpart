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
import searchRequest from '../../utils/search';

export default function App() {
  const history = useHistory();

  const [searchData, setSearchData] = useState([]);
  const [openMobMenu, setOpenMobMenu] = useState(false);
  const [orderSent, setOrderSent] = useState(false);
  const [searchCount, setSearchCount] = useState(1);
  const [searchResult, setSearchResult] = useState(false);
  const [appDrag, setAppDrag] = useState(false);
  const [dragText, setDragText] = useState('');

  const [centeredForm, setCenteredForm] = useState(true);
  const [formBusy, setFormBusy] = useState(false);
  const [formDrag, setFormDrag] = useState(false);

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

  const onSubmitSearchForm = evt => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();

    const form = evt.currentTarget;

    if (form) {
      const art = form.querySelector('#art-number');
      const quantity = form.querySelector('#quantity');

      if (art.value.length) {
        const requestURL = `https://dev.catpart.ru/api/search`;
        setSearchResult(true);
        setFormBusy(true);

        createNotification('success', `Номер компонента: ${art.value}`, `Количество: ${quantity.value}`);

        setSearchCount(quantity.value || 1);

        history.push(`/search/?art=${art.value || ''}&q=${quantity.value || 1}`);

        let options = {
          q: art.value,
          c: quantity.value || 1,
        };

        console.log('options', options);

        searchRequest(requestURL, options, data => {
          setFormBusy(false);

          setSearchData(data);

          console.log('searchRequest', data);
        });
      }
    }

    console.log('onSubmitForm', evt);

    return false;
  };

  const appHeight = () => {
    const doc = document.documentElement;
    const sab = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sab')) || 0;
    doc.style.setProperty('--app-height', `${window.innerHeight - sab}px`);
  };

  useEffect(() => {
    const dropContainer = document.getElementById('app');

    window.addEventListener('resize', appHeight);
    appHeight();

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
  }, []);

  return (
    <>
      <div className={`app-wrapper${appDrag ? ' __over' : ''}`}>
        <Header openMobMenu={openMobMenu} setOpenMobMenu={setOpenMobMenu} />

        <main className={`main${centeredForm ? ' __center_' : ''}`}>
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
                <Route path="/search" render={routeProps => <FilterForm setOpenMobMenu={setOpenMobMenu} searchData={searchData} showResults cart={false} props={{ ...routeProps }} />} />
                <Route path="/cart" render={routeProps => <FilterForm setOpenMobMenu={setOpenMobMenu} showResults cart={true} props={{ ...routeProps }} />} />

                <Route path="" render={routeProps => <NotFoundPage setOpenMobMenu={setOpenMobMenu} {...routeProps} />} />
              </Switch>
            )}
          </div>

          <SearchForm setOpenMobMenu={setOpenMobMenu} busy={formBusy} onSubmitForm={onSubmitSearchForm} notificationFunc={createNotification} />
        </main>
        <Footer />
      </div>

      <ReactNotification />
    </>
  );
}
