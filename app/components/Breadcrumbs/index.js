import React from "react";
import { Link } from "react-router-dom";

function Breadcrumbs({ bread }) {
  return (
    <div className={"breadcrumbs"}>
      <ul className="breadcrumbs__list">
        {bread.map((b, bi) => <li key={bi}><Link className={"breadcrumbs__link"} to={"/"}>{b}</Link></li>)}
      </ul>
    </div>
  );
}

export default Breadcrumbs;
