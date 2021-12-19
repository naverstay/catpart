import React from "react";
import { Link } from "react-router-dom";

function Breadcrumbs({ bread }) {
  return (
    bread && bread.length ? <div className={"breadcrumbs"}>
      <ul className="breadcrumbs__list">
        {bread.map((b, bi) => <li key={bi}><Link className={"breadcrumbs__link"} to={"/" + b.slug}>{b.name}</Link>
        </li>)}
      </ul>
    </div> : null
  );
}

export default Breadcrumbs;
