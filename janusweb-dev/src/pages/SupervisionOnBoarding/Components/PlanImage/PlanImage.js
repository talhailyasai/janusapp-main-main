import React, { useEffect, useState, useRef } from "react";
import "../../../OnBoarding/Step5/planCover/style.css";
import DiagramImage from "../../../../assets/img/supervision_erp.png"; // Make sure the image is in the same directory or adjust the path accordingly
import { useTranslation } from "react-i18next";
import { Button, Form } from "@themesberg/react-bootstrap";
import Articales from "../../../../utils/articales.json";
import { generateRandomString } from "utils/helper";
import { getMaintenanceSettings } from "utils/MaintenanceReport";
import { useOnboarding } from "context/OnboardingContext";
import { usePropertyContextCheck } from "context/SidebarContext/PropertyContextCheck";
import LimitExceededModal from "components/common/Modals/LimitExceededModal";
import "./style.css";
const Sba_options = [
  { value: "BC", label: "BRANDLARMCENTRAL" },
  { value: "SBA_BL", label: "Brandlarm" },
  { value: "SBA_BD", label: "BRANDDÖRRSTÄNGNING" },
  { value: "SBA_BV", label: "BRANDVARNARE" },
  { value: "SBA_BCELL", label: "BRANDCELLSGRÄNS" },
  { value: "SBA_UTR", label: "UTRYMNINGSVÄGAR" },
  { value: "SBA_VÄG", label: "VÄGLEDANDE MARKERING" },
  { value: "SBA_UPLAN", label: "UTRYMNINGSPLANER" },
  { value: "SBA_BP", label: "INOMHUSBRANDPOSTER" },
  { value: "SBA_BS", label: "HANDBRANDSLÄCKARE" },
  { value: "SBA_BF", label: "BRANDFILTAR" },
  { value: "SBA_ANLB", label: "ANLAGD BRAND" },
  { value: "SBA_ELSÄK", label: "ELSÄKERHET" },
  { value: "SBA_BVAR", label: "BRANDFARLIG VARA" },
  { value: "SBA_REV", label: "Revision av SBA" },
];

