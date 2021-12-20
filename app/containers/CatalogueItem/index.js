/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 */

import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Swiper from "react-id-swiper";
import { Navigation, Manipulation } from "swiper";
import { Helmet } from "react-helmet";
import Breadcrumbs from "../../components/Breadcrumbs";
import apiGET from "../../utils/search";
import NoImage from "../../images/no-image.png";
import FormCheck from "../../components/FormCheck";
import innValidation from "../../utils/innValidation";
import { validateEmail } from "../../utils/validateEmail";
import checkEmailExist from "../../utils/checkEmailExist";

export default function CatalogueItem(props) {
  const { breadcrumbs, itemData } = props;

  const snippetCheckData = itemData && itemData.hasOwnProperty("snippet") && itemData.snippet.specs && itemData.snippet.specs.length ? itemData.snippet.specs.map(m => m.attribute.id) : [];
  const [snippetCheckValue, setSnippetCheckValue] = useState([]);

  const handleCheckAll = (target) => {
    console.log("handleCheckAll", target.target.value, snippetCheckData, target.target.value ? snippetCheckData : []);

    return setSnippetCheckValue(target.target.value ? snippetCheckData : []);
  };
  const handleChange = (value, target) => {
    let newVal = snippetCheckValue.slice(0);

    if (target.target.value) {
      newVal.push(value);
    } else {
      let index = snippetCheckValue.findIndex(f => f === value);
      console.log("index", index);
      newVal.splice(index, 1);
    }

    console.log("handleChange", value, newVal);

    return setSnippetCheckValue(newVal);
  };

  let title = itemData.hasOwnProperty("snippet") ? itemData.snippet.name || "" : "";

  const navigationPrevRef = useRef();
  const navigationNextRef = useRef();
  const slideData = {
    "manufacturer": "Microchip", "part_no": "SY54020RMG", "case_package": "-", "pins": "16", "circuits": "1"
  };

  let titles = ["Производитель", "Номер детали", "Case/Package", "Number of Pins", "Number of Circuits"];

  let slides = Array.from({ length: 10 }, (_, i) => slideData);

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
        setTimeout(() => {
          swiper.appendSlide([...Array(6)].map((m, mi) => `<div class="swiper-slide">` + slideBuilder(slideData, swiper.slides.length + mi + 1) + "</div>"));
        }, 1000);
      }
    }
  };

  const slideBuilder = (s, index) => {
    let ret = `<div class="catalogue-page__analogue-item">`;

    Object.keys(s).map((v, vi) => {
      ret += `<div class="catalogue-page__analogue-param ${(vi % 2 === 0 ? "__odd" : "__even")}">${v === "circuits" ? index : s[v]}</div>`;
    });

    return ret + "</div>";
  };

  const handleSpecChange = (field, e) => {
    console.log("handleSpecChange", field, e);
  };

  return (<>
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={title} />
      <meta name="keywords" content={title} />
      <link rel="canonical" href="https://catpart.ru/" />
    </Helmet>

    <Breadcrumbs bread={breadcrumbs} />

    <div className="row">
      <div itemScope itemType="http://schema.org/Product" className="column sm-col-12 xl-col-9">
        {itemData ? <article className="article __catalogue">
          <h1 itemProp="name" className="article-title">{itemData.snippet.name}</h1>

          <div className={"catalogue-page__item"}>
            <div className="catalogue-page__item-image">
              <img itemProp="image" src={itemData.image || NoImage} alt="" />
            </div>
            {itemData.snippet && itemData.snippet.hasOwnProperty("id") ?
              <dl className="catalogue-page__item-info">
                {itemData.snippet.manufacturer ? <div className={"description"}>
                  <dt><b>Производитель:</b></dt>
                  <dd>{itemData.snippet.manufacturer.name || ""}</dd>
                </div> : null}
                {itemData.snippet.sellers && itemData.snippet.sellers.length ?
                  <div itemProp="offers" itemScope itemType="http://schema.org/Offer" className={"description"}>
                    <dt><b>Поставщики:</b></dt>
                    <dd>{itemData.snippet.sellers.reduce((acc, el) => `${acc + ", " + ((el.company && el.company.name) ? el.company.name : "")}`, "").substring(2)}</dd>
                  </div> : null}
                {itemData.snippet.descriptions && itemData.snippet.descriptions.length ?
                  <div itemProp="description" className={"description"}>
                    <dt><b>Описание:</b></dt>
                    <dd>{itemData.snippet.descriptions.reduce((acc, el) => `${acc + "\n" + (el.text || "")}`, "").substring(1)}</dd>
                  </div> : null}
                <div className={"description"}>
                  <dt><b>Аналоги:</b></dt>
                  <dd></dd>
                </div>
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
                  <h2>Технические спецификации</h2>
                  <span className={"catalogue-page__specs--check"}>
                  <FormCheck
                    indeterminate={snippetCheckValue.length > 0 && snippetCheckValue.length < snippetCheckData.length}
                    checked={snippetCheckValue.length === snippetCheckData.length}
                    onChange={handleCheckAll.bind(this)}
                    // defaultChecked={false}
                    name={"0"}
                    value={"0"}
                    error={null}
                    label={snippetCheckValue.length === snippetCheckData.length ? "Убрать из фильтра" : "Добавить в фильтр"}
                    inputRef={null}
                  />
            </span>
                </div>

                {itemData.snippet.specs.map((s, si) => {
                  let id = `${si + 1}`;

                  return <div key={si}
                              className={"catalogue-page__analogue-param " + ((si % 2 === 0 ? "__odd" : "__even"))}>
                    <span>{s.hasOwnProperty("attribute") && (s.attribute.name || s.attribute.id || "")}</span>
                    <span>{s.display_value}</span>
                    <span className={"catalogue-page__specs--check"}>
                  <FormCheck
                    onChange={handleChange.bind(this, s.attribute.id)}
                    checked={snippetCheckValue.indexOf(s.attribute.id) > -1}
                    name={id}
                    value={s.attribute.id}
                    error={null}
                    label={snippetCheckValue.indexOf(s.attribute.id) > -1 ? "Убрать из фильтра" : "Добавить в фильтр"}
                    inputRef={null}
                  /></span>
                  </div>;
                })}
              </div>
            </article>

            <div className="text-center">
              <div className="btn __blue">Подобрать аналоги</div>
            </div>
          </>
          : null}

        <article className="article __catalogue">
          <h2>Аналоги</h2>
        </article>

        <div className="catalogue-page__analogue">
          <div ref={navigationPrevRef} className="btn __blue analogue-slider__button analogue-slider__button--prev" />
          <div ref={navigationNextRef} className="btn __blue analogue-slider__button analogue-slider__button--next" />
          <div className="catalogue-page__analogue-title">
            <div className="catalogue-page__analogue-item">
              {titles.map((t, ti) => {
                return <div key={ti} className="catalogue-page__analogue-param">{t}</div>;
              })}
            </div>
          </div>
          <div className="catalogue-page__analogue-slider">
            <Swiper {...swiperParams} navigation spaceBetween={10} onInit={(swiper) => {
              console.log("init", swiper);
              navigationPrevRef.current.onClick = () => {
                console.log("prev", swiper);
              };

              navigationNextRef.current.onClick = () => {
                console.log("next", swiper);
              };
            }}>
              {slides.map((s, si) => {
                return <div key={si} className={"swiper-slide"}
                            dangerouslySetInnerHTML={{ __html: slideBuilder(s, si + 1) }} />;
              })}
            </Swiper>
          </div>
        </div>
      </React.Fragment> : null}
  </>);
}
