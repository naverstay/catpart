import React, { createRef, useEffect, useState } from 'react';
import Ripples from 'react-ripples';
import priceFormatter from '../../utils/priceFormatter';

import { setInputFilter } from '../../utils/inputFilter';
import { findPriceIndex } from '../../utils/findPriceIndex';
import FormInput from '../../components/FormInput';
import innValidation from '../../utils/innValidation';
import { validateEmail } from '../../utils/validateEmail';
import checkEmailExist from '../../utils/checkEmailExist';

const ElaborationRow = props => {
  let { rowIndex, updateRow, currency, row, notificationFunc } = props;

  const inputQuantityRef = createRef();

  const [justRedraw, setJustRedraw] = useState(0);
  const elaborationLabels = ['Наименование', 'Количество', 'Таргет, USD', 'Желаемая дата поставки'];
  const elaborationFields = ['name', 'quantity', 'price', 'delivery_period'];

  const [fields, setFields] = useState({
    'elaboration-name': '',
  });
  const [errors, setErrors] = useState({
    'elaboration-name': null,
  });

  const validate = () => {
    setErrors(errors);
    setJustRedraw(justRedraw + 1);
  };

  const handleChange = (field, e) => {
    window.log && console.log('handleChange', field, e);
    fields[field] = e.target.value;
    setFields(fields);

    console.log('row', row, rowIndex, fields, field);

    switch (field) {
      case 'elaboration-name':
        if (!e.target.value.length) {
          errors[field] = 'Не может быть пустым';
          validate();
        }
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    setInputFilter(inputQuantityRef.current, function(value) {
      return /^\d*$/.test(value); // Allow digits and '.' only, using a RegExp
    });

    return () => {
      inputQuantityRef.current = false;
    };
  }, []);

  return (
    <div className={`elaboration-table__row${rowIndex % 2 === 0 ? ' __odd' : ' __even'}`}>
      {elaborationFields.map((f, fi) => (
        <div key={fi} className={'elaboration-table__cell __' + f}>
          <label className="custom-input form-control">
            <FormInput
              onBlur={f === 'name' ? handleChange.bind(this, 'elaboration-name') : null}
              placeholder={elaborationLabels[fi]}
              defaultValue={String(row[f])}
              name={'elaboration-' + f}
              //
              error={f === 'name' ? errors['elaboration-name'] : null}
              className="__lg"
              inputRef={f === 'quantity' ? inputQuantityRef : null}
            />
          </label>
        </div>
      ))}
    </div>
  );
};

export default ElaborationRow;
