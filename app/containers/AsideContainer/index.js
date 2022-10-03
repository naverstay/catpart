import React, { useEffect, useState } from 'react';
import Ripples from 'react-ripples';

const AsideContainer = props => {
  let { setAsideOpen, children, className } = props;

  return (
    <div className={'aside-holder ' + className}>
      <div
        className="aside-overlay"
        onClick={() => {
          setAsideOpen(false);
        }}
      />
      <div className="aside-container">
        <div className="aside-close" />
        <div
          onClick={() => {
            setAsideOpen(false);
          }}
          className="aside-close btn __blue"
        >
          <span />
          <span />
          <span />
        </div>
        <div className="aside-inner">{children}</div>
      </div>
    </div>
  );
};

export default AsideContainer;
