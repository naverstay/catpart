/**
 *
 * Button.js
 *
 * A common button, if you pass it a prop "route" it'll render a link to a react-router route
 * otherwise it'll render a link with an onclick
 */

import React, {Children} from 'react';
import PropTypes from 'prop-types';

import A from './A';

import Wrapper from './Wrapper';

function Button(props) {
  // Render an anchor tag
  let button = (
    <a className={'btn'} href={props.href} onClick={props.onClick}>
      {Children.toArray(props.children)}
    </a>
  );

  // If the Button has a handleRoute prop, we want to render a button
  if (props.handleRoute) {
    button = (
      <Button className={'btn'} onClick={props.handleRoute}>
        {Children.toArray(props.children)}
      </Button>
    );
  }

  return {button};
}

Button.propTypes = {
  handleRoute: PropTypes.func,
  href: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired
};

export default Button;
