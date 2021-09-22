/**
 *
 * ToggleOption
 *
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';

const FormCheck = ({ id, type, value, defaultValue, disabled, error, onChange, label, inputRef, defaultChecked, name, className }) => {
  const [checkState, setCheckState] = useState(defaultChecked || false);

  const checkUpdate = e => {
    setCheckState(e.target.checked);
    onChange({
      target: {
        value: e.target.checked,
      },
    });
  };

  return (
    <div className={`custom-input form-control`}>
      <label className={`form-check ${className || ''}${error === null ? '' : error ? ' __error' : ' __success'}`}>
        <input
          //
          type={type || 'checkbox'}
          value={value}
          id={id}
          onChange={e => {
            checkUpdate(e);
          }}
          ref={inputRef || null}
          name={name || null}
          disabled={disabled || null}
          defaultValue={defaultValue}
          defaultChecked={checkState}
        />
        <span className={'form-check__icon icon' + (checkState ? ' icon-check' : '')} />
        <span className={'form-check__text'}>{label || ''}</span>
      </label>
    </div>
  );
};

FormCheck.propTypes = {
  id: PropTypes.string,
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  error: PropTypes.any,
  defaultChecked: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  className: PropTypes.string,
  name: PropTypes.string,
};

export default FormCheck;
