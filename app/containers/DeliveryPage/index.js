/*
 * DeliveryPage
 *
 * List all the features
 */
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';

export default function DeliveryPage(props) {
  useEffect(() => {
    props.setOpenMobMenu(false);
  }, []);

  return (
    <div className="row">
      <Helmet>
        <title>Доставка - CATPART.RU</title>
        <meta name="description" content="Доставка - CATPART.RU" />
        <meta name="keywords" content="Доставка - CATPART.RU" />
        <link rel="canonical" href="https://catpart.ru/delivery/" />
      </Helmet>

      <div className="column sm-col-12 xl-col-9">
        <article className="article">
          <h1 className="article-title">Доставка</h1>

          <p>Работая с нами, возможны практически любые варианты доставки товара. Ниже приведен список вариантов, которые мы практикуем чаще всего. Если что-то из этого вам не подходит, мы можем осуществить доставку тем способом, который для вас предпочтительнее.</p>

          <p>Самовывоз товара со склада в Новосибирске.</p>

          <p>Наш склад находится по адресу: 630005, г.Новосибирск, ул.Достоевского, д.58, офис 104. Это первый этаж бизнес-центра “На Достоевского”. Рабочее время: с 09:00 до 18:00</p>

          <p>2. Доставка курьерской службой.</p>

          <p>Возможно пользоваться любой транспортной компанией. Чаще всего это: DHL, Fedex, UPS, КурьерСервисЭкспресс, Деловые линии и DPD.</p>
        </article>
      </div>
    </div>
  );
}
