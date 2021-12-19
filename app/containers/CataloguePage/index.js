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
import apiGET from "../../utils/search";
import Ripples from "react-ripples";
import { useDetectClickOutside } from "react-detect-click-outside";

export default function CataloguePage(props) {
  let nestedCategoriesItems = [[], [], [], []];

  const {
    categoryItems,
    breadcrumbs,
    noDataText,
    catColumnsList,
    nestedCategories,
    categoryInfo
  } = props;

  const snippetCount = Math.ceil(nestedCategories.length / 4);

  function chunkArray(myArray, chunk_size) {
    let results = [];

    while (myArray.length) {
      results.push(myArray.splice(0, chunk_size));
    }

    return results;
  }

  let title = categoryInfo && categoryInfo.hasOwnProperty("name") ? categoryInfo.name : "";

  nestedCategories.forEach((s, si) => {
    nestedCategoriesItems[si % 4].push(<Link to={s.slug} key={si}
                                             className={"catalogue__list-link"}>{s.name}</Link>);
  });

  const catalogHTML = useMemo(() => {
    return categoryItems && categoryItems.length ?
      <ReactTableFixedColumns key={categoryItems.length}
                              data={categoryItems}
                              columns={[
                                {
                                  Header: "Name",
                                  fixed: "left",
                                  columns: [
                                    {
                                      Header: <div className={"text-center"}>Фото</div>,
                                      accessor: "catImage",
                                      Cell: tableProps => {
                                        return <span
                                          className={"catalogue-page__table-image"}>{tableProps.row.catImage ? <img
                                          src={tableProps.row.catImage}
                                          width={60}
                                          alt={tableProps.row.catPartNum}
                                        /> : null}</span>;
                                      },
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
                                      width: 170
                                    },
                                    {
                                      Header: <div className={"text-center"}>Производитель</div>,
                                      accessor: "catManufacturer",
                                      width: 110
                                    }
                                  ]
                                },
                                {
                                  Header: "Info",
                                  columns: [].concat(catColumnsList)
                                }
                              ]}
                              defaultPageSize={Math.min(categoryItems.length, 10)}
        // style={{ height: 500 }}
                              className="catalogue-striped"
      />
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
            <h1 className="article-title">{categoryInfo.name || ""}</h1>
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

      <div className="catalogue-page__full">
        {catalogHTML}
      </div>
    </>
  );
}
