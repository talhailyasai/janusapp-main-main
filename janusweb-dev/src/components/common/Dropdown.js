import { Dropdown } from "@themesberg/react-bootstrap";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const DropdownComponent = ({
  name,
  icon,
  items = [],
  handleClick,
  nameReset,
}) => {
  const [currentItem, setCurrentItem] = useState();
  const { t } = useTranslation();

  return (
    <Dropdown className="btn-toolbar">
      <Dropdown.Toggle
        className="btn me-2 px-5 d-flex align-items-center"
        style={{
          backgroundColor: "#FBE5D6",
          borderWidth: 2,
          borderColor: "#ED7D31",
          color: "#ED7D31",
        }}
      >
        {nameReset ? name : currentItem || name}
        <span class="material-symbols-outlined">{icon || "expand_more"}</span>
      </Dropdown.Toggle>
      <Dropdown.Menu className="dashboard-dropdown dropdown-menu-left mt-2">
        {items.map((item) => item.if).every((value) => value === false) ? (
          <Dropdown.Item className="fw-bold d-flex align-items-center">
            {t("property_page.pages.no_actions_available")}
          </Dropdown.Item>
        ) : (
          items.map((item) => {
            const { if: itemIf = true } = item;
            if (!itemIf) return null;
            return (
              <Dropdown.Item
                key={item.id}
                className="fw-bold d-flex align-items-center"
                as="button"
                value={item.id}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (item.id !== "delete") {
                    setCurrentItem(item.text);
                  } else {
                    setCurrentItem(name);
                  }
                  item.handleClick && item.handleClick(item.id);
                  handleClick && handleClick(item.id);
                }}
              >
                <span
                  style={{ width: "20px" }}
                  className="me-2 material-symbols-outlined"
                >
                  {item.icon}
                </span>
                {item.text}
              </Dropdown.Item>
            );
          })
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default DropdownComponent;
