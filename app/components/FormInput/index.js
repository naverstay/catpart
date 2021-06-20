/**
 *
 * ToggleOption
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';

const FormInput = ({ value, onChange, placeholder, name, textarea, className, intl }) => {
  return (
    <div className={'custom-input form-control' + (textarea ? ' __ta' : '')}>
      {textarea ? (
        <textarea
          //
          onChange={onChange}
          name={name}
          placeholder={placeholder}
          className={'input ' + className}
          value={value}
        />
      ) : (
        <input
          //
          onChange={onChange}
          name={name}
          placeholder={placeholder}
          className={'input ' + className}
          value={value}
        />
      )}
    </div>
  );
};

FormInput.propTypes = {
  value: PropTypes.string,
  textarea: PropTypes.bool,
  onChange: PropTypes.func,
  className: PropTypes.string,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  intl: intlShape.isRequired,
};

export default injectIntl(FormInput);
