/*
 * FilterForm
 *
 */

import React, { useEffect, memo, useState, useMemo } from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
// import {FileDrop} from 'react-file-drop';
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { compose } from "redux";
import { createStructuredSelector } from "reselect";
import Ripples from "react-ripples";

// import { useInjectReducer } from 'utils/injectReducer';
// import { useInjectSaga } from 'utils/injectSaga';
import { makeSelectRepos, makeSelectLoading, makeSelectError } from "containers/App/selectors";

import { useDetectClickOutside } from "react-detect-click-outside";
import { changeCurrency } from "./actions";
// import reducer from './reducer';
// import saga from './saga';
import Share from "../../components/Share";
import { SearchResults } from "../SearchResults";
import { CartResults } from "../CartResults";
import apiGET from "../../utils/search";
import { OrderForm } from "../OrderForm";
import priceFormatter from "../../utils/priceFormatter";
import { xlsDownload } from "../../utils/xlsDownload";
import { findPriceIndex } from "../../utils/findPriceIndex";
// import Skeleton from '../Skeleton';
import SkeletonWide from "../SkeletonWide";
import SkeletonDt from "../SkeletonDt";
import SkeletonTab from "../SkeletonTab";
import { smoothScrollTo } from "../../utils/smoothScrollTo";
import DeepElaboration from "../DeepElaboration";
import { getJsonData } from "../../utils/getJsonData";
import CatalogueItem from "../CatalogueItem";
import { Link } from "react-router-dom";
import CataloguePage from "../CataloguePage";
import { getButtonsMap } from "../../utils/getPaginationMap";
import { flatDeep } from "../../utils/flatDeep";

// const key = 'home';
const TRIGGER_DROPDOWN_LIMIT = 11;

