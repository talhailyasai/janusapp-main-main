import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { FaCaretDown } from "react-icons/fa";
import "./Filter.css";
import { OverlayTrigger, Tooltip } from "@themesberg/react-bootstrap";
import Popup from "reactjs-popup";

function ImportMultiSelectDropDown(props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(props.options || []);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState(
    props.selectedOptions || []
  );
  const dropdownRef = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {
    setFilteredOptions(props.options || []);
  }, [props.options]);

  useEffect(() => {
    if (props.options && props.selectedOptions) {
      const filteredItems = props.options.filter((item) =>
        props.selectedOptions.includes(item.id)
      );
      const fullDetailsArray = props.selectedOptions?.map((id) =>
        filteredItems.find((item) => item.id === id)
      );
      setSelectedOptions(fullDetailsArray || []);
    }
  }, [props.selectedOptions, props.options]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value?.toUpperCase());

    setFilteredOptions(
      props.options?.filter((option) =>
        option?.label
          ?.toLowerCase()
          ?.includes(event.target.value?.toLowerCase())
      )
    );
  };

  const handleOptionClick = (event) => {
    const optionId = event.target.value;
    // if (props?.handleFilter && props?.belongsTo) {
    //   props?.handleFilter(optionId, "belongsTo");
    // } else if (props?.handleFilter && props?.ImagesProperties) {
    //   props?.handleFilter(optionId, "ImagesProperties");
    // }
    let selectedOption = [];
    if (event.target.checked) {
      selectedOption = [
        ...selectedOptions,
        props.options?.find((item) => item.id === optionId),
      ];
      setSelectedOptions([
        ...selectedOptions,
        props.options?.find((item) => item.id === optionId),
      ]);
    } else {
      selectedOption = selectedOptions?.filter(
        (option) => option.id !== optionId
      );
      setSelectedOptions(
        selectedOptions?.filter((option) => option.id !== optionId)
      );
    }
    if (props.onSelectionChange) {
      props.onSelectionChange(
        props.name,
        props.import
          ? [selectedOption[selectedOption?.length - 1]]?.map((item) => item.id)
          : selectedOption?.map((item) => item.id)
      );
    }
  };
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
  };
  return (
    <div className="multiselect-dropdown" ref={dropdownRef}>
      <div className="dropdown">
        {!props.hideTriggerButton && (
          <Popup
            trigger={
              <button
                className={
                  props.import
                    ? "btn btn-primary dropdown-toggle filter_dropdown_toogle import"
                    : "btn btn-primary dropdown-toggle filter_dropdown_toogle"
                }
                type="button"
                id="dropdownMenuButton"
                aria-haspopup="true"
                aria-expanded="false"
              >
                {!props.import && selectedOptions?.length > 0
                  ? selectedOptions?.length + " " + t("common.pages.selected")
                  : props.placeholder || "Select options"}
                <FaCaretDown />
              </button>
            }
            position="bottom center"
            closeOnDocumentClick
            modal={false}
            nested
          >
            {(close) => (
              <div
                className={`dropdown-menu show ${
                  props.name === "flag"
                    ? ""
                    : "dropdown-menu-lg planning_dropdown"
                }`}
              >
                {!props?.searchInput && (
                  <form className="d-flex" onSubmit={handleSearch}>
                    <input
                      type="text"
                      name={props.name}
                      className="form-control planning_search"
                      placeholder={t("common.pages.search_options")}
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                  </form>
                )}

                <div
                  className="d-flex flex-column"
                  style={{ overflowY: "auto", gap: "10px", maxHeight: "15rem" }}
                >
                  {filteredOptions?.map((option) => (
                    <div
                      key={option.id}
                      className={
                        "form-check mt-2 mx-2 d-flex align-items-center justify-content-start " +
                        props.optionsClassName
                      }
                    >
                      <div className="planning_user_checkbox_main">
                        <input
                          className="form-check-input planning_user_checkbox"
                          type="checkbox"
                          value={option?.id}
                          checked={selectedOptions
                            ?.map((item) => item?.id)
                            .includes(option?.id)}
                          onChange={(e) => {
                            handleOptionClick(e);
                            if (props.import) close();
                          }}
                        />
                      </div>
                      <label
                        className="form-check-label planning_search"
                        style={{ marginLeft: "10px" }}
                      >
                        {props.import ? (
                          option.label?.length > 24 ? (
                            <OverlayTrigger
                              key={"top"}
                              placement={"top"}
                              overlay={
                                <Tooltip id={`tooltip-${"top"}`}>
                                  {option?.system_name}
                                </Tooltip>
                              }
                            >
                              <div>{option?.label}</div>
                            </OverlayTrigger>
                          ) : (
                            option?.label
                          )
                        ) : (
                          option?.label
                        )}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Popup>
        )}
      </div>
    </div>
  );
}

export default ImportMultiSelectDropDown;
