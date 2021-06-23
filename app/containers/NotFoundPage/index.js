/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 */

import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

import H1 from 'components/H1';
import { Helmet } from 'react-helmet';
// import messages from './messages';

export default function NotFound(props) {
  useEffect(() => {
    props.setOpenMobMenu(false);
  }, []);

  return (
    <>
      <Helmet>
        <title>404</title>
        <meta name="description" content="404" />
        <meta name="keywords" content="404" />
        <link rel="canonical" href="https://catpart.ru/" />
      </Helmet>

      <article className="article text-center __lg">
        <h1 className="article-title">404!</h1>
        <p>Такой страницы нет. Воспользуйтесь навигацией или поиском.</p>
      </article>
    </>
  );
}
