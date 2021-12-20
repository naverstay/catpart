/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 */

import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
// Import React Table
import ReactTable from "react-table";

// Import React Table HOC Fixed columns
import withFixedColumns from "react-table-hoc-fixed-columns";

const ReactTableFixedColumns = withFixedColumns(ReactTable);
import Breadcrumbs from "../../components/Breadcrumbs";
import Ripples from "react-ripples";
import { useDetectClickOutside } from "react-detect-click-outside";
import FormInput from "../../components/FormInput";
import { uniqArray } from "../../utils/uniqArray";

export default function CataloguePage(props) {
  let nestedCategoriesItems = [[], [], [], []];
  const rtCellSizer = document.getElementById("rtCellSizer");
  const tableHolder = React.createRef();
  const filterInputRef = React.createRef();
  const {
    categoryItems,
    breadcrumbs,
    catPage,
    catColumnsList,
    nestedCategories,
    categoryInfo,
    categoryFilter,
    setCategoryFilter,
    filterItemsHTML
  } = props;

  const [openFilterDropdown, setOpenFilterDropdown] = useState(false);
  const [filterColumn, setFilterColumn] = useState("");
  const [filterSelection, setFilterSelection] = useState([]);
  const [columnOptions, setColumnOptions] = useState([]);
  const [filterText, setFilterText] = useState("");

  const openFilterRef = useDetectClickOutside({
    onTriggered: (e) => {
      if (!e.target.closest(".catalogue-page__table-sorter")) {
        setOpenFilterDropdown(false);
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

  nestedCategories.forEach((s, si) => {
    nestedCategoriesItems[si % 4].push(<Link to={"/" + s.slug} key={si}
                                             className={"catalogue__list-link"}>{s.name}</Link>);
  });

  const rtSortExtension = (col) => {
    return <div className={"catalogue-page__table-sorter"}>
      <div className="sort-btn btn __gray" onClick={() => {
        let sameCol = col === filterColumn;
        console.log("rtSortExtension", sameCol, col, filterColumn);

        if (sameCol) {
          setOpenFilterDropdown(false);
          setFilterColumn("");
        } else {
          setOpenFilterDropdown(true);
          setFilterColumn(col);
        }

      }}><span /></div>
      <div className="catalogue-page__table-tip">Фильтр</div>
    </div>;
  };

  const getColumnWidth = (accessor, headerText) => {
    const maxWidth = 600;
    const padding = 22;
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
    return Math.min(maxWidth, cellLength);
  };

  useEffect(() => {
    setOpenFilterDropdown(false);
  }, [categoryItems]);

  useEffect(() => {
    setFilterText("");
    setFilterSelection([]);
  }, [categoryItems, filterColumn]);

  useEffect(() => {
    setColumnOptions(uniqArray(categoryItems.map(c => {
      return c[filterColumn] || "";
    })).filter(f => f && f.toLowerCase().indexOf(filterText) === 0));
  }, [filterColumn, filterText]);

  const catalogHTML = useMemo(() => {
    return categoryItems && categoryItems.length ?
      <>
        <ReactTableFixedColumns
          key={categoryItems.length}
          data={categoryItems}
          sortable={false}
          // useGridLayout={true}
          columns={[
            {
              Header: "",
              fixed: "left",
              columns: [
                {
                  Header: <div className={"text-center"}>Фото</div>,
                  accessor: "catImage",
                  Cell: tableProps => {
                    return <span
                      className={"catalogue-page__table-image"}>{tableProps.row.catImage ? <img
                      src={tableProps.row.catImage}
                      alt={tableProps.row.catPartNum}
                    /> : null}</span>;
                  },
                  minWidth: 10,
                  width: 70
                },
                {
                  Header: <div className={"text-center"}>Номер детали</div>,
                  accessor: "catPartNum",
                  Cell: tableProps => {
                    return tableProps.row._original.catPartLink ?
                      <Link className={"catalogue-page__table-link"}
                            to={"/" + tableProps.row._original.catPartLink}>
                        {tableProps.row.catPartNum}
                      </Link> : <span>{tableProps.row.catPartNum}</span>;
                  },
                  // width: 170,
                  minWidth: 10,
                  width: getColumnWidth("catPartNum", "Номер детали")
                },
                {
                  // Header: <div className={"text-center"}>Производитель</div>,
                  accessor: "catManufacturer",
                  Header: tableProps => {
                    return <div className={"catalogue-page__table-cell text-center"}>
                      <span>Производитель</span>
                      {rtSortExtension("catManufacturer")}
                    </div>;
                  },
                  Cell: tableProps => {
                    return <span className={"white-space__normal"}>{tableProps.row.catManufacturer}</span>;
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
                  return <div className={"catalogue-page__table-cell"}>
                    <span>{c.accessor}</span>
                    {rtSortExtension(c.accessor)}
                  </div>;
                };

                c.minWidth = 10;
                c.width = getColumnWidth(c.accessor, c.accessor);

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
  }, [categoryItems, catColumnsList]);

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
        <meta name="keywords" content={title} />
        <link rel="canonical" href="https://catpart.ru/" />
      </Helmet>

      <Breadcrumbs bread={breadcrumbs} />

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

      <ul className={"catalogue-page__filter-data"}>{filterItemsHTML}</ul>

      <div ref={openFilterRef} className="catalogue-page__filter">
        {openFilterDropdown ? <div className="catalogue-page__filter-popup">
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
            {columnOptions.map((o, oi) => {
              return <li key={oi}>
                <input id={"filter-option_" + oi} className="hide" value={o} type="checkbox" />
                <Ripples
                  onClick={() => {
                    const filterIndex = filterSelection.findIndex(f => f === o);

                    if (filterIndex > -1) {
                      filterSelection.splice(filterIndex, 1);
                    } else {
                      filterSelection.push(o);
                    }

                    setFilterSelection(filterSelection);
                    console.log("Ripples", o, filterSelection, filterSelection.indexOf(o));
                  }}
                  className={"dropdown-link"}
                  during={1000}
                ><label htmlFor={"filter-option_" + oi}>
                  <span>{o}</span>
                </label></Ripples></li>;
            })}
          </ul>

          <Ripples
            onClick={() => {
              if (filterSelection.length) {
                console.log("catColumnsList", catColumnsList);
                let filterAttr = [];

                if (filterSelection.length) {
                  let attr = catColumnsList.find(f => f.accessor === filterColumn);

                  if (attr) {
                    filterAttr.push({
                      name: filterColumn,
                      id: parseInt(attr.attributeId),
                      values: filterSelection
                    });
                  }
                }

                if (filterAttr.length) {
                  setCategoryFilter(categoryFilter.concat(filterAttr));
                }
              }
              setOpenFilterDropdown(false);
            }}
            className="btn __blue __lg __w-100p"
            during={1000}
          >
            <span className="btn-inner">
              <span>Применить</span>
            </span>
          </Ripples>
        </div> : null}
      </div>

      <div ref={tableHolder} className="catalogue-page__full">
        {catalogHTML}
      </div>
    </>
  );
}
