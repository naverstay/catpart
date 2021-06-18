/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React, {useEffect, useState} from 'react';
import {Helmet} from 'react-helmet';
import {Switch, Route, useHistory} from 'react-router-dom';
import ReactNotification, {store} from 'react-notifications-component';
import SearchForm from 'containers/SearchForm/Loadable';
import FilterForm from 'containers/FilterForm/Loadable';
import FeaturePage from 'containers/FeaturePage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import Header from 'components/Header';
import Footer from 'components/Footer';
import Form from "../SearchForm/Form";
import {readFile} from "../../utils/fileReader";
import Input from "../SearchForm/Input";
import LoadingIndicator from "../../components/LoadingIndicator";

export default function App() {
  const history = useHistory();
  const [orderSent, setOrderSent] = useState(false);
  const [searchResult, setSearchResult] = useState(false);
  const [appDrag, setAppDrag] = useState(false);
  const [dragText, setDragText] = useState('');

  const [centeredForm, setCenteredForm] = useState(true);
  const [formBusy, setFormBusy] = useState(true);
  const [formDrag, setFormDrag] = useState(false);

  let formRef = React.createRef();
  let formArtNumber = React.createRef();
  let formQuantity = React.createRef();
  let formFile = React.createRef();

  let createNotification = (type, title, text) => {
    console.log('createNotification', type, text);

    switch (type) {
      case 'info':

        break;
      case 'success':
        store.addNotification({
          title: title,
          message: text,
          type: "default",
          insert: "top",
          container: "top-right",
          animationIn: ["animate__animated", "animate__bounceInRight"],
          animationOut: ["animate__animated", "animate__bounceOutRight"],
          dismiss: {
            duration: 2000,
            waitForAnimation: true,
            pauseOnHover: true,
            onScreen: false
          }
        });
        break;
      case 'warning':

        break;
      case 'error':

        break;
    }

  }

  let onSubmitSearchForm = evt => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();

    let form = evt.currentTarget;

    if (form) {
      let art = form.querySelector('#art-number');
      let quantity = form.querySelector('#quantity');

      setSearchResult(true);

      createNotification('success', 'Номер компонента: ' + art.value, 'Количество: ' + quantity.value);

      history.push("/search/?art=" + (art.value || '') + "&q=" + (quantity.value || 1));

    }

    console.log('onSubmitForm', evt);

    return false

    //setFormBusy(true);
    //
    //setTimeout(() => {
    //  setFormBusy(false);
    //}, 200)
  };

  let onFinish = values => {
    setFormBusy(true);

    setTimeout(() => {
      setFormBusy(false);
    }, 200)
  };

  let onReset = () => {
    formRef.current.resetFields();
  };

  let onFill = () => {
    formRef.current.setFieldsValue({
      note: 'Hello world!',
      gender: 'male'
    });
  };

  useEffect(() => {
    let dropContainer = document.getElementById('app');

    dropContainer.ondragover = dropContainer.ondragenter = function (evt) {
      evt.preventDefault();
      setAppDrag(true);
    };

    dropContainer.ondragleave = function (evt) {
      evt.preventDefault();
      setAppDrag(false);
    };

    dropContainer.ondrop = function (evt) {
      evt.preventDefault();

      let fileInput = document.getElementById('file');

      setAppDrag(false);

      const dT = new DataTransfer();

      dT.items.add(evt.dataTransfer.files[0]);

      fileInput.files = dT.files;

      fileInput.dispatchEvent(new Event('change', {bubbles: true}));
    };

  }, []);

  return (
    <>
      <div className={'app-wrapper' + (appDrag ? ' __over' : '')}>
        <Header/>

        <main className={'main' + (centeredForm ? ' __center_' : '')}>
          <div className="main-content">
            {orderSent ?
              <article className={'article text-center __lg'}>
                <h1 className={'article-title'}>Готово! Заказ отправлен!</h1>
                <p>Спасибо за заказ. В течение 5 минут счет будет на вашей почте.</p>
              </article>
              :
              <Switch>
                <Route exact path="/" component={() => <Helmet>
                  <title>Home Page</title>
                  <meta
                    name="description"
                    content="A catpart.ru application SearchForm"
                  />
                </Helmet>}/>
                <Route path="/about" component={FeaturePage}/>
                <Route path="/search" component={FilterForm}/>
                <Route path="" component={NotFoundPage}/>
              </Switch>
            }
          </div>

          <SearchForm onSubmitForm={onSubmitSearchForm} notificationFunc={createNotification}/>

        </main>
        <Footer/>
      </div>

      <ReactNotification/>
    </>
  );
}
