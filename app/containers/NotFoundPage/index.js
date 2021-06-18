/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';

import H1 from 'components/H1';
import messages from './messages';

export default function NotFound() {
  return (
    <article className="article text-center __lg">
      <h1 className="article-title">404!</h1>
      <p>Такой страницы нет. Воспользуйтесь навигацией или поиском.</p>
    </article>
  );
}
