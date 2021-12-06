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

export default function CatalogueItem(props) {
  const [itemData, setItemData] = useState(null);

  let title = "";
  let breadcrumbs = ["Электротехника", "Лампы"];
  const navigationPrevRef = useRef();
  const navigationNextRef = useRef();
  const slideData = {
    "manufacturer": "Microchip",
    "part_no": "SY54020RMG",
    "case_package": "-",
    "pins": "16",
    "circuits": "1"
  };

  try {
    title = props.props.match.path.replace("/", "");
  } catch (e) {

  }

  useEffect(() => {
    const requestURL = "/catalog/" + title;

    apiGET(requestURL, {}, data => {
      console.log("item", data);
      setItemData(data);
    });
  }, [title]);

  let titles = ["Производитель", "Номер детали", "Case/Package", "Number of Pins", "Number of Circuits"];

  let slides = Array.from({ length: 10 }, (_, i) => slideData);

  const swiperParams = {
    modules: [Navigation, Manipulation],
    slidesPerView: 1,
    breakpoints: {
      // when window width is >= 480px
      600: {
        slidesPerView: 2
      },
      900: {
        slidesPerView: 4
      },
      1200: {
        slidesPerView: 6
      }
    },
    navigation: {
      enabled: true
    },
    on: {
      init: (swiper) => {
        swiper.params.navigation.prevEl = navigationPrevRef.current;
        swiper.params.navigation.nextEl = navigationNextRef.current;
        swiper.navigation.destroy();
        swiper.navigation.init();
        swiper.navigation.update();
      },
      reachEnd: (swiper) => {
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
            <h1 className="article-title">{title}</h1>

            {itemData && <div className={"catalogue-page__item"}>
              <div className="catalogue-page__item-image">
                <img src={itemData.image || NoImage} alt="" />
              </div>
              <dl className="catalogue-page__item-info">
                <div className={"description"}>
                  <dt><b>Производитель:</b></dt>
                  <dd>{itemData.snippet.manufacturer.name || ""}</dd>
                </div>
                <div className={"description"}>
                  <dt><b>Поставщики:</b></dt>
                  <dd></dd>
                </div>
                {itemData.descriptions && itemData.descriptions.length && <div className={"description"}>
                  <dt><b>Описание:</b></dt>
                  <dd>{itemData.descriptions.map((d, di) => <p key={di}>{d}</p>)}</dd>
                </div>}
                <div className={"description"}>
                  <dt><b>Аналоги:</b></dt>
                  <dd></dd>
                </div>
              </dl>
            </div>}

          </article>
        </div>
      </div>

      <article className="article __catalogue">
        <h2>Технические спецификации</h2>

        <div className={"catalogue-page__specs"}>
          <div className="catalogue-page__analogue-param __odd">
            <span>Lifecycle Status</span>
          </div>
          <div className="catalogue-page__analogue-param __even">
            <span>Mount</span>
          </div>
        </div>

      </article>

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
    </>
  );
}
