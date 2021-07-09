/**
 *
 * ToggleOption
 *
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

const FormSelect = ({ id, preSelectedValue, disabled, onChange, onBlur, inputRef, options, name, className, error, placeholder }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleChange = selectedOption => {
    setSelectedOption({ selectedOption });
    inputRef.current.value = selectedOption.value;
    onChange(name, { target: selectedOption });
  };

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
    }),
    control: () => ({
      // none of react-select's styles are passed to <Control />
      width: '100%',
    }),
    singleValue: (provided, state) => {
      const opacity = state.isDisabled ? 0.5 : 1;
      const transition = 'opacity 300ms';

      return { ...provided, opacity, transition };
    },
  };

  return (
    <div className={'custom-select form-control'}>
      <Select
        //
        styles={customStyles}
        classNamePrefix={'select'}
        //menuIsOpen={true}
        isMulti={false}
        isSearchable={false}
        isDisabled={disabled || null}
        placeholder={placeholder || null}
        defaultValue={options.find(o => o.selected)}
        className={'select ' + className + (error === null ? '' : error ? ' __error' : ' __success')}
        onChange={handleChange}
        options={options}
      />
    </div>
  );
};

FormSelect.propTypes = {
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
};

export default FormSelect;
