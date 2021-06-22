/**
 *
 * ToggleOption
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';

const FormInput = ({ id, value, defaultValue, disabled, error, onChange, onBlur, inputRef, placeholder, name, textarea, className, intl }) => {
  return (
    <div className={'custom-input form-control' + (textarea ? ' __ta' : '')}>
      {textarea ? (
        <textarea
          //
          onChange={onChange || null}
          onBlur={onBlur || null}
          ref={inputRef || null}
          name={name || null}
          placeholder={placeholder || null}
          className={'input ' + className + (error === null ? '' : error ? ' __error' : ' __success')}
          defaultValue={defaultValue || null}
          disabled={disabled || null}
          value={value}
          id={value}
        />
      ) : (
        <input
          //
          onChange={onChange || null}
          onBlur={onBlur || null}
          ref={inputRef || null}
          name={name || null}
          placeholder={placeholder || null}
          className={'input ' + className + (error === null ? '' : error ? ' __error' : ' __success')}
          defaultValue={defaultValue || null}
          disabled={disabled || null}
          value={value}
          id={id}
        />
      )}
    </div>
  );
};

FormInput.propTypes = {
  id: PropTypes.string,
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  error: PropTypes.any,
  textarea: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  className: PropTypes.string,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  intl: intlShape.isRequired,
};

export default injectIntl(FormInput);
