import React from "react";
import { Link } from "react-router-dom";

function Breadcrumbs({ bread }) {
  return (
    bread && bread.length ? <div className={"breadcrumbs"}>
      <ul itemScope="" itemType="http://schema.org/BreadcrumbList" className="breadcrumbs__list">
        {bread.map((b, bi) => <li itemProp="itemListElement" itemScope="" itemType="http://schema.org/ListItem"
                                  key={bi}><Link itemProp="item" className={"breadcrumbs__link"}
                                                 to={"/" + b.slug + "/"}>
          <span itemProp="name">{b.name}</span>
          <meta itemProp="position" content={bi + 1} />
        </Link>
        </li>)}
      </ul>
    </div> : null
  );
}

export default Breadcrumbs;
