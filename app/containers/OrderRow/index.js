import React, { createRef, useEffect, useState } from 'react';
import Ripples from 'react-ripples';
import priceFormatter from '../../utils/priceFormatter';

const OrderRow = props => {
  let { rowIndex, tableHeader, rowClick, row, updateCart, notificationFunc } = props;

  return (
    <div
      onClick={() => {
        rowClick(row.id);
      }}
      className={`orders-results__row${rowIndex % 2 === 0 ? ' __odd' : ' __even'}`}
    >
      {Object.keys(tableHeader).map((cell, ci) => (
        <div key={ci} className={`orders-results__cell __${cell}`}>
          {cell === 'name' ? null : <span className="orders-results__label">{tableHeader[cell]}</span>}
          <span className="orders-results__value">{row[cell] ? row[cell] : `!${cell}!`}</span>
        </div>
      ))}
    </div>
  );
};

export default OrderRow;
