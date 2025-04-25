import { Breadcrumb } from "@themesberg/react-bootstrap";
import { t } from "i18next";
import React from "react";

const Breadcrumbs = ({ items = [] }) => {
  return (
    <Breadcrumb
      listProps={{
        className:
          "breadcrumb-primary breadcrumb-text-light text-white mb-0 property_breadcrumbs",
      }}
    >
      {items.map((item, i) => {
        if (item.if)
          return (
            <Breadcrumb.Item
              key={i}
              value={item.value}
              onClick={(e) => item.handleClick(e)}
            >
              {item.value === "Building"
                ? t(`property_page.${item.value}`)
                : item.value}
            </Breadcrumb.Item>
          );
        else return null;
      })}
    </Breadcrumb>
  );
};

export default Breadcrumbs;
