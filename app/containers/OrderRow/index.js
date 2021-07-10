import React, { createRef, useEffect, useState } from 'react';
import Ripples from 'react-ripples';
import priceFormatter from '../../utils/priceFormatter';
import dateFormatter from '../../utils/dateFormatter';

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
          <span className="orders-results__label">{tableHeader[cell]}</span>
          {cell === 'created_at' || cell === 'updated_at' ? (
            <span className="orders-results__value">{dateFormatter(new Date(row[cell]))}</span>
          ) : cell === 'payed' || cell === 'in_stock' ? (
            <span className="orders-results__value">{priceFormatter(row[cell])}</span>
          ) : cell === 'requisites' ? (
            <span className="orders-results__value">{row[cell].company_name}</span>
          ) : (
            <span className="orders-results__value">{row[cell] ? row[cell] : `!${cell}!`}</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default OrderRow;