const CustomMultiSelect = ({
  isOpen,
  setIsOpen,
  options,
  selectedValues,
  onChange,
}) => {
  const { t } = useTranslation();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="custom-multiselect" ref={dropdownRef}>
      <div className="multiselect-header" onClick={() => setIsOpen(!isOpen)}>
        <div className="header-content">
          {selectedValues.length > 0 && (
            <span className="selected-count">{selectedValues.length}</span>
          )}
          <span>{t("common.pages.Fire Safety Management")}</span>
        </div>
        <span className="material-symbols-outlined">
          {isOpen ? "expand_less" : "expand_more"}
        </span>
      </div>
      {isOpen && (
        <div className="multiselect-options">
          {options.map((option) => (
            <div key={option.value} className="multiselect-option">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option.value)}
                  onChange={(e) => {
                    const newValues = e.target.checked
                      ? [...selectedValues, option.value]
                      : selectedValues.filter((val) => val !== option.value);
                    onChange(newValues);
                  }}
                />
                <span className="checkbox-text">{option.label}</span>
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const PlanImage = () => {
  const { t } = useTranslation();
  const { accountStats } = usePropertyContextCheck();
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [limitMessage, setLimitMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const {
    selectedComponents,
    setSelectedComponents,
    selectedSbaOptions,
    setSelectedSbaOptions,
    plansCode,
    setPlansCode,
    nextStep,
  } = useOnboarding();

  const checkExceedComponentLimit = (newComponentCount) => {
    const totalComponentCount =
      newComponentCount + accountStats?.data?.componentCount;
    const isLimitExceeded =
      totalComponentCount > accountStats?.data?.limits?.components;

    if (isLimitExceeded) {
      setLimitMessage(accountStats?.data?.messages?.components);
      setShowLimitModal(true);
      return true;
    }
    return false;
  };

  const handleCheckboxChange = (e) => {
    const { checked, value } = e.target;
    if (checked) {
      if (checkExceedComponentLimit(selectedComponents.length + 1)) {
        return;
      }
      setSelectedComponents((prev) => [...prev, value]);
    } else {
      setSelectedComponents((prev) => prev.filter((item) => item !== value));
    }
  };

  const handleSbaChange = (e) => {
    const values = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    console.log("e.target.selectedOptions", e.target.selectedOptions);
    if (values.includes("")) {
      setSelectedSbaOptions([]);
    } else {
      const newOptionsCount = values.length - selectedSbaOptions.length;
      if (
        newOptionsCount > 0 &&
        checkExceedComponentLimit(selectedComponents.length + newOptionsCount)
      ) {
        return;
      }
      setSelectedSbaOptions(values);
    }
  };

  const handleCloseLimitModal = () => {
    setShowLimitModal(false);
    setLimitMessage("");
  };

  console.log({ selectedComponents, selectedSbaOptions });

  return (
    <>
      <div className="diagram-main">
        <div className="_head">
          {/* {t("common.pages.Which areas should the plan cover?")} */}
        </div>
        <div className="diagram">
          <img
            src={DiagramImage}
            alt="Building Diagram"
            className="diagram-image"
          />
          <div className="label check_1">
            <input
              type="checkbox"
              value="ELC"
              name="ELC"
              checked={selectedComponents.includes("ELC")}
              onChange={handleCheckboxChange}
            />
            {t("common.pages.Main Distribution Board")}
          </div>
          <div className="label check_2">
            <input
              type="checkbox"
              value="VÄRME"
              name="VÄRME"
              checked={selectedComponents.includes("VÄRME")}
              onChange={handleCheckboxChange}
            />
            {t("common.pages.Heating")}
          </div>
          <div className="label check_3">
            <input
              type="checkbox"
              value="VA"
              name="VA"
              checked={selectedComponents.includes("VA")}
              onChange={handleCheckboxChange}
            />
            {t("common.pages.Ventilation")}
          </div>
          <div className="label check_4">
            <input
              type="checkbox"
              name="SBA"
              checked={selectedSbaOptions.length === Sba_options?.length}
              onChange={(e) => {
                setIsOpen(true);
                if (!e.target.checked) {
                  setSelectedSbaOptions([]);
                } else {
                  const allValues = Sba_options.map((option) => option.value);
                  if (
                    checkExceedComponentLimit(
                      selectedComponents.length + allValues.length
                    )
                  ) {
                    return;
                  }
                  setSelectedSbaOptions(allValues);
                }
              }}
            />
            <CustomMultiSelect
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              options={Sba_options}
              selectedValues={selectedSbaOptions}
              onChange={(values) => {
                if (values.length > selectedSbaOptions.length) {
                  // Check limit only when adding new options
                  if (
                    checkExceedComponentLimit(
                      selectedComponents.length +
                        (values.length - selectedSbaOptions.length)
                    )
                  ) {
                    return;
                  }
                }
                setSelectedSbaOptions(values);
              }}
            />
          </div>
          <div className="label check_5">
            <input
              type="checkbox"
              value="TOMT"
              name="TOMT"
              checked={selectedComponents.includes("TOMT")}
              onChange={handleCheckboxChange}
            />
            {t("common.pages.Plot and land")}
          </div>
          <div className="label check_9">
            <input
              type="checkbox"
              value="TAK"
              name="TAK"
              checked={selectedComponents.includes("TAK")}
              onChange={handleCheckboxChange}
            />
            {t("common.pages.Roof")}
          </div>
          <div className="label sc2 check_11">
            <input
              type="checkbox"
              value="BYY"
              name="BYY"
              checked={selectedComponents.includes("BYY")}
              onChange={handleCheckboxChange}
            />
            {t("common.pages.Building exterior")}
          </div>
          <div className="label sc2 check_12">
            <input
              type="checkbox"
              value="BYI"
              name="BYI"
              checked={selectedComponents.includes("BYI")}
              onChange={handleCheckboxChange}
            />
            {t("common.pages.Building interior")}
          </div>
          <div className="label sc2 check_13">
            <input
              type="checkbox"
              value="TRAP"
              name="TRAP"
              checked={selectedComponents.includes("TRAP")}
              onChange={handleCheckboxChange}
            />
            {t("common.pages.Stairwell")}
          </div>
          <div className="label sc3 check_14">
            <input
              type="checkbox"
              value="TVST"
              name="TVST"
              checked={selectedComponents.includes("TVST")}
              onChange={handleCheckboxChange}
            />
            {t("common.pages.Laundry room")}
          </div>
          <div className="label sc3 check_15">
            <input
              type="checkbox"
              value="HISS"
              name="HISS"
              checked={selectedComponents.includes("HISS")}
              onChange={handleCheckboxChange}
            />
            {t("common.pages.Elevator")}
          </div>
          <div className="label sc7 check_17">
            <input
              type="checkbox"
              value="ENT"
              name="ENT"
              checked={selectedComponents.includes("ENT")}
              onChange={handleCheckboxChange}
            />
            {t("common.pages.Entrance")}
          </div>
          <div className="label sc2 check_18">
            <input
              type="checkbox"
              value="SOP"
              name="SOP"
              checked={selectedComponents.includes("SOP")}
              onChange={handleCheckboxChange}
            />
            {t("common.pages.Waste Management")}
          </div>
        </div>
        <Button
          className="step1_started_btn"
          onClick={(e) => {
            e.preventDefault();
            const mergedArray = [...selectedComponents, ...selectedSbaOptions];
            const filteredArray = mergedArray.filter((item) => item !== "");
            setPlansCode(filteredArray);
            nextStep();
          }}
          disabled={
            selectedComponents.length === 0 && selectedSbaOptions.length === 0
          }
        >
          {t("common.pages.Continue")}
        </Button>
      </div>
      <LimitExceededModal
        show={showLimitModal}
        onHide={handleCloseLimitModal}
        message={limitMessage}
      />
    </>
  );
};

export default PlanImage;
