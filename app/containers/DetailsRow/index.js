import React, { createRef, useEffect, useState } from 'react';
import Ripples from 'react-ripples';
import priceFormatter from '../../utils/priceFormatter';

import { setInputFilter } from '../../utils/inputFilter';
import { findPriceIndex } from '../../utils/findPriceIndex';
import dateFormatter from '../../utils/dateFormatter';

const DetailsRow = props => {
  const { rowIndex, tableHeader, currency, row, notificationFunc } = props;

  window.log && console.log('DetailsRow', row);

  const buildChronology = row => (
  // let products = row.products.map((p, pi) => {
  //  return <li className={pi % 2 === 0 ? ' __odd' : ' __even'} />;
  // });

    (
      <div className="orders-chronology__scroller">
      {row.statuses && row.statuses.length ? (
        <ul className="orders-statuses__list">
          {row.statuses.map((c, ci) => (
            <li key={ci}>{c.name}</li>
          ))}
          {/* <li className="__odd">
            <span>25.05.2021 — отгружено 20%</span>
            <a className="orders-chronology__link __green" href="#">
              упд xlsx
            </a>
          </li>
          <li className="__even">
            <span>25.05.2021 — на складе 10%</span>
          </li>
          <li className="__odd">
            <span>07.06.2021 — товар заказан</span>
          </li>
          <li className="__even">
            <span>26.05.2021 — оплачено 30%</span>
          </li>
          <li className="__odd">
            <span>25.05.2021 — отгружено 20%</span>
            <a className="orders-chronology__link __green" href="#">
              упд xlsx
            </a>
          </li>
          <li className="__even">
            <span>25.05.2021 — на складе 10%</span>
          </li>
          <li className="__odd">
            <span>07.06.2021 — товар заказан</span>
          </li>
          <li className="__even">
            <span>26.05.2021 — оплачено 30%</span>
          </li>
          <li className="__odd">
            <span>07.06.2021 — товар заказан</span>
          </li>
          <li className="__even">
            <span>26.05.2021 — оплачено 30%</span>
          </li>
          <li className="__odd">
            <span>25.05.2021 — отгружено 20%</span>
            <a className="orders-chronology__link __green" href="#">
              упд xlsx
            </a>
          </li>
          <li className="__even">
            <span>25.05.2021 — на складе 10%</span>
          </li>
          <li className="__odd">
            <span>07.06.2021 — товар заказан</span>
          </li>
          <li className="__even">
            <span>26.05.2021 — оплачено 30%</span>
          </li>
          <li className="__odd">
            <span>25.05.2021 — счёт выставлен</span>
            <a className="orders-chronology__link __green" href="#">
              xlsx
            </a>
            <a className="orders-chronology__link __red" href="#">
              pdf
            </a>
          </li> */}
        </ul>
      ) : (
        '!chronology!'
      )}
    </div>
  );
  return (
    <div className={`details-results__row${rowIndex % 2 === 0 ? ' __odd' : ' __even'}`}>
      {Object.keys(tableHeader).map((cell, ci) => (
        <div key={ci} className={`details-results__cell __${cell}`}>
          {cell === 'name' ? null : <span className="details-results__label">{tableHeader[cell]}</span>}
          {cell === 'calculated_delivery_date' || cell === 'real_delivery_date' ? (
            <span className="details-results__value">{row[cell] ? dateFormatter(row[cell]) : '--.--.----'}</span>
          ) : cell === 'quantity' ? (
            <span className={`details-results__value${row[cell] === row.unloaded_count ? ' __completed' : ''}`}>
              <span>{`${row.unloaded_count || 0}\n из \n`}</span>
              <b>{row[cell]}</b>
            </span>
          ) : cell === 'price' ? (
            <span className="details-results__value">{priceFormatter(row[cell])}</span>
          ) : cell === 'sum' ? (
            <span className="details-results__value">{priceFormatter(row.quantity * row.price)}</span>
          ) : cell === 'statuses' ? (
            <span className="details-results__value">{row[cell] && row[cell].length ? buildChronology(row) : <span data-empty="statuses" />}</span>
          ) : (
            <span className="details-results__value">{row[cell] ? row[cell] : <span data-empty={cell} />}</span>
          )}
        </div>
      ))}
    </div>
  );
};
export default DetailsRow;
