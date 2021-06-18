/*
 * FilterForm
 *
 */

import React, { useEffect, memo, useState } from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
//import {FileDrop} from 'react-file-drop';
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { compose } from "redux";
import { createStructuredSelector } from "reselect";
import { readFile } from "../../utils/fileReader";

import { useInjectReducer } from "utils/injectReducer";
import { useInjectSaga } from "utils/injectSaga";
import {
  makeSelectRepos,
  makeSelectLoading,
  makeSelectError
} from "containers/App/selectors";
import H2 from "components/H2";
import ReposList from "components/ReposList";
import AtPrefix from "./AtPrefix";
import CenteredSection from "./CenteredSection";
import Form from "./Form";
import Input from "./Input";
import Section from "./Section";
import messages from "./messages";
import { loadRepos } from "../App/actions";
import { changeCurrency } from "./actions";
import { makeSelectCurrency } from "./selectors";
import reducer from "./reducer";
import saga from "./saga";
import Share from "../../components/Share";

const key = "home";

export function FilterForm({
                             notificationFunc,
                             currency,
                             loading,
                             error,
                             repos,
                             onChangeCurrency
                           }) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });

  //const [currency, setCurrency] = useState('RUR');
  const [centeredForm, setCenteredForm] = useState(true);
  const [formBusy, setFormBusy] = useState(true);
  const [formDrag, setFormDrag] = useState(false);

  let formRef = React.createRef();
  let formArtNumber = React.createRef();
  let formQuantity = React.createRef();
  let formFile = React.createRef();

  //let onSubmitForm = values => {
  //  setFormBusy(true);
  //
  //  setTimeout(() => {
  //    setFormBusy(false);
  //  }, 200)
  //};

  let onFinish = values => {
    setFormBusy(true);

    setTimeout(() => {
      setFormBusy(false);
    }, 200);
  };

  let onReset = () => {
    formRef.current.resetFields();
  };

  let onFill = () => {
    formRef.current.setFieldsValue({
      note: "Hello world!",
      gender: "male"
    });
  };

  const reposListProps = {
    loading,
    error,
    repos
  };

  let onChangeSwitch = (evt) => {
    console.log("onChangeSwitch", currency, evt.currentTarget);

    onChangeCurrency(evt.currentTarget);
  };


  return (
    <div className={"form-filter"}>
      <div className="form-filter__stat">По запросу «SMBJ40A» найдено 124 наименования.</div>

      <div className="form-filter__controls">
        <div className="form-filter__controls_left">
          <span className="btn __gray">
            <span className="btn __blue">
              <span className="btn-icon icon icon-download" />
            </span>
            <span>Скачать результат поиска</span></span>
          <span className="btn __gray">Поделиться</span>

          {/*<Share />*/}
        </div>

        <div className="form-filter__controls_right">
          <label className={"form-radio__btn"}>
            <input className={"hide"} checked={currency === "USD"} data-currency={"USD"}
                   onChange={onChangeSwitch} type="radio" value={"72.28"} />
            <span className="btn __gray"><b>USD</b><span>72.28</span></span>
          </label>
          <label className={"form-radio__btn"}>
            <input className={"hide"} checked={currency === "EUR"} data-currency={"EUR"}
                   onChange={onChangeSwitch} type="radio" value={"88.01"} />
            <span className="btn __gray"><b>EUR</b><span>88.01</span></span>
          </label>
          <label className={"form-radio__btn"}>
            <input className={"hide"} checked={currency === "RUB"} data-currency={"RUB"}
                   onChange={onChangeSwitch} type="radio" value={"1"} />
            <span className="btn __gray"><b>RUB</b></span>
          </label>

        </div>
      </div>
    </div>
  );
}

FilterForm.propTypes = {
  dndFile: PropTypes.string,
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  repos: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  notificationFunc: PropTypes.func,
  onSubmitForm: PropTypes.func,
  currency: PropTypes.string,
  onChangeCurrency: PropTypes.func
};

const mapStateToProps = createStructuredSelector({
  repos: makeSelectRepos(),
  currency: makeSelectCurrency(),
  loading: makeSelectLoading(),
  error: makeSelectError()
});

export function mapDispatchToProps(dispatch) {
  return {
    onChangeCurrency: input => dispatch(changeCurrency(input.value, input.dataset.currency))
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose(
  withConnect,
  memo
)(FilterForm);
