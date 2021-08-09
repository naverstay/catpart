/*
 * FeaturePage
 *
 * List all the features
 */
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { OrderForm } from '../OrderForm';
import apiGET from '../../utils/search';

export default function FeaturePage(props) {
  const [page, setPage] = useState(null);

  useEffect(() => {
    props.setOpenMobMenu(false);

    const requestURL = '/pages?url=' + props.match.path;

    apiGET(requestURL, {}, data => {
      console.log('apiGET', data);

      if (data.error) {
        setPage({ title: 'Ошибка', content: '' });
      } else {
        setPage(data);
      }
    });
  }, [props]);

  return page ? (
    <>
      <div className="row">
        <Helmet>
          <title>{page.title + ' - CATPART.RU'}</title>
          <meta name="description" content={page.title + ' - CATPART.RU'} />
          <meta name="keywords" content={page.title + ' - CATPART.RU'} />
          <link rel="canonical" href={'https://catpart.ru' + props.match.path + '/'} />
        </Helmet>

        <div className="column sm-col-12 xl-col-9">
          <article className="article">
            <h1 className="article-title">{page.title}</h1>

            <div dangerouslySetInnerHTML={{ __html: page.content }} />
          </article>
        </div>
      </div>
    </>
  ) : null;
}
