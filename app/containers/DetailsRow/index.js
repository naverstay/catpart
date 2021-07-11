import React, { createRef, useEffect, useState } from 'react';
import Ripples from 'react-ripples';
import priceFormatter from '../../utils/priceFormatter';

import { setInputFilter } from '../../utils/inputFilter';
import { findPriceIndex } from '../../utils/findPriceIndex';
import dateFormatter from '../../utils/dateFormatter';

const DetailsRow = props => {
  let { rowIndex, tableHeader, currency, row, notificationFunc } = props;

  console.log('DetailsRow', row);

  return (
    <div className={`details-results__row${rowIndex % 2 === 0 ? ' __odd' : ' __even'}`}>
      {Object.keys(tableHeader).map((cell, ci) => (
        <div key={ci} className={`details-results__cell __${cell}`}>
          {cell === 'name' ? null : <span className="details-results__label">{tableHeader[cell]}</span>}
          {cell === 'calculated_delivery_date' || cell === 'real_delivery_date' ? (
            <span className="details-results__value">{row[cell] ? dateFormatter(new Date(row[cell])) : '--.--.----'}</span>
          ) : cell === 'quantity' ? (
            <span className={'details-results__value' + (row[cell] === row.unloaded_count ? ' __completed' : '')}>
              <span>{row[cell] + '\n из \n'}</span>
              <b>{row.unloaded_count}</b>
            </span>
          ) : cell === 'price' ? (
            <span className="details-results__value">{priceFormatter(row[cell])}</span>
          ) : cell === 'sum' ? (
            <span className="details-results__value">{priceFormatter(row.quantity * row.price)}</span>
          ) : cell === 'statuses' ? (
            <span className="details-results__value">{row[cell][0].name}</span>
          ) : (
            <span className="details-results__value">{row[cell] ? row[cell] : `!${cell}!`}</span>
          )}
        </div>
      ))}
    </div>
  );
};
export default DetailsRow;
