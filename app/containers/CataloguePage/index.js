/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 */

import React, { useEffect, useMemo, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { Helmet } from "react-helmet";
// Import React Table
import ReactTable from "react-table";
import qs from "qs";

// Import React Table HOC Fixed columns
import withFixedColumns from "react-table-hoc-fixed-columns";

const ReactTableFixedColumns = withFixedColumns(ReactTable);
import Ripples from "react-ripples";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useDetectClickOutside } from "react-detect-click-outside";
import FormInput from "../../components/FormInput";
import apiGET from "../../utils/search";
import LoadingIndicator from "components/LoadingIndicator";

export default function CataloguePage(props) {
  const rtCellSizer = document.getElementById("rtCellSizer");
  const tableHolder = React.createRef();

  const {
    categoryItems,
    history,
    catColumnsList,
    nestedCategories,
    categoryInfo,
    categoryFilter,
    setCategoryFilter,
    categoryFilterNames,
    showCatPreloader,
    filterItemsHTML
  } = props;

  const [openFilterDropdown, setOpenFilterDropdown] = useState(false);
  const [openMobFilterDropdown, setOpenMobFilterDropdown] = useState(false);

  const [filterColumn, setFilterColumn] = useState("");
  const [filterSelection, setFilterSelection] = useState(null);
  const [columnOptions, setColumnOptions] = useState([]);
  const [filterOptions, setFilterOptions] = useState([]);
  const [filterText, setFilterText] = useState("");

  const openFilterRef = useDetectClickOutside({
    onTriggered: (e) => {
      if (!(e.target.closest(".catalogue-page__table-sorter") || e.target.closest(".catalogue-page__filter-popup") || e.target.closest(".catalogue-page__filter-dropdown"))) {
        setOpenFilterDropdown(false);
        setFilterOptions([]);
      }
    }
  });

  const openMobFilterRef = useDetectClickOutside({
    onTriggered: (e) => {
      if (!(e.target.closest(".catalogue-page__table-sorter") || e.target.closest(".catalogue-page__filter-popup") || e.target.closest(".catalogue-page__filter-dropdown"))) {
        setOpenMobFilterDropdown(false);
        setFilterOptions([]);
      }
    }
  });

  function chunkArray(myArray, chunk_size) {
    let results = [];

    while (myArray.length) {
      results.push(myArray.splice(0, chunk_size));
    }

    return results;
  }

  let title = categoryInfo && categoryInfo.hasOwnProperty("name") ? categoryInfo.name : "";

  const rtSortExtension = (col) => {
    return <div className={"catalogue-page__table-sorter"}>
      <div className="sort-btn btn __gray" onClick={() => {
        if (col === filterColumn) {
          setOpenFilterDropdown(false);
        } else {
          setOpenMobFilterDropdown(false);
          setFilterColumn(col);
          setOpenFilterDropdown(true);
        }
      }}><span /></div>
      <div className="catalogue-page__table-tip">Фильтр</div>
    </div>;
  };

  const getColumnWidth = (accessor, headerText) => {
    const maxWidth = 600;
    const padding = 23;
    const cellLength = Math.max(
      ...(headerText || "").split(" ").map(h => {
        rtCellSizer.innerText = h || "";
        return Math.ceil(padding + rtCellSizer.offsetWidth);
      }),
      ...categoryItems.map(row => {
        rtCellSizer.innerText = row[accessor] || "";
        return Math.ceil(padding + rtCellSizer.offsetWidth);
      })
    );
    return cellLength;
  };

  useEffect(() => {
    setOpenFilterDropdown(false);
  }, [categoryItems]);

  useEffect(() => {
    if (openFilterDropdown) {
      console.log("openFilterDropdown", filterColumn);

      let requestURL = "";
      if (filterColumn === "catManufacturer") {
        requestURL = "/catalog/manufacturers";
      } else {
        let item = catColumnsList.find(f => f.accessor === filterColumn);

        if (item && item.hasOwnProperty("attributeId")) {
          requestURL = `/catalog/attributes/${item.attributeId}/values`;
        }
      }

      if (requestURL) {
        apiGET(requestURL, {}, data => {
          setFilterOptions(data);
        });
      }
    } else {
      setFilterColumn("");
    }

  }, [openFilterDropdown, filterColumn]);

  useEffect(() => {
    setFilterText("");
    setFilterOptions([]);

    let filter = categoryFilter.find(f => f.name === filterColumn);

    setFilterSelection(filter);
  }, [categoryItems, filterColumn]);

  useEffect(() => {
    setColumnOptions(filterOptions.filter(f => f && f.toLowerCase().indexOf(filterText) === 0));
  }, [filterOptions, filterText]);

  const nestedCategoriesItems = useMemo(() => {
    let ret = [[], [], [], []];

    nestedCategories.forEach((s, si) => {
      ret[si % 4].push(<Link to={"/" + s.slug + "/"} key={si} className={"catalogue__list-link"}>{s.name}</Link>);
    });

    return ret;
  }, [nestedCategories]);

  const catalogHTML = useMemo(() => {
    return categoryItems.length ?
      <>
        <ReactTableFixedColumns
          key={categoryItems.length}
          data={categoryItems}
          showPagination={false}
          showPageJump={false}
          sortable={false}
          getTdProps={(state, rowInfo, column, instance) => {
            return {
              onMouseEnter: (e) => {
                let nodes = Array.prototype.slice.call(e.target.parentNode.children);
                const index = nodes.indexOf(e.target);
                let header = e.target.closest(".rt-table").querySelector(".rt-thead.-header");

                Array.prototype.slice.call(header.querySelectorAll(".rt-th")).forEach((h, hi) => {
                  h.classList[index === hi ? "add" : "remove"]("__hover");
                });
              },
              onMouseLeave: (e) => {
                let nodes = Array.prototype.slice.call(e.target.parentNode.children);
                let header = e.target.closest(".rt-table").querySelector(".rt-thead.-header");
                Array.prototype.slice.call(header.querySelectorAll(".rt-th"))[nodes.indexOf(e.target)].classList.remove("__hover");
              }
            };
          }}
          columns={[
            {
              Header: "",
              fixed: "left",
              columns: [
                {
                  Header: <div className={"text-center"}>Фото</div>,
                  accessor: "catImage",
                  Cell: tableProps => {
                    return <span className={"catalogue-page__table-image"}>
                      {tableProps.row.catImage ?
                        <LazyLoadImage
                          effect="opacity"
                          src={tableProps.row.catImage}
                          // placeholder={<span className={"catalogue-page__table-loader"} />}
                          alt={tableProps.row.catPartNum} />
                        : null}
                    </span>;
                  },
                  minWidth: 10,
                  width: 70
                },
                {
                  Header: <div className={"text-center"}>Номер детали</div>,
                  accessor: "catPartNum",
                  Cell: tableProps => {
                    return tableProps.row._original.catPartLink ?
                      <div className={"catalogue-page__table-name"}>
                        <Link className={"catalogue-page__table-link"}
                              to={"/" + tableProps.row._original.catPartLink}>
                          {tableProps.row.catPartNum}
                        </Link>
                        <div className={"catalogue-page__table-expander icon icon-chevron-up"} onClick={(e) => {
                          e.target.closest(".rt-tr").classList.toggle("__opened");
                        }} />
                      </div> : <span>{tableProps.row.catPartNum}</span>;
                  },
                  // width: 170,
                  minWidth: 10,
                  width: getColumnWidth("catPartNum", "Номер детали")
                },
                {
                  // Header: <div className={"text-center"}>Производитель</div>,
                  accessor: "catManufacturer",
                  Header: tableProps => {
                    return <div
                      className={"catalogue-page__table-cell text-center"}>
                      <span>Производитель</span>
                      {rtSortExtension("catManufacturer")}
                    </div>;
                  },
                  Cell: tableProps => {
                    return <span className={"text-center catalogue-page__table-param"}>
                    <span className={"catalogue-page__table-key"}>Производитель</span>
                    <span
                      className={"catalogue-page__table-value white-space__normal"}>{tableProps.row.catManufacturer}</span>
                  </span>;
                  },
                  minWidth: 10,
                  width: getColumnWidth("catManufacturer", "Производитель")
                  // width: 110
                }
              ]
            },
            {
              Header: "",
              columns: [].concat(catColumnsList.map((c, ci) => {
                c.Header = tableProps => {
                  return <div
                    className={"catalogue-page__table-cell"}>
                    <span>{c.accessor}</span>
                    {rtSortExtension(c.accessor)}
                  </div>;
                };

                c.minWidth = 10;
                c.width = getColumnWidth(c.accessor, c.accessor);

                c.Cell = (cell) => {
                  let name = catColumnsList.find(f => f.attributeId === cell.column.attributeId).accessor;

                  return <span
                    className={"text-center catalogue-page__table-param" + (cell.value ? "" : " mob-hidden__")}>
                    <span className={"catalogue-page__table-key"}>{name}</span>
                    <span className={"catalogue-page__table-value"}>{cell.value}</span>
                  </span>;
                };

                return c;
              }))
            }
          ]}
          defaultPageSize={categoryItems.length}
          // style={{ height: 500 }}
          className="catalogue-striped"
        />
      </>
      : null;
  }, [categoryItems]);

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
        <meta name="keywords" content={title} />
        <link rel="canonical" href={`https://catpart.ru/${history.location.pathname.split("/")[1]}/`} />
      </Helmet>

      {categoryInfo !== null ? <div className="row">
        <div className="column sm-col-12 xl-col-9">
          <article className="article __catalogue">
            <div className="article-title">{categoryInfo.name || ""}</div>
            <p>
              {categoryInfo.description || ""}
            </p>
          </article>
        </div>
      </div> : null}

      {nestedCategories.length ? <div className="catalogue-page__scroller">
        <div className="catalogue-page__snippet">
          {/*{chunkArray(nestedCategories, snippetCount).map((c, ci) => <div key={ci}*/}
          {/*                                                                className={"catalogue-page__snippet-col"}>*/}
          {/*  {c.map((s, si) => <Link to={s.slug} key={ci + "_" + si} className={"catalogue__list-link"}>{s.name}</Link>)}*/}
          {/*</div>)}*/}

          {nestedCategoriesItems.map((c, ci) => <React.Fragment key={ci}>{c}</React.Fragment>)}
        </div>
      </div> : null}

      <ul className={"catalogue-page__filter-data"}>
        {filterItemsHTML}
        <li ref={openMobFilterRef} className={"mob-only dropdown-holder"}>
          <Ripples
            onClick={() => {
              setOpenMobFilterDropdown(!openMobFilterDropdown);
            }}
            className={"btn __gray filter-add-btn"}
            during={1000}
          >
            <span className="btn-inner">Добавить фильтр</span>
          </Ripples>
          {openMobFilterDropdown ?
            <div className={"dropdown-container"}>
              <ul className={"catalogue-page__filter-dropdown"}>
                <li>
                  <Ripples
                    onClick={() => {
                      setOpenMobFilterDropdown(false);
                      setFilterColumn("catManufacturer");
                      setOpenFilterDropdown(true);
                    }}
                    className="dropdown-link"
                    during={1000}
                  >Производитель</Ripples>
                </li>

                {catColumnsList.map((m, mi) => <li key={mi}>
                  <Ripples
                    onClick={() => {
                      setOpenMobFilterDropdown(false);
                      setFilterColumn(m.accessor);
                      setOpenFilterDropdown(true);
                    }}
                    className="dropdown-link"
                    during={1000}
                  >{m.accessor}</Ripples>
                </li>)}
              </ul>
            </div> : null}
        </li>
      </ul>

      <div ref={openFilterRef} className="catalogue-page__filter">
        {openFilterDropdown ?
          <div className="catalogue-page__filter-popup">
            <div
              className={"catalogue-page__filter-title"}>{filterColumn === "catManufacturer" ? "Производитель" : filterColumn}</div>

            <FormInput
              key={filterColumn}
              onChange={(e) => {
                setFilterText(e.target.value.toLowerCase());
              }}
              placeholder={"Искать"}
              itemprop="query-input"
              name="filter-search"
              //
              className={"__lg"}
              error={null}
              id="filter-search"
              // inputRef={formArtNumber}
            />

            <ul className="catalogue-page__filter-options">
              {filterOptions.length ?
                // columnOptions.length ?
                columnOptions.map((o, oi) => {
                  let checked = false;
                  let filter = categoryFilterNames.find(f => f.name === filterColumn);

                  if (filter && filter.values.indexOf(o) > -1) {
                    checked = true;
                  }

                  return <li key={oi}>
                    <input id={"filter-option_" + oi} defaultChecked={checked} className="hide" value={o}
                           type="checkbox" />
                    <Ripples
                      onClick={() => {
                        let filter;

                        if (filterSelection && filterSelection.hasOwnProperty("values")) {
                          const filterIndex = filterSelection.values.findIndex(f => f === o);

                          if (filterIndex > -1) {
                            filterSelection.values.splice(filterIndex, 1);
                          } else {
                            filterSelection.values.push(o);
                          }

                          filter = filterSelection;
                        } else {
                          filter = categoryFilterNames.find(f => f.name === filterColumn);

                          if (filter) {
                            filter.values = [o];
                          } else {
                            if (filterColumn === "catManufacturer") {
                              filter = {
                                id: "m",
                                name: "Производитель",
                                values: [o]
                              };
                            } else {
                              let item = catColumnsList.find(f => f.accessor === filterColumn);

                              filter = {
                                id: item.attributeId,
                                name: item.accessor,
                                values: [o]
                              };
                            }
                          }
                        }

                        setFilterSelection(filter);
                      }}
                      className={"dropdown-link"}
                      during={1000}
                    ><label htmlFor={"filter-option_" + oi}>
                      <span>{o}</span>
                    </label></Ripples>
                  </li>;
                })
                // <li className={"catalogue-page__filter-nodata"}>Нет совпадений</li>
                : <LoadingIndicator />}
            </ul>

            <Ripples
              onClick={() => {
                let filterAttr = [];
                let param = catColumnsList.find(f => f.accessor === filterColumn);

                if (param) {
                  let attrId = filterColumn === "catManufacturer" ? "m" : param.attributeId;
                  let filter = categoryFilterNames.find(f => f.id === attrId);

                  if (filter) {
                    filter.values = filterSelection.values;
                  } else {
                    filterAttr.push(filterSelection);
                  }
                } else if (filterColumn === "catManufacturer") {
                  let filter = categoryFilterNames.find(f => f.id === "m");

                  if (filter) {
                    filter.values = filterSelection.values;
                  } else {
                    filterAttr.push(filterSelection);
                  }
                }

                console.log("filterAttr", filterAttr);

                setCategoryFilter(categoryFilterNames.concat(filterAttr).filter(f => f.values.length));

                setOpenFilterDropdown(false);
              }}
              className="btn __blue __lg __w-100p"
              during={1000}
            >
            <span className="btn-inner">
              <span>Применить</span>
            </span>
            </Ripples>
          </div> : null
        }
      </div>

      <div ref={tableHolder} className="catalogue-page__full">
        {showCatPreloader ? <span>Skeleton here</span> : catalogHTML}
      </div>
    </>
  );
}
