import React, { useEffect, useState } from 'react';
import Ripples from 'react-ripples';

const CabinetTabs = props => {
  let { activeIndex, setActiveIndex, setOpenProfile } = props;

  return (
    <div className="form-filter">
      <div className={`form-filter__controls`}>
        <div className="form-filter__controls_left">
          <div className="form-filter__control">
            <Ripples
              onClick={
                activeIndex !== 0
                  ? () => {
                      setActiveIndex(0);
                      //history.push('/orders');
                    }
                  : null
              }
              className={'btn __gray' + (activeIndex === 0 ? ' active' : '')}
              during={1000}
            >
              <span className="btn-inner">
                <span>Список заказов</span>
              </span>
            </Ripples>
          </div>
          <div className="form-filter__control">
            <Ripples
              onClick={
                activeIndex !== 1
                  ? () => {
                      setActiveIndex(1);
                      //history.push('/requisites');
                    }
                  : null
              }
              className={'btn __gray' + (activeIndex === 1 ? ' active' : '')}
              during={1000}
            >
              <span className="btn-inner">
                <span>Реквизиты</span>
              </span>
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