export function FilterForm({
  props,
  someCategoryUrl,
  cart,
  profile,
  RUB,
  busy,
  setBusyOrder,
  currency,
  history,
  setOpenAuthPopup,
  setCurrency,
  currencyList,
  setCurrencyList,
  setOrderSent,
  setShowTableHeadFixed,
  setTableHeadFixed,
  showResults,
  totalCart,
  notificationFunc,
  updateCart,
  sendSearchRequest,
  setOpenMobMenu,
  searchData,
  loading,
  error,
  onChangeCurrency,
  setErrorPage,
  categoryItems,
  setCategoryItems,
  // nestedCategories,
  // setNestedCategories,
  // prevRequest,
  // setPrevRequest,
  onSubmitSearchForm
}) {
  // useInjectReducer({ key, reducer });
  // useInjectSaga({ key, saga });

  const query = new URLSearchParams(props.location.search);
  const [nestedCategories, setNestedCategories] = useState([]);
  const [categoryInfo, setCategoryInfo] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState([]);

  const [openPaginationDropdown, setOpenPaginationDropdown] = useState(false);

  const openPaginationRef = useDetectClickOutside({
    onTriggered: () => {
      setOpenPaginationDropdown(false);
    }
  });
  // const [responseData, setResponseData] = useState(null);
  const [prevRequest, setPrevRequest] = useState("");
  const [count, setCount] = useState(0);
  const [searchInfo, setSearchInfo] = useState("");
  const [categoryPage, setCategoryPage] = useState(false);

  const [totalData, setTotalData] = useState(-1);
  const [cartData, setCartData] = useState([]);
  const [scrollTriggers, setScrollTriggers] = useState([]);
  const [elaboration, setElaboration] = useState([]);
  const [openShare, setOpenShare] = useState(false);
  const [openMoreTriggers, setOpenMoreTriggers] = useState(false);
  const [catColumnsList, setCatColumnsList] = useState([]);
  const [catPage, setCatPage] = useState(1);

  const [catPageLimit, setCatPageLimit] = useState(10);
  const [noDataText, setNodataText] = useState("");
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [pagination, setPagination] = useState({ pages: 1 });
  const [itemData, setItemData] = useState(null);
  const [showCatPreloader, setShowCatPreloader] = useState(false);

  const plural = (n, str1, str2, str5) => `${n} ${n % 10 == 1 && n % 100 != 11 ? str1 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? str2 : str5}`;

  const moreTriggersRef = useDetectClickOutside({
    onTriggered: () => {
      setOpenMoreTriggers(false);
    }
  });

  useEffect(() => {
    setOpenMobMenu(false);

    const requestURL = "/currencies";

    apiGET(requestURL, {}, data => {
      setCurrencyList(
        Object.keys(data)
          .map(c => ({
            name: c,
            precision: 4,
            exChange: parseFloat(data[c])
          }))
          .concat(RUB)
      );
    });

    const store = localStorage.getItem("catpart");
    if (store) {
      setCartData([...getJsonData(store)]);
    }
  }, []);

  useEffect(() => {
    const user = localStorage.getItem("catpart-user");
    let userFields = {};

    if (user) {
      userFields = getJsonData(user);

      if (userFields.hasOwnProperty("currency")) {
        const userCurrency = currencyList.find(c => c.name === userFields.currency);
        if (userCurrency) {
          setCurrency(userCurrency);
        }
      }
    }
  }, [currencyList]);

  const scrollTriggerHandler = goto => {
    setOpenMoreTriggers(false);

    const target = document.querySelector(`.search-results__table .trigger-${goto}`);

    if (target) {
      smoothScrollTo(document.body, document.body.scrollTop, target.getBoundingClientRect().top - 50, 600);
    }
  };

  useEffect(() => {
    window.log && console.log("searchData", cart, !cart && searchData && searchData.hasOwnProperty("res"), searchData);

    if (!cart && searchData && searchData.hasOwnProperty("res")) {
      console.log(searchData.res.reduce((total, c) => total + (c.hasOwnProperty("data") ? c.data.length : 0), 0));
      setTotalData(searchData.res.reduce((total, c) => total + (c.hasOwnProperty("data") ? c.data.length : 0), 0));
    }

    if (searchData && searchData.hasOwnProperty("res") && searchData.res.length) {
      let searchQueries = (searchData.res.length > 1 ? "По запросам" : "По запросу") + searchData.res.reduce((total, c) => total + (c.hasOwnProperty("q") ? `«${c.q}», ` : ""), " ");

      window.log && console.log("searchQueries", searchQueries);

      setSearchInfo(searchQueries.replace(/, $/, "") + ` найдено ${plural(totalData, "наименование", "наименования", "наименований")}.`);
    }

    window.log && console.log("totalData", totalData);

    if (totalData === 0 && searchData && searchData.hasOwnProperty("res")) {
      let deep = searchData.res.map(item => {
        return {
          name: item.q,
          quantity: item.c
        };
      });

      setElaboration(deep);
    }

    if (searchData && searchData.bom && totalData) {
      setScrollTriggers(
        searchData.res.map((c, ci) =>
          ci >= TRIGGER_DROPDOWN_LIMIT ? (
            <Ripples
              key={ci}
              onClick={() => {
                scrollTriggerHandler(ci);
              }}
              className="dropdown-link"
              during={1000}
            >{c.q}</Ripples>
          ) : (
            <Ripples
              key={ci}
              onClick={() => {
                scrollTriggerHandler(ci);
              }}
              className="btn __gray"
              during={1000}
            >
              <span className="btn-inner">{c.q}</span>
            </Ripples>
          )
        )
      );
    } else {
      setScrollTriggers([]);
    }
  }, [
    searchData,
    totalData
  ]);

  const reposListProps = {
    loading,
    error
  };

  const onChangeSwitch = evt => {
    const user = localStorage.getItem("catpart-user");
    let userFields = { currency: evt.target.dataset.currency };

    if (user) {
      userFields = getJsonData(user);
      userFields.currency = evt.target.dataset.currency;
    }

    localStorage.setItem("catpart-user", JSON.stringify(userFields));

    // console.log('onChangeSwitch', currency, evt.target);
    // onChangeCurrency(evt.target.value, evt.target.dataset.currency);
    setCurrency({
      exChange: parseFloat(evt.target.value),
      name: evt.target.dataset.currency,
      precision: evt.target.dataset.currency === "RUB" ? 2 : 4
    });
  };

  const getCategoryList = (category) => {
    setNodataText("");
    const requestURL = "/catalog/" + category;

    let options = {
      page: catPage,
      limit: catPageLimit,
      attributes: categoryFilter.filter(f => f.id !== "manufacturer").map(m => {
        return {
          id: m.id,
          values: m.values
        };
      })
      // attributes: (categoryFilter.reduce((acc, m) => {
      //   let ret = [];
      //
      //   for (let i = 0; i < m.value.length; i++) {
      //     ret.push({
      //       id: m.id,
      //       value: m.value[i]
      //     });
      //   }
      //
      //   return acc.concat(ret);
      // }, []))
    };

    let manufacturer = categoryFilter.find(f => f.id === "manufacturer");

    if (manufacturer) {
      options.manufacturer = manufacturer.values[0];
    }

    console.log("getCategoryList", options, categoryFilter);

    if (prevRequest !== requestURL + JSON.stringify(options)) {
      setPrevRequest(requestURL + JSON.stringify(options));

      // setCategoryPage(false);
      setItemData(null);

      apiGET(requestURL, options, data => {
        if (data.error) {
          console.log("NO DATA", requestURL, data.error);

          setErrorPage(true);
        } else {
          setErrorPage(false);

          let catColumnNames = [];

          if (data.hasOwnProperty("product")) {
            setCategoryPage(false);
            setItemData(data.product);
            sendSearchRequest({
              q: props.match.url.replace(/\//g, ""),
              c: 1
            });
          } else if (data.hasOwnProperty("items")) {
            setCategoryPage(true);
            setItemData(null);
            // setItemSlugLinks(itemSlugLinks.concat(responseData.items.map(d => d.slug)).concat(responseData.hasOwnProperty("breadcrumbs") ? responseData.breadcrumbs : []));

            if (data.items.length) {
              setCategoryItems(data.items.map((d, di) => {
                let params = {};

                if (d.snippet.specs && d.snippet.specs.length) {
                  d.snippet.specs.forEach((s, si) => {
                    catColumnNames.push({
                      attributeId: s.attribute.id,
                      accessor: s.attribute.name
                    });
                    params[s.attribute.name] = s.display_value;
                  });
                }

                return {
                  catImage: d.image || "",
                  catPartLink: d.slug || "",
                  catPartNum: d.title || "!title!",
                  catManufacturer: d.snippet.manufacturer.name || "!manufacturer!",
                  ...params
                };
              }));
            } else {
              setCategoryItems([]);
              setNodataText(`Нет данных ${props.match.url} страница ${catPage} лимит ${catPageLimit}`);
            }

            setCatColumnsList(catColumnNames);
          } else {
            setNodataText(`Что-то пошло не так и не туда ${props.match.url} страница ${catPage} лимит ${catPageLimit}`);
          }

          if (data.hasOwnProperty("category")) {
            setCategoryInfo(data.category);
          }

          if (data.hasOwnProperty("breadcrumbs")) {
            setBreadcrumbs(data.breadcrumbs);
          }

          if (data.hasOwnProperty("breadcrumbs")) {
            setBreadcrumbs(data.breadcrumbs);
          }

          if (data.hasOwnProperty("pagination") && data.pagination.pages) {
            setPagination(data.pagination);
          }

          if (data.hasOwnProperty("nestedCategories") && data.nestedCategories.length) {
            setNestedCategories(data.nestedCategories.slice(0));
          } else {
            setNestedCategories([]);
          }
        }

        setShowCatPreloader(false);
      });
    } else {
      setShowCatPreloader(false);
    }
  };

  useEffect(() => {
    if (someCategoryUrl) {
      setShowCatPreloader(true);
      setItemData(null);
      setCategoryPage(true);
      getCategoryList(props.match.url.replace(/\//g, ""));
    } else {
      setShowCatPreloader(false);
      setItemData(null);
      setErrorPage(false);
      setCategoryPage(false);
    }
  }, [catPage, catPageLimit, props.match.url, categoryFilter]);

  const removeFilter = (param, index) => {
    setCategoryFilter(categoryFilter.reduce((acc, f, fi) => {
      if (fi === param) {
        if (f.values.length > 1) {
          f.values.splice(index, 1);
          return acc.concat(f);
        } else {
          return acc;
        }
      } else {
        return acc.concat(f);
      }
    }, []));
  };

  const filterItemsHTML = useMemo(() => {
    let ret = null;

    if (categoryFilter.length) {
      ret = categoryFilter.map((f, fi) => {
        return <li key={fi}>
          <span className={"catalogue-page__filter-item"}>{f.name}</span>
          {f.values.map((m, mi) => <span key={mi} className={"catalogue-page__filter-item"}>
            <span>{m}</span>
             <span className={"filter-remove-btn btn __gray"} onClick={() => {
               removeFilter(fi, mi);
             }}>
              <span className={"icon icon-close"} />
            </span>
          </span>)}
        </li>;
      });
    }

    return ret;
  }, [props.match.url, categoryFilter]);

  useEffect(() => {
    setCatPage(1);
  }, [props.match.url, catPageLimit, categoryFilter]);

  const paginationHTML = useMemo(() => {
    let pages = getButtonsMap(pagination.pages, catPage);

    return pagination.pages ? pages.map((p, pi) => {
      return <li key={pi} className={"catalogue-page__pagination-item"}>
        <Ripples
          onClick={p.isMore ? null : () => {
            setCatPage(parseInt(p.text));
          }}
          className={"btn " + (parseInt(p.text) === catPage ? "__blue" : "__gray")}
          during={1000}
        >
          <span className="btn-inner">{p.text}</span>
        </Ripples>
      </li>;
    }) : null;
  }, [pagination, catPage]);

  return (
    <>
      <div id="rtCellSizer" />
      {cart ? (
        <Helmet>
          <title>Оформление заказа - CATPART.RU</title>
          <meta name="description" content="Оформление заказа - CATPART.RU" />
          <meta name="keywords" content="Оформление заказа - CATPART.RU" />
          <link rel="canonical" href="https://catpart.ru/order/" />
        </Helmet>
      ) : props.match.path === "/search" ? (
        <Helmet>
          <title>{searchInfo}</title>
          <meta name="description" content={searchInfo} />
          <meta name="keywords" content={searchInfo} />
          <link rel="canonical" href="https://catpart.ru/" />
        </Helmet>
      ) : null}


      {/* todo search and any category/product page */}
      {!cart && someCategoryUrl ? <>
          {itemData ? <CatalogueItem
            profile={profile}
            history={history}
            itemData={itemData}
            breadcrumbs={breadcrumbs}
            // busy={formBusy}
            setBusyOrder={setBusyOrder}
            currency={currency}
            setCurrency={setCurrency}
            currencyList={currencyList}
            setCurrencyList={setCurrencyList}
            RUB={RUB}
            setShowTableHeadFixed={setShowTableHeadFixed}
            setTableHeadFixed={setTableHeadFixed}
            setOpenAuthPopup={setOpenAuthPopup}
            setOrderSent={setOrderSent}
            totalCart={totalCart}
            updateCart={updateCart}
            setOpenMobMenu={setOpenMobMenu}
            props={{ ...props }}
          /> : categoryPage ?
            <>
              {showCatPreloader ? <span>Skeleton here</span> : <>
                <CataloguePage
                  filterItemsHTML={filterItemsHTML}
                  categoryItems={categoryItems}
                  catPage={catPage}
                  setCatPage={setCatPage}
                  breadcrumbs={breadcrumbs}
                  catColumnsList={catColumnsList}
                  noDataText={noDataText}
                  nestedCategories={nestedCategories.slice(0)}
                  categoryInfo={categoryInfo}
                  profile={profile}
                  history={history}
                  // busy={formBusy}
                  categoryFilter={categoryFilter}
                  setCategoryFilter={setCategoryFilter}
                  setBusyOrder={setBusyOrder}
                  currency={currency}
                  setCurrency={setCurrency}
                  currencyList={currencyList}
                  setCurrencyList={setCurrencyList}
                  RUB={RUB}
                  setShowTableHeadFixed={setShowTableHeadFixed}
                  setTableHeadFixed={setTableHeadFixed}
                  setOpenAuthPopup={setOpenAuthPopup}
                  setOrderSent={setOrderSent}
                  totalCart={totalCart}
                  updateCart={updateCart}
                  // notificationFunc={createNotification}
                  // setOpenCatalogue={setOpenCatalogue}
                  // setOpenMobMenu={setOpenMobMenu}
                  {...props}
                />

                {noDataText ? <div className="catalogue-page__nodata">
                  {noDataText}
                </div> : null}

                {categoryItems.length ? <div className="catalogue-page__pagination">
                  <ul className={"catalogue-page__pagination-list"}>
                    <li className={"catalogue-page__pagination-item"}>
                      <div ref={openPaginationRef} className="dropdown-holder">
                        <Ripples
                          onClick={() => {
                            setOpenPaginationDropdown(!openPaginationDropdown);
                          }}
                          className={"btn __gray" + (openPaginationDropdown ? " __opened" : "")}
                          during={1000}
                        >
                      <span className="btn-inner">
                        <span>{catPageLimit}</span>
                        <span className={"icon icon-chevron-up"} />
                      </span>
                        </Ripples>
                        {openPaginationDropdown && (
                          <div className="dropdown-container">
                            <ul className="dropdown-list">
                              {[1, 2, 3, 10, 20, 50, 100].map((t, ti) => (
                                <li key={ti}><Ripples
                                  onClick={() => {
                                    setOpenPaginationDropdown(false);
                                    setCatPageLimit(t);
                                  }}
                                  className="dropdown-link"
                                  during={1000}
                                >{t}</Ripples></li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </li>
                  </ul>
                  {paginationHTML ? <ul className={"catalogue-page__pagination-list"}>
                    {paginationHTML}
                  </ul> : null}
                  <ul className={"catalogue-page__pagination-list"}>
                    <li className={"catalogue-page__pagination-item"}>
                      <Ripples
                        onClick={() => {
                          setCatPage(Math.max(1, catPage - 1));
                        }}
                        className={"btn __gray" + (catPage === 1 ? " __disabled" : "")}
                        during={1000}
                      >
                        <span className="btn-inner">Пред.</span>
                      </Ripples>
                    </li>
                    <li className={"catalogue-page__pagination-item"}>
                      <Ripples
                        onClick={() => {
                          setCatPage((catPage + (catPage < pagination.pages ? 1 : 0)));
                        }}
                        className={"btn __gray" + (catPage === pagination.pages ? " __disabled" : "")}
                        during={1000}
                      >
                        <span className="btn-inner">След.</span>
                      </Ripples>
                    </li>
                  </ul>
                </div> : null}
              </>}
            </> : null}
        </>
        : null}

      {!cart && busy ? (
        <div className="skeleton-holder">
          <div className="skeleton skeleton-mob">
            <SkeletonWide />
          </div>
          <div className="skeleton skeleton-tab">
            <SkeletonTab />
          </div>
          <div className="skeleton skeleton-dt">
            <SkeletonDt />
          </div>
          <div className="skeleton skeleton-wide">
            <SkeletonWide />
          </div>
        </div>
      ) : null}

      <div className="form-filter">
        {!cart &&
          (scrollTriggers.length ? (
            <div className="form-filter__controls __wide">
              {scrollTriggers.slice(0, TRIGGER_DROPDOWN_LIMIT).map((t, ti) => (
                <div key={ti} className="form-filter__control">
                  {t}
                </div>
              ))}
              {scrollTriggers.length > TRIGGER_DROPDOWN_LIMIT && (
                <div ref={moreTriggersRef} className="form-filter__control">
                  <Ripples
                    onClick={() => {
                      setOpenMoreTriggers(!openMoreTriggers);
                    }}
                    className="btn __gray"
                    during={1000}
                  >
                    <span className="btn-inner">Перейти к</span>
                  </Ripples>
                  {openMoreTriggers && (
                    <div className="dropdown-container">
                      <ul className="dropdown-list">
                        {scrollTriggers.slice(TRIGGER_DROPDOWN_LIMIT).map((t, ti) => (
                          <li key={ti}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : null)}

        {!cart && showResults && !categoryPage ? <h1 className="form-filter__stat">{searchInfo}</h1> :
          <div className="form-filter__stat">&nbsp;</div>}

        {busy ? null : (
          <div className={`form-filter__controls${cart ? " __cart" : ""}`}>
            {cart ? (
              <div className="form-filter__controls_left">
                <div className="form-filter__control">
                  <Ripples
                    onClick={() => {
                      const store = localStorage.getItem("catpart");
                      if (store) {
                        xlsDownload([...getJsonData(store)], currency, 0);
                      } else {
                        notificationFunc("success", "Корзина пуста.", "Нечего скачивать.");
                      }
                    }}
                    className="btn __gray"
                    during={1000}
                  >
                    <div className="btn-inner">
                      <span className="btn __blue">
                        <span className="btn-icon icon icon-download" />
                      </span>
                      <span>Скачать список</span>
                    </div>
                  </Ripples>
                </div>
              </div>
            ) : someCategoryUrl ? (
              <>
                {itemData ? <div className="form-filter__controls_left">
                  <div className="form-filter__control">
                    <Ripples
                      onClick={() => {
                        onSubmitSearchForm(props.match.url.replace(/\//g, ""), 1);
                      }}
                      className="btn __blue"
                      during={1000}
                    >
                  <span
                    // to={`/search/?art=${encodeURIComponent("max44")}&q=${encodeURIComponent(1)}`}
                    className="btn-inner">
                    <span>Получить актуальные данные</span>
                  </span>
                    </Ripples>
                  </div>
                </div> : null}
              </>
            ) : totalData > 0 ? (
              <div className="form-filter__controls_left">
                <div className="form-filter__control">
                  <Ripples
                    onClick={() => {
                      xlsDownload(searchData.res, currency, searchData.bom ? 1 : -1);
                    }}
                    className="btn __gray"
                    during={1000}
                  >
                    <span className="btn-inner">
                      <span className="btn __blue">
                        <span className="btn-icon icon icon-download" />
                      </span>
                      <span>Скачать результат поиска</span>
                    </span>
                  </Ripples>
                </div>
                <div className="form-filter__control">
                  <Ripples
                    onClick={() => {
                      setOpenShare(true);
                    }}
                    className="btn __gray"
                    during={1000}
                  >
                    <span className="btn-inner">Поделиться</span>
                  </Ripples>
                  {openShare &&
                    <Share shareUrl={encodeURIComponent(window.location.href)}
                           shareText={encodeURIComponent(searchInfo)}
                           notificationFunc={notificationFunc} setOpenFunc={setOpenShare} />}
                </div>
              </div>
            ) : null}

            {(cart || (totalData > 0 && !categoryPage)) ? (
              <div onChange={onChangeSwitch} className="form-filter__controls_right">
                {currencyList &&
                  currencyList.length > 1 &&
                  currencyList.map((cur, ind) => (
                    <Ripples key={ind} className="form-filter__control" during={1000}>
                      <label className="form-radio__btn">
                        <input
                          name="currency"
                          className="hide"
                          // checked={}
                          defaultChecked={currency.name === cur.name ? true : null}
                          data-currency={cur.name}
                          type="radio"
                          value={cur.exChange}
                        />
                        <span className="btn __gray">
                          <b>{cur.name}</b>
                          {cur.name !== "RUB" && <span>{priceFormatter(cur.exChange, cur.precision)}</span>}
                        </span>
                      </label>
                    </Ripples>
                  ))}
              </div>
            ) : null}
          </div>
        )}
      </div>

      {cart ? (
          <>
            <CartResults setTableHeadFixed={setTableHeadFixed} setShowTableHeadFixed={setShowTableHeadFixed}
                         updateCart={updateCart} list={cartData} notificationFunc={notificationFunc}
                         showResults={showResults} count={count} currency={currency} />

            <OrderForm profile={profile} history={history} setOpenAuthPopup={setOpenAuthPopup} setBusyOrder={setBusyOrder}
                       updateCart={updateCart} notificationFunc={notificationFunc} setOrderSent={setOrderSent}
                       totalCart={totalCart} currency={currency} delivery />
          </>
        ) :
        <>
          {busy || categoryPage ? null : (totalData > 0 && !categoryPage) ? (
            <SearchResults
              scrollTriggers={scrollTriggers}
              setScrollTriggers={setScrollTriggers}
              setTableHeadFixed={setTableHeadFixed}
              setShowTableHeadFixed={setShowTableHeadFixed}
              updateCart={updateCart}
              notificationFunc={notificationFunc}
              highlight={decodeURIComponent(query.get("art") || "")}
              showResults={showResults}
              count={query.get("q") || ""}
              currencyList={currencyList}
              currency={currency}
              bom={searchData.bom}
              list={searchData.res}
            />
          ) : (totalData < 0 || categoryPage) ? null : (
            <>
              <DeepElaboration data={elaboration} setElaboration={setElaboration} elaboration={elaboration} />
              <OrderForm
                profile={profile}
                history={history}
                setOpenAuthPopup={setOpenAuthPopup}
                setBusyOrder={setBusyOrder}
                updateCart={updateCart}
                notificationFunc={notificationFunc}
                setOrderSent={setOrderSent}
                totalCart={totalCart}
                currency={currency}
                setElaboration={setElaboration}
                elaboration={elaboration}
              />
            </>)
          }
        </>
      }
    </>
  );
}

FilterForm.propTypes = {
  showResults: PropTypes.bool,
  searchData: PropTypes.object,
  someCategoryUrl: PropTypes.bool,
  cart: PropTypes.bool,
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  notificationFunc: PropTypes.func,
  sendSearchRequest: PropTypes.func,
  // currency: PropTypes.string,
  onChangeCurrency: PropTypes.func
};

const mapStateToProps = createStructuredSelector({
  // currency: makeSelectCurrency(),
  loading: makeSelectLoading(),
  error: makeSelectError()
});

export function mapDispatchToProps(dispatch) {
  return {
    onChangeCurrency: (exchange, currency) => dispatch(changeCurrency(exchange, currency))
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose(
  withConnect,
  memo
)(FilterForm);
