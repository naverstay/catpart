/*
 * SearchForm
 *
 */

import React, { useEffect, memo, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import Ripples from 'react-ripples';

import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import { makeSelectRepos, makeSelectLoading, makeSelectError } from 'containers/App/selectors';

import { readFile } from '../../utils/fileReader';

import { changeArtNumber } from './actions';
import { makeSelectArtNumber } from './selectors';
import { setInputFilter } from '../../utils/inputFilter';
import reducer from './reducer';
import saga from './saga';
import apiPOST from '../../utils/upload';
import FormInput from '../../components/FormInput';

const key = 'home';

export function SearchForm({ dndFile, notificationFunc, busy, setFormBusy, history, setSearchData, location, onSubmitForm, artNumber, loading, error, repos, onChangeUsername }) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });

  const formRef = React.createRef();
  const formArtNumber = React.createRef();
  const formQuantity = React.createRef();
  const formFile = React.createRef();

  const query = new URLSearchParams(useLocation().search);

  const [fields, setFields] = useState({
    quantity: '',
    'art-number': '',
  });
  const [justRedraw, setJustRedraw] = useState(0);
  const [errors, setErrors] = useState({
    quantity: null,
    'art-number': null,
  });
  const [validForm, setValidForm] = useState(false);

  let searchBtnText = useLocation().pathname === '/' ? 'Искать' : 'Продолжить искать';

  useEffect(() => {
    setInputFilter(formQuantity.current, function(value) {
      return !value.length || /^[1-9]\d*$/.test(value); // Allow digits and '.' only, using a RegExp
    });

    if (formArtNumber.current.value.length) {
      handleChange('art-number', { target: formArtNumber.current });
      onSubmitForm({ currentTarget: formRef.current });
    }

    return () => {
      formRef.current = false;
      formArtNumber.current = false;
      formQuantity.current = false;
      formFile.current = false;
    };
  }, []);

  const reposListProps = {
    loading,
    error,
    repos,
  };

  const handleSubmit = evt => {
    handleChange('art-number', { target: formArtNumber.current });

    onSubmitForm(evt);
  };

  const handleChange = (field, e) => {
    fields[field] = e.target.value;
    setFields(fields);

    switch (field) {
      case 'art-number':
      case 'quantity':
        errors[field] = e.target.value.length ? '' : 'Не может быть пустым';
        break;
    }

    setErrors(errors);

    setValidForm(errors['art-number'] !== null && !errors['art-number']);

    setJustRedraw(justRedraw + 1);
  };

  return (
    <div className="form-search">
      <form ref={formRef} className="form-content" onSubmit={handleSubmit}>
        <div className="form-search__title">
          Поиск электронных <br /> компонентов
        </div>

        <div className="row">
          <div className="form-cell column sm-col-12 md-col-5 lg-col-4 xl-col-3">
            <label className="form-label" htmlFor="art-number">
              Номер компонента
            </label>

            <FormInput
              onChange={handleChange.bind(this, 'art-number')}
              name="art-number"
              //
              disabled={busy}
              defaultValue={decodeURIComponent(query.get('art') || '')}
              className={'__lg' + (errors['art-number'] === null ? '' : errors['art-number'] ? ' __error' : '')}
              error={null}
              id="art-number"
              inputRef={formArtNumber}
            />

            <div className="form-tip">
              <span>Например, </span>
              <span
                className="form-tip__example"
                onClick={() => {
                  formArtNumber.current.value = 'MAX34';
                  handleChange('art-number', { target: formArtNumber.current });
                }}
              >
                MAX34
              </span>
            </div>
          </div>

          <div className="form-cell column sm-col-12 md-col-3 lg-col-2">
            <label className="form-label" htmlFor="quantity">
              Количество
            </label>

            <FormInput
              onChange={handleChange.bind(this, 'quantity')}
              onBlur={e => {
                if (!e.target.value.length) {
                  e.target.value = '1';
                  handleChange('quantity', e);
                }
              }}
              name="quantity"
              //
              disabled={busy}
              defaultValue={(decodeURIComponent(query.get('q')) || '1').replace(/\D/g, '')}
              className={'__lg' + (errors['quantity'] === null ? '' : errors['quantity'] ? ' __error' : '')}
              error={null}
              id="quantity"
              inputRef={formQuantity}
            />

            <div className="form-tip">
              <span
                className="form-tip__example"
                onClick={() => {
                  formQuantity.current.value = '100';
                  handleChange('quantity', { target: formQuantity.current });
                }}
              >
                100
              </span>
              <span
                className="form-tip__example"
                onClick={() => {
                  formQuantity.current.value = '250';
                  handleChange('quantity', { target: formQuantity.current });
                }}
              >
                250
              </span>
              <span
                className="form-tip__example"
                onClick={() => {
                  formQuantity.current.value = '500';
                  handleChange('quantity', { target: formQuantity.current });
                }}
              >
                500
              </span>
            </div>
          </div>

          <div className="form-cell form-cell__search column sm-col-12 md-col-4 lg-col-2">
            <span className="form-label">&nbsp;</span>
            <div className="form-control">
              <Ripples className={'__w-100p btn __blue __lg'} during={1000}>
                <button name={'search-submit'} className="btn-inner __abs">
                  <span>{searchBtnText}</span>
                </button>
              </Ripples>
            </div>
          </div>

          <div className="form-cell column form-cell__or sm-col-12 md-col-4 lg-col-2">
            <span className="form-label">&nbsp;</span>
            <div data-or="или" className="form-control">
              <Ripples className="__w-100p btn __lg __gray-dash" during={1000}>
                <label className="btn-inner __abs">
                  <span>Загрузить BOM</span>
                  <input
                    className="hide"
                    ref={formFile}
                    id="file"
                    type="file"
                    onChange={() => {
                      const requestURL = '/search/bom';
                      let file = formFile.current.files[0];

                      if (file && file.name.match(/\.([c|t]sv|txt|xls[x]?)$/)) {
                        let formData = new FormData();
                        let options = {};

                        setSearchData({});
                        setFormBusy(true);

                        formData.append('file', file);

                        history.push('/search');

                        apiPOST(requestURL, formData, options, data => {
                          if (data.error) {
                            setFormBusy(false);
                            notificationFunc('success', `Файл: ${file.name}`, 'ошибка обработки');
                          } else {
                            setFormBusy(false);
                            setSearchData(data);
                          }
                        });

                        notificationFunc('success', `Файл: ${file.name}`, 'отправлен');
                      } else {
                        notificationFunc('success', `Файл: ${file.name}`, 'не соответствует формату .txt, .csv, .tsv, .xls, . xlsx');
                      }

                      //readFile(formFile.current.files[0], ret => {
                      //  console.log('readFile', ret);
                      //
                      //  if (ret.success) {
                      //    notificationFunc('success', `Файл: ${ret.name}`, `Размер: ${ret.size}`);
                      //  } else {
                      //    notificationFunc('success', `Файл: ${ret.name}`, `Ошибка: ${ret.text}`);
                      //  }
                      //});
                    }}
                  />
                </label>
              </Ripples>
            </div>
            <div className="form-tip">Выберите или перетащите сюда файл</div>
          </div>
        </div>

        {/*<label style={{ position: 'absolute' }} htmlFor="artNumber">*/}
        {/*  <Input id="artNumber" type="text" placeholder="mxstbr" value={artNumber} onChange={onChangeUsername} />*/}
        {/*</label>*/}
      </form>
    </div>
  );
}

SearchForm.propTypes = {
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
)(SearchForm);
