/*
 * FilterForm
 *
 */

import React, { useEffect, memo, useState } from 'react';
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

import { changeCurrency } from './actions';
import { makeSelectCurrency } from './selectors';
import reducer from './reducer';
import saga from './saga';
import Share from '../../components/Share';
import { SearchResults } from '../SearchResults';

const key = 'home';

export function FilterForm({ props, showResults, notificationFunc, currency, loading, error, onChangeCurrency }) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });

  const query = new URLSearchParams(props.location.search);

  // const [currency, setCurrency] = useState('RUR');
  const [centeredForm, setCenteredForm] = useState(true);
  const [formBusy, setFormBusy] = useState(true);
  const [formDrag, setFormDrag] = useState(false);

  const formRef = React.createRef();
  const formArtNumber = React.createRef();
  const formQuantity = React.createRef();
  const formFile = React.createRef();

  // let onSubmitForm = values => {
  //  setFormBusy(true);
  //
  //  setTimeout(() => {
  //    setFormBusy(false);
  //  }, 200)
  // };

  const onFinish = values => {
    setFormBusy(true);

    setTimeout(() => {
      setFormBusy(false);
    }, 200);
  };

  const onReset = () => {
    formRef.current.resetFields();
  };

  const onFill = () => {
    formRef.current.setFieldsValue({
      note: 'Hello world!',
      gender: 'male',
    });
  };

  const reposListProps = {
    loading,
    error,
  };

  const searchData = [
    {
      provider: 'Rochester (возможен старый DC)',
      item: 'SMBJ40AHE3/52 (DC:1851)',
      brand: 'Yangjie Electronic Technology',
      available: 705000,
      multiplicity: 24000,
      min: 24000,
      norm: 24000,
      term: '3-4 недели',
      price: {
        '1': 19.3,
        '10': 18.66,
        '25': 18.47,
        '100': 12.52,
        '250': 9.46,
        '4000': 9.27,
      },
    },
    {
      provider: 'Digi-Key Electronics',
      item: 'SMBJ40A-E3/52',
      brand: 'Yangjie Electronic Technology',
      available: 284,
      multiplicity: 1,
      min: 1,
      norm: 1,
      term: '3-4 недели',
      price: {
        '5': 49.67,
        '10': 37.09,
        '100': 23.07,
      },
    },
    {
      provider: 'Rochester (возможен старый DC)',
      item: 'SMBJ40AHE3/52 (DC:1851)',
      brand: 'Yangjie Electronic Technology',
      available: 705000,
      multiplicity: 24000,
      min: 24000,
      norm: 24000,
      term: '3-4 недели',
      price: {
        '1': 19.3,
        '10': 18.66,
        '25': 18.47,
        '100': 12.52,
        '250': 9.46,
        '4000': 9.27,
      },
    },
    {
      provider: 'Digi-Key Electronics',
      item: 'SMBJ40A-E3/52',
      brand: 'Yangjie Electronic Technology',
      available: 284,
      multiplicity: 1,
      min: 1,
      norm: 1,
      term: '3-4 недели',
      price: {
        '5': 49.67,
        '10': 37.09,
        '100': 23.07,
      },
    },
    {
      provider: 'Rochester (возможен старый DC)',
      item: 'SMBJ40AHE3/52 (DC:1851)',
      brand: 'Yangjie Electronic Technology',
      available: 705000,
      multiplicity: 24000,
      min: 24000,
      norm: 24000,
      term: '3-4 недели',
      price: {
        '1': 19.3,
        '10': 18.66,
        '25': 18.47,
        '100': 12.52,
        '250': 9.46,
        '4000': 9.27,
      },
    },
    {
      provider: 'Digi-Key Electronics',
      item: 'SMBJ40A-E3/52',
      brand: 'Yangjie Electronic Technology',
      available: 284,
      multiplicity: 1,
      min: 1,
      norm: 1,
      term: '3-4 недели',
      price: {
        '5': 49.67,
        '10': 37.09,
        '100': 23.07,
      },
    },
    {
      provider: 'Rochester (возможен старый DC)',
      item: 'SMBJ40AHE3/52 (DC:1851)',
      brand: 'Yangjie Electronic Technology',
      available: 705000,
      multiplicity: 24000,
      min: 24000,
      norm: 24000,
      term: '3-4 недели',
      price: {
        '1': 19.3,
        '10': 18.66,
        '25': 18.47,
        '100': 12.52,
        '250': 9.46,
        '4000': 9.27,
      },
    },
    {
      provider: 'Digi-Key Electronics',
      item: 'SMBJ40A-E3/52',
      brand: 'Yangjie Electronic Technology',
      available: 284,
      multiplicity: 1,
      min: 1,
      norm: 1,
      term: '3-4 недели',
      price: {
        '5': 49.67,
        '10': 37.09,
        '100': 23.07,
      },
    },
  ];

  const onChangeSwitch = evt => {
    console.log('onChangeSwitch', currency, evt.target);
    onChangeCurrency(evt.target);
  };

  useEffect(() => {
    console.log('props', props);
  });

  return (
    <>
      <div className="form-filter">
        {<div className="form-filter__stat">По запросу «{query.get('art') || ''}» найдено 124 наименования.</div>}

        <div className="form-filter__controls">
          <div className="form-filter__controls_left">
            <Ripples className="form-filter__control" during={1000}>
              <div className="btn __gray">
                <span className="btn __blue">
                  <span className="btn-icon icon icon-download" />
                </span>
                <span>Скачать результат поиска</span>
              </div>
            </Ripples>
            <Ripples className="form-filter__control" during={1000}>
              <div className="btn __gray">Поделиться</div>
            </Ripples>

            {/* <Share /> */}
          </div>

          <div onChange={onChangeSwitch} className="form-filter__controls_right">
            <Ripples className="form-filter__control" during={1000}>
              <label className="form-radio__btn">
                <input
                  name="currency"
                  className="hide"
                  // defaultChecked={currency === 'USD'}
                  data-currency="USD"
                  type="radio"
                  value="72.28"
                />
                <span className="btn __gray">
                  <b>USD</b>
                  <span>72.28</span>
                </span>
              </label>
            </Ripples>
            <Ripples className="form-filter__control" during={1000}>
              <label className="form-radio__btn">
                <input
                  name="currency"
                  className="hide"
                  // defaultChecked={currency === 'EUR'}
                  data-currency="EUR"
                  type="radio"
                  value="88.01"
                />
                <span className="btn __gray">
                  <b>EUR</b>
                  <span>88.01</span>
                </span>
              </label>
            </Ripples>
            <Ripples className="form-filter__control" during={1000}>
              <label className="form-radio__btn">
                <input name="currency" className="hide" defaultChecked data-currency="RUB" type="radio" value="1" />
                <span className="btn __gray">
                  <b>RUB</b>
                </span>
              </label>
            </Ripples>
          </div>
        </div>
      </div>

      {showResults && <SearchResults list={searchData} />}
    </>
  );
}

FilterForm.propTypes = {
  showResults: PropTypes.bool,
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  notificationFunc: PropTypes.func,
  onSubmitForm: PropTypes.func,
  currency: PropTypes.string,
  onChangeCurrency: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  currency: makeSelectCurrency(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
});

export function mapDispatchToProps(dispatch) {
  return {
    onChangeCurrency: (exchange, currency) => dispatch(changeCurrency(exchange, currency)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(FilterForm);
