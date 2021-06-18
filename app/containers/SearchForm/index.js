/*
 * SearchForm
 *
 */

import React, {useEffect, memo, useState} from 'react';
import PropTypes from 'prop-types';
import {Helmet} from 'react-helmet';
//import {FileDrop} from 'react-file-drop';
import {FormattedMessage} from 'react-intl';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {createStructuredSelector} from 'reselect';
import {readFile} from '../../utils/fileReader';

import {useInjectReducer} from 'utils/injectReducer';
import {useInjectSaga} from 'utils/injectSaga';
import {
  makeSelectRepos,
  makeSelectLoading,
  makeSelectError
} from 'containers/App/selectors';
import H2 from 'components/H2';
import ReposList from 'components/ReposList';
import AtPrefix from './AtPrefix';
import CenteredSection from './CenteredSection';
import Form from './Form';
import Input from './Input';
import Section from './Section';
import messages from './messages';
import {loadRepos} from '../App/actions';
import {changeUsername} from './actions';
import {makeSelectUsername} from './selectors';
import {setInputFilter} from '../../utils/inputFilter';
import reducer from './reducer';
import saga from './saga';

const key = 'home';

export function SearchForm({
                             dndFile,
                             notificationFunc,
                             onSubmitForm,
                             username,
                             loading,
                             error,
                             repos,
                             onChangeUsername
                           }) {
  useInjectReducer({key, reducer});
  useInjectSaga({key, saga});

  const [centeredForm, setCenteredForm] = useState(true);
  const [formBusy, setFormBusy] = useState(true);
  const [formDrag, setFormDrag] = useState(false);

  let formRef = React.createRef();
  let formArtNumber = React.createRef();
  let formQuantity = React.createRef();
  let formFile = React.createRef();

  let onSubmitSearchForm = (values) => {


  };

  useEffect(() => {
    setInputFilter(formQuantity.current, function (value) {
      return /^\d*\.?\d*$/.test(value); // Allow digits and '.' only, using a RegExp
    });
  }, [])

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

  const reposListProps = {
    loading,
    error,
    repos
  };

  return (
    <div className={'form-search'}>
      <form ref={formRef} className={'form-content'} onSubmit={onSubmitForm}>
        <div className="form-search__title">
          Поиск электронных <br/> компонентов
        </div>

        <div className="row">
          <div className="form-cell column sm-col-12 md-col-5 lg-col-4 xl-col-3">
            <label className={'form-label'} htmlFor="art-number">Номер компонента</label>
            <div className="form-control">
              <input ref={formArtNumber} id={'art-number'} type="text" className="input __lg"/>
            </div>
            <div className="form-tip">
              Например, <span className={'form-tip__example'} onClick={() => {
              formArtNumber.current.value = 'MAX34'
            }}>MAX34</span>
            </div>
          </div>

          <div className="form-cell column sm-col-12 md-col-3 lg-col-2">
            <label className={'form-label'} htmlFor="quantity">Количество</label>
            <div className="form-control">
              <input ref={formQuantity} id={'quantity'} type="text" className="input __lg"/>
            </div>
            <div className="form-tip">
                <span className={'form-tip__example'} onClick={() => {
                  formQuantity.current.value = '100'
                }}>100</span>
              <span className={'form-tip__example'} onClick={() => {
                formQuantity.current.value = '250'
              }}>250</span>
              <span className={'form-tip__example'} onClick={() => {
                formQuantity.current.value = '500'
              }}>500</span>
            </div>
          </div>

          <div className="form-cell form-cell__search column sm-col-12 md-col-4 lg-col-2">
            <span className={'form-label'}>&nbsp;</span>
            <div className="form-control">
              <button className="btn __blue __lg __w-100p">
                <span>Искать</span>
              </button>
            </div>
          </div>

          <div className="form-cell column form-cell__or sm-col-12 md-col-4 lg-col-2">
            <span className={'form-label'}>&nbsp;</span>
            <div data-or={'или'} className="form-control">
              <label className="btn __lg __gray-dash __w-100p">
                <span>Загрузить BOM</span>
                <input className={'hide'} ref={formFile} id="file" type="file" onChange={() => {
                  readFile(formFile.current.files[0], (ret) => {
                    console.log('readFile', ret);

                    if (ret.success) {

                    } else {

                    }

                  })
                }}/>
              </label>
            </div>
            <div className="form-tip">Выберите или перетащите сюда файл</div>
          </div>
        </div>

        <label style={{position: 'absolute'}} htmlFor="username">
          <Input
            id="username"
            type="text"
            placeholder="mxstbr"
            value={username}
            onChange={onChangeUsername}
          />
        </label>
      </form>
    </div>
  );
}

SearchForm.propTypes = {
  dndFile: PropTypes.string,
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  repos: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  notificationFunc: PropTypes.func,
  onSubmitForm: PropTypes.func,
  username: PropTypes.string,
  onChangeUsername: PropTypes.func
};

const mapStateToProps = createStructuredSelector({
  repos: makeSelectRepos(),
  username: makeSelectUsername(),
  loading: makeSelectLoading(),
  error: makeSelectError()
});

export function mapDispatchToProps(dispatch) {
  return {
    onChangeUsername: evt => dispatch(changeUsername(evt.target.value))
    //onSubmitForm: evt => {
    //  console.log('onSubmitForm');
    //  if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    //  dispatch(loadRepos());
    //}
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose(
  withConnect,
  memo
)(SearchForm);
