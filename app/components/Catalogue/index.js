import React, { useEffect, useState } from "react";
import apiGET from "../../utils/search";

function Catalogue({ history, setOpenCatalogue }) {
  const subMenu2 = [
    { name: "Быстродействующие" },
    { name: "Варикапы" },
    { name: "Выпрямительные" },
    { name: "Высоковольтные" },
    { name: "Диодные мосты" },
    { name: "Диоды лавинные" },
    { name: "Защитные" },
    { name: "Импульсные" },
    { name: "Прочие диоды" },
    { name: "СВЧ, туннельные" },
    { name: "Силовые" },
    { name: "Стабилитроны" },
    { name: "Быстродействующие" },
    { name: "Варикапы" },
    { name: "Выпрямительные" },
    { name: "Высоковольтные" },
    { name: "Диодные мосты" },
    { name: "Диоды лавинные" },
    { name: "Защитные" },
    { name: "Импульсные" },
    { name: "Прочие диоды" },
    { name: "СВЧ, туннельные" },
    { name: "Силовые" },
    { name: "Стабилитроны" },
    { name: "Быстродействующие" },
    { name: "Варикапы" },
    { name: "Выпрямительные" },
    { name: "Высоковольтные" },
    { name: "Диодные мосты" },
    { name: "Диоды лавинные" },
    { name: "Защитные" },
    { name: "Импульсные" },
    { name: "Прочие диоды" },
    { name: "СВЧ, туннельные" },
    { name: "Силовые" },
    { name: "Стабилитроны" },
    { name: "Быстродействующие" },
    { name: "Варикапы" },
    { name: "Выпрямительные" },
    { name: "Высоковольтные" },
    { name: "Диодные мосты" },
    { name: "Диоды лавинные" },
    { name: "Защитные" },
    { name: "Импульсные" },
    { name: "Прочие диоды" },
    { name: "СВЧ, туннельные" },
    { name: "Силовые" },
    { name: "Стабилитроны" },
    { name: "Шоттки" }
  ];
  const subMenu = [
    { name: "Акустика", submenu: subMenu2 },
    { name: "Диоды", submenu: subMenu2 },
    { name: "Запчасти для Apple", submenu: subMenu2 },
    { name: "Запчасти для бытовой техники", submenu: subMenu2 },
    { name: "Запчасти для ноутбуков", submenu: subMenu2 },
    { name: "Запчасти для планшетов", submenu: subMenu2 },
    { name: "Запчасти для смартфонов", submenu: subMenu2 },
    { name: "Индуктивные компоненты", submenu: subMenu2 },
    { name: "Компенсация реактивной мощности", submenu: subMenu2 },
    { name: "Конденсаторы", submenu: subMenu2 },
    { name: "Микросхемы", submenu: subMenu2 },
    { name: "Оптопары и изоляторы", submenu: subMenu2 },
    { name: "Полупроводниковые модули", submenu: subMenu2 },
    { name: "Предохранители", submenu: subMenu2 },
    { name: "Радиолампы", submenu: subMenu2 },
    { name: "Резисторы", submenu: subMenu2 },
    { name: "Резонаторы и фильтры", submenu: subMenu2 },
    { name: "Тиристоры и Триаки", submenu: subMenu2 },
    { name: "Транзисторы", submenu: subMenu2 },
    { name: "Трансформаторы", submenu: subMenu2 },
    { name: "Устройства защиты", submenu: subMenu2 },
    { name: "Акустика", submenu: subMenu2 },
    { name: "Диоды", submenu: subMenu2 },
    { name: "Запчасти для Apple", submenu: subMenu2 },
    { name: "Запчасти для бытовой техники", submenu: subMenu2 },
    { name: "Запчасти для ноутбуков", submenu: subMenu2 },
    { name: "Запчасти для планшетов", submenu: subMenu2 },
    { name: "Запчасти для смартфонов", submenu: subMenu2 },
    { name: "Индуктивные компоненты", submenu: subMenu2 },
    { name: "Компенсация реактивной мощности", submenu: subMenu2 },
    { name: "Конденсаторы", submenu: subMenu2 },
    { name: "Микросхемы", submenu: subMenu2 },
    { name: "Оптопары и изоляторы", submenu: subMenu2 },
    { name: "Полупроводниковые модули", submenu: subMenu2 },
    { name: "Предохранители", submenu: subMenu2 },
    { name: "Радиолампы", submenu: subMenu2 },
    { name: "Резисторы", submenu: subMenu2 },
    { name: "Резонаторы и фильтры", submenu: subMenu2 },
    { name: "Тиристоры и Триаки", submenu: subMenu2 },
    { name: "Транзисторы", submenu: subMenu2 },
    { name: "Трансформаторы", submenu: subMenu2 },
    { name: "Устройства защиты", submenu: subMenu2 },
    { name: "Ферриты, магниты, СВЧ приборы", submenu: subMenu2 }
  ];

  const [menuPath, setMenuPath] = useState("0");
  const [menuJson, setMenuJson] = useState([
    // {
    //   name: "Электронные компоненты",
    //   submenu: subMenu
    // },
    // {
    //   name: "Измерительные приборы",
    //   submenu: subMenu
    // },
    // {
    //   name: "Оптоэлектроника",
    //   submenu: subMenu
    // }
  ]);

  useEffect(() => {
    const requestURL = "/catalog/categories";

    apiGET(requestURL, {}, data => {
      setMenuJson(data.map(d => {
        return {
          name: d.name,
          link: d.link,
          submenu: subMenu
        };
      }));
    });
  }, []);

  // useEffect(() => {
  //   console.log("menuPath", menuPath);
  // }, [menuPath]);

  const menuTreeBuilder = (menu, level = 0, parent = "0", ret = []) => {
    let sub = [];

    menu.forEach((m, mi) => {
      ret.push(<div onMouseEnter={() => {
        setMenuPath(`${parent}-${mi}`);
      }} className={"catalogue__list-item"} key={`key_${parent}_${level}_${mi}`}>
        <span onClick={() => {
          setOpenCatalogue(false);
          history.push(m.link || "#");
          return false;
        }}
              className={"catalogue__list-link" + (JSON.stringify(menuPath.split("-").slice(0, level + 2)) === JSON.stringify(`${parent}-${mi}`.split("-")) ? " __active" : "")}>{parent} {m.name}</span>
      </div>);

      if (m.submenu) {
        sub.push(menuTreeBuilder(m.submenu, level + 1, `${parent}-${mi}`));
      }
    });

    return <React.Fragment key={"fragment_" + parent}>
      <div
        className={"catalogue__list __level-" + level + (JSON.stringify(menuPath.split("-").slice(0, level + 1)) === JSON.stringify(parent.split("-")) ? " __show" : "")}>{ret}</div>
      {sub}
    </React.Fragment>;
  };

  return (
    <div className="catalogue">
      <div className="catalogue__inner">
        {menuTreeBuilder(menuJson)}
      </div>
    </div>
  );
}

export default Catalogue;
