/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 */

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Swiper from "react-id-swiper";
import qs from "qs";
import { Navigation, Manipulation } from "swiper";
import { Helmet } from "react-helmet";
import apiGET from "../../utils/search";
import NoImage from "../../images/no-image.png";
import FormCheck from "../../components/FormCheck";
import { uniqArray } from "../../utils/uniqArray";

export default function CatalogueItem(props) {
  const { itemData, history } = props;

  const snippetCheckData = itemData && itemData.hasOwnProperty("snippet") && itemData.snippet.specs && itemData.snippet.specs.length ? itemData.snippet.specs.map(m => m.attribute.id) : [];
  const [snippetCheckValue, setSnippetCheckValue] = useState([]);
  const [similarSlides, setSimilarSlides] = useState([]);
  const [analogSliderTitles, setAnalogSliderTitles] = useState([]);
  const [analogLink, setAnalogLink] = useState("");

  const handleCheckAll = (target) => {
    return setSnippetCheckValue(target.target.value ? snippetCheckData : []);
  };

  const handleChange = (value, target) => {
    let newVal = snippetCheckValue.slice(0);

    if (target.target.value) {
      newVal.push(value);
    } else {
      let index = snippetCheckValue.findIndex(f => f === value);
      newVal.splice(index, 1);
    }

    return setSnippetCheckValue(newVal);
  };

  let title = itemData.hasOwnProperty("snippet") ? itemData.snippet.name || "" : "";

  const navigationPrevRef = useRef();
  const navigationNextRef = useRef();

  useEffect(() => {
    const params = itemData.snippet.specs.filter(s => {
      return snippetCheckValue.indexOf(s.attribute.id) > -1 && s.display_value.length > 0;
    }).map(m => {
      return {
        id: m.attribute.id,
        v: [m.display_value]
      };
    });

    console.log("params", params, qs.parse(qs.stringify({ a: params })));

    if (params.length) {
      setAnalogLink("/catalog/?" + qs.stringify({ a: params }));
    }
  }, [snippetCheckValue]);

  useEffect(() => {
    if (itemData && itemData.hasOwnProperty("slug")) {
      const requestURL = `/catalog/${itemData.slug}/similar`;

      apiGET(requestURL, {}, data => {
        if (data && data.error) {
          console.log("similar error", data);
        } else {
          let titles = ["manufacturer", "part_no"];
          let slides = [];

          for (let i = 0; i < data.length; i++) {
            const datum = data[i];
            let slide = { part_no: datum.title, slug: datum.slug };

            if (datum.hasOwnProperty("snippet")) {
              slide.manufacturer = datum.snippet.manufacturer.name;

              if (datum.snippet.hasOwnProperty("specs")) {
                for (let j = 0; j < datum.snippet.specs.length; j++) {
                  const spec = datum.snippet.specs[j];

                  titles.push(spec.attribute.name);
                  slide[spec.attribute.name] = spec.display_value;
                }
              }
            }

            slides.push(slide);
          }

          setAnalogSliderTitles(uniqArray(titles));
          setSimilarSlides(slides);
        }
      });
    }
  }, [itemData]);

  const swiperParams = {
    modules: [Navigation, Manipulation], slidesPerView: 1, breakpoints: {
      // when window width is >= 480px
      600: {
        slidesPerView: 2
      }, 900: {
        slidesPerView: 4
      }, 1200: {
        slidesPerView: 6
      }
    }, navigation: {
      enabled: true
    }, on: {
      init: (swiper) => {
        swiper.params.navigation.prevEl = navigationPrevRef.current;
        swiper.params.navigation.nextEl = navigationNextRef.current;
        swiper.navigation.destroy();
        swiper.navigation.init();
        swiper.navigation.update();
      }, reachEnd: (swiper) => {
        console.log("reachEnd");
        // setTimeout(() => {
        //   swiper.appendSlide([...Array(6)].map((m, mi) => `<div class="swiper-slide">` + slideBuilder(slideData, swiper.slides.length + mi + 1) + "</div>"));
        // }, 1000);
      }
    }
  };

  const slideBuilder = (s, index) => {
    let ret = `<div class="catalogue-page__analogue-item">`;
    analogSliderTitles.forEach((v, vi) => {
      // const text = v === "part_no" ? <Link to={s.slug}>{s[v]}</Link> : s[v];

      ret += `<div class="catalogue-page__analogue-param ${(vi % 2 === 0 ? "__odd" : "__even")}"><span class="catalogue-page__analogue-value">${s[v] || ""}</span></div>`;
    });

    return ret + "</div>";
  };

  const similarItems = useMemo(() => {
    return similarSlides.length ?
      similarSlides.map((s, si) => {
        return <Link className={"catalogue__similar-link"} key={si} to={s.slug}>{s.part_no}</Link>;
      }) : null;
  }, [similarSlides]);

  console.log("similarSlides", similarSlides);

  // const similarSliderHTML = useMemo(() => {
  //   return similarSlides.length ?
  //     <Swiper {...swiperParams} navigation spaceBetween={10} onInit={(swiper) => {
  //       navigationPrevRef.current.onClick = () => {
  //         console.log("prev", swiper);
  //       };
  //
  //       navigationNextRef.current.onClick = () => {
  //         console.log("next", swiper);
  //       };
  //     }}>
  //       {similarSlides.map((s, si) => {
  //         return <div key={si} className={"swiper-slide"}
  //                     dangerouslySetInnerHTML={{ __html: slideBuilder(s, si + 1) }} />;
  //       })}
  //     </Swiper> : null
  //     ;
  // }, [similarSlides]);

  return (<>
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={title} />
      <meta name="keywords" content={title} />
      <link rel="canonical" href="https://catpart.ru/" />
    </Helmet>

    <div className="row">
      <div itemScope itemType="http://schema.org/Product" className="column sm-col-12 xl-col-9">
        {itemData ? <article className="article __catalogue">
          <h1 itemProp="name" className="article-title">{itemData.title}</h1>

          <div className={"catalogue-page__item"}>
            <div className="catalogue-page__item-image">
              <img itemProp="image" src={itemData.image || NoImage} alt="" />
            </div>
            {itemData.snippet && itemData.snippet.hasOwnProperty("id") ?
              <dl className="catalogue-page__item-info">
                {itemData.snippet.manufacturer ? <div className={"description __col-mode"}>
                  <dt><b>Производитель:</b></dt>
                  <dd>{itemData.snippet.manufacturer.name || ""}</dd>
                </div> : null}

                {itemData.snippet.best_datasheet ? <div className={"description __ds-mode"}>
                  <dt>>Datasheet:</dt>
                  <dd>
                    <a className="orders-chronology__link __red" href={itemData.snippet.best_datasheet}>pdf</a>
                  </dd>
                </div> : null}

                {itemData.snippet.sellers && itemData.snippet.sellers.length ?
                  <div itemProp="offers" itemScope itemType="http://schema.org/Offer" className={"description"}>
                    <dt><b>Поставщики:</b></dt>
                    <dd>{itemData.snippet.sellers.reduce((acc, el) => `${acc + ", " + ((el.company && el.company.name) ? el.company.name : "")}`, "").substring(2)}</dd>
                  </div> : null}
                {itemData.snippet.descriptions && itemData.snippet.descriptions.length ?
                  <div itemProp="description" className={"description"}>
                    <dt className={"hide"}><b>Описание:</b></dt>
                    <dd>{itemData.snippet.descriptions.reduce((acc, el) => `${acc + "\n" + (el.text || "")}`, "").substring(1)}</dd>
                  </div> : null}
                {/*<div className={"description"}>*/}
                {/*  <dt><b>Аналоги:</b></dt>*/}
                {/*  <dd></dd>*/}
                {/*</div>*/}
              </dl> : null}
          </div>
        </article> : null}
      </div>
    </div>
    {itemData && itemData.hasOwnProperty("snippet") ?
      <React.Fragment>
        {itemData.snippet.specs && itemData.snippet.specs.length ?
          <>
            <article className="article __catalogue">
              <div className={"catalogue-page__specs"}>
                <div className={"catalogue-page__analogue-param"}>
                  <p>Технические спецификации</p>
                  {/*<span className={"catalogue-page__specs--check"}>*/}
                  {/*    <FormCheck*/}
                  {/*      indeterminate={snippetCheckValue.length > 0 && snippetCheckValue.length < snippetCheckData.length}*/}
                  {/*      checked={snippetCheckValue.length === snippetCheckData.length}*/}
                  {/*      onChange={handleCheckAll.bind(this)}*/}
                  {/*      // defaultChecked={false}*/}
                  {/*      name={"0"}*/}
                  {/*      value={"0"}*/}
                  {/*      error={null}*/}
                  {/*      label={snippetCheckValue.length === snippetCheckData.length ? "Убрать из фильтра" : "Добавить в фильтр"}*/}
                  {/*      inputRef={null}*/}
                  {/*    />*/}
                  {/*</span>*/}
                </div>

                {itemData.snippet.specs.map((s, si) => {
                  return <div key={si}
                              className={"catalogue-page__analogue-param " + ((si % 2 === 0 ? "__odd" : "__even"))}>
                    <FormCheck
                      onChange={handleChange.bind(this, s.attribute.id)}
                      checked={snippetCheckValue.indexOf(s.attribute.id) > -1}
                      id={s.attribute.id}
                      name={s.attribute.id}
                      value={s.display_value}
                      error={null}
                      label={snippetCheckValue.indexOf(s.attribute.id) > -1 ? "Убрать из фильтра" : "Добавить в фильтр"}
                      inputRef={null}
                    />
                    <span>{s.hasOwnProperty("attribute") && (s.attribute.name || s.attribute.id || "")}</span>
                    <span>{s.display_value}</span>
                  </div>;
                })}
              </div>
            </article>

            <div className="text-center">
              {analogLink ? <Link to={analogLink} className="btn __blue">Подобрать аналоги</Link> :
                <span className="btn __blue">Подобрать аналоги</span>}
            </div>
          </>
          : null}

        {similarSlides.length ?
          <>
            <article className="article __catalogue">
              <p>Аналоги</p>

              <div className="catalogue__similar">
                {similarItems}
              </div>
            </article>

            {/*<div className="catalogue-page__analogue">*/}
            {/*  <div ref={navigationPrevRef}*/}
            {/*       className="btn __blue analogue-slider__button analogue-slider__button--prev" />*/}
            {/*  <div ref={navigationNextRef}*/}
            {/*       className="btn __blue analogue-slider__button analogue-slider__button--next" />*/}
            {/*  <div className="catalogue-page__analogue-title">*/}
            {/*    <div className="catalogue-page__analogue-item">*/}
            {/*      {analogSliderTitles.map((t, ti) => {*/}
            {/*        const text = t === "part_no" ? "Номер детали" : t === "manufacturer" ? "Производитель" : t;*/}
            {/*        return <div key={ti} className="catalogue-page__analogue-param">{text}</div>;*/}
            {/*      })}*/}
            {/*    </div>*/}
            {/*  </div>*/}
            {/*  <div className="catalogue-page__analogue-slider">*/}
            {/*    {similarSliderHTML}*/}
            {/*  </div>*/}
            {/*</div>*/}
          </> : null}
      </React.Fragment> : null}
  </>);
}
