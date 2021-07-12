import React, { createRef, useEffect, useState } from 'react';
import Ripples from 'react-ripples';
import priceFormatter from '../../utils/priceFormatter';
import dateFormatter from '../../utils/dateFormatter';

const OrderRow = props => {
  const { rowIndex, tableHeader, rowClick, row, updateCart, notificationFunc } = props;

  const healthGradient = percent => {
    const start = Math.min(96, Math.max(0, percent - 2));

    return (
      <span
        style={{
          backgroundImage: `linear-gradient(to right, rgb(190, 243, 49) ${start}%, rgb(220, 247, 150) ${start + 4}%,  rgb(250, 250, 250) 100%)`,
        }}
        className="orders-health__bar"
      >
        <span>{percent}%</span>
      </span>
    );
  };

  const buildChronology = row => (
  // let products = row.products.map((p, pi) => {
  //  return <li className={pi % 2 === 0 ? ' __odd' : ' __even'} />;
  // });

    (
      <div className="orders-chronology__scroller">
      <ul className="orders-chronology__list">
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
        </li>
      </ul>
    </div>
  );
  const buildChronologyHealth = row => (
    <ul className="orders-health__list">
      <li>
        <span>Оплачено</span>
        {healthGradient(parseInt(100 * Math.random()))}
      </li>
      <li>
        <span>На складе</span>
        {healthGradient(parseInt(100 * Math.random()))}
      </li>
      <li>
        <span>Отгружено</span>
        {healthGradient(parseInt(100 * Math.random()))}
      </li>
    </ul>
  );

  return (
    <div
      onClick={() => {
        rowClick(row);
      }}
      className={`orders-results__row${rowIndex % 2 === 0 ? ' __odd' : ' __even'}`}
    >
      {Object.keys(tableHeader).map((cell, ci) => (
        <div key={ci} className={`orders-results__cell __${cell}`}>
          <span className="orders-results__label">{tableHeader[cell]}</span>
          {cell === 'chronology' ? (
            buildChronology(row)
          ) : cell === 'chronology_health' ? (
            buildChronologyHealth(row)
          ) : cell === 'created_at' || cell === 'delivery_date' ? (
            <span className="orders-results__value">{dateFormatter(new Date(row[cell]))}</span>
          ) : cell === 'payed' || cell === 'in_stock' ? (
            <span className="orders-results__value">{priceFormatter(row[cell])}</span>
          ) : (
            <span className="orders-results__value">{row[cell] ? row[cell] : `!${cell}!`}</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default OrderRow;
