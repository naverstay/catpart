import React, { useEffect, useState } from 'react';
import Ripples from 'react-ripples';
import { Link } from 'react-router-dom';

const CabinetTabs = props => {
  let { activeIndex, setActiveIndex, setOpenProfile, history } = props;

  return (
    <div className="form-filter">
      <div className={`form-filter__controls`}>
        <div className="form-filter__controls_left">
          <div className="form-filter__control">
            <Ripples
              //onClick={
              //  activeIndex !== 0
              //    ? () => {
              //        setActiveIndex(0);
              //        //console.log('history', history);
              //        //history.push('/orders');
              //      }
              //    : null
              //}
              className={'btn __gray' + (activeIndex === 0 ? ' active' : '')}
              during={1000}
            >
              <Link to={'/orders'} className="btn-inner">
                <span>Список заказов</span>
              </Link>
            </Ripples>
          </div>
          <div className="form-filter__control">
            <Ripples
              //onClick={
              //  activeIndex !== 1
              //    ? () => {
              //        setActiveIndex(1);
              //        //history.push('/bankinformation');
              //      }
              //    : null
              //}
              className={'btn __gray' + (activeIndex === 1 ? ' active' : '')}
              during={1000}
            >
              <Link to={'/bankinformation'} className="btn-inner">
                <span>Реквизиты</span>
              </Link>
            </Ripples>
          </div>
          <div className="form-filter__control">
            <Ripples
              onClick={() => {
                setOpenProfile(true);
                //history.push('/requisites');
              }}
              className={'btn __gray'}
              during={1000}
            >
              <span className="btn-inner">
                <span>Профиль</span>
              </span>
            </Ripples>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CabinetTabs;
