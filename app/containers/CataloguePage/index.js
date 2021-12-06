/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 */

import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import Breadcrumbs from "../../components/Breadcrumbs";

export default function CataloguePage(props) {
  let title = "";
  let breadcrumbs = ["Электротехника"];

  let snippets = [
    "Лампы светодиодные",
    "Лампы для фонарей",
    "Лампы накаливания (миниатюрные)",
    "Лампы неоновые",
    "Индикаторные лампы с держателем",
    "Держатели (патроны) для ламп",
    "Лампы автомобильные светодиодные",
    "Лампы автомобильные ксеноновые",
    "Лампы автомобильные галогеновые/накаливания",
    "Лампы галогенные низковольтные без отражателя",
    "Лампы галогенные низковольтные с отражателем",
    "Лампы галогенные сетевого напряжения без отражателя",
    "Лампы галогенные сетевого напряжения с отражателем",
    "Лампы индикаторные и сигнальные",
    "Лампы люминесцентные",
    "Лампы люминесцентные компактные интегрированные",
    "Лампы люминесцентные компактные неинтегрированные",
    "Лампы металлогалогенные",
    "Лампы накаливания в форме свечи",
    "Лампы накаливания в форме шара",
    "Лампы накаливания зеркальная",
    "Лампы накаливания с отражателем",
    "Лампы накаливания стандартные",
    "Лампы натриевые высокого давления",
    "Лампы ртутные высокого давления",
    "Лампы ртутно-вольфрамовые дуговые",
    "Лампы с УФ-излучением"
  ];

  const snippetCount = Math.ceil(snippets.length / 4);

  function chunkArray(myArray, chunk_size) {
    let results = [];

    while (myArray.length) {
      results.push(myArray.splice(0, chunk_size));
    }

    return results;
  }

  try {
    title = props.props.match.params.id;
  } catch (e) {
    title = "Catalogue 404";
  }

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
        <meta name="keywords" content={title} />
        <link rel="canonical" href="https://catpart.ru/" />
      </Helmet>

      <Breadcrumbs bread={breadcrumbs} />

      <div className="row">
        <div className="column sm-col-12 xl-col-9">
          <article className="article __catalogue">
            <h1 className="article-title">Лампы</h1>
            <p>Лампы освещения – источники света различного осветительного оборудования и приборов, разделяющиеся на
              типы,
              и
              свойственные им характеристики. Одним из самых популярных, массовых в употреблении, качественных и
              надежных
              источников света, являются лампы накаливания. Характеризуются лампы формой, типом цоколя, мощностью и
              ценой,
              которая поныне доступна рядовому покупателю.
            </p>
            <p>Не так давно на смену, точнее, для сравнения с лампами накаливания, появились энергосберегающие лампы,
              почти
              втрое экономящие Ваши денежные ресурсы на оплату электроэнергии. Показательные характеристики
              энергосберегающих ламп отдельных компаний производителей отличаются по качеству, что влияет на их
              производительность. Хорошо зарекомендовали себя лампы фирмы Camelion, отличающиеся долгожительством,
              качеством
              внутреннего источника питания, что обусловлено редкими случаями их замены.</p>
          </article>
        </div>
      </div>

      <div className="catalogue-page__scroller">
        <div className="catalogue-page__snippet">
          {chunkArray(snippets, snippetCount).map((c, ci) => <div key={ci} className={"catalogue-page__snippet-col"}>
            {c.map((s, si) => <Link to={"/"} key={ci + "_" + si} className={"catalogue__list-link"}>{s}</Link>)}
          </div>)}
        </div>
      </div>

      <div className="catalogue-page__full">
        <div className="catalogue-page__scroller">
          <div className="catalogue-page__table">
5000
          </div>
        </div>
      </div>
    </>
  );
}
