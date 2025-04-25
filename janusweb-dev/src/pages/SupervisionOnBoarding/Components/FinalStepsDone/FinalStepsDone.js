import { Button } from "@themesberg/react-bootstrap";
import api from "api";
import { useOnboarding } from "context/OnboardingContext";
import { usePropertyContextCheck } from "context/SidebarContext/PropertyContextCheck";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

const FinalStepsDone = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [active, setActive] = useState(null);
  const { setPropertyAdded } = usePropertyContextCheck();
  const {
    setCurrentStep,
    resetOnboarding,
    selectedPropertyTab,
    setActiveProperty,
    setActiveBuilding,
    setBuidlingArray,
  } = useOnboarding();
  const handleNavigate = async () => {
    if (active == "done") {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.isFirstLogin) {
        await api.patch(`/onboarding/change-status/${user?._id}`);
        localStorage.setItem(
          "user",
          JSON.stringify({ ...user, isFirstLogin: true })
        );
      }
      resetOnboarding();
      history.push("/supervision");
    } else {
      if (selectedPropertyTab === 3) {
        setCurrentStep(4);
      } else {
        setActiveProperty(null);
        setActiveBuilding(null);
        setBuidlingArray({ property_index: 0, array: [] });
        setCurrentStep(6);
      }
    }
  };
  return (
    <div className="maintenance_main">
      <p className="maintenance_plan_head">{t("common.pages.Next step")}</p>
      <div
        className="next_done"
        style={{
          display: "flex",
          flexDirection: "column",
          rowGap: "1rem",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          className={`maintenance_done_main ${
            active === "done" ? "active_import_div" : ""
          }`}
          onClick={() => setActive("done")}
        >
          <div>
            <span class="material-symbols-outlined next_analytics_icon">
              analytics
            </span>
          </div>
          <div className="next_done_head">
            {t("common.pages.I'm done and want to see my supervision plan")}
          </div>
        </div>
        {selectedPropertyTab !== 2 && (
          <div
            className={`maintenance_done_main ${
              active === "other" ? "active_import_div" : ""
            }`}
            onClick={() => setActive("other")}
          >
            <div>
              <span
                class="material-symbols-outlined"
                style={{ fontSize: "42px", color: "#9747FF" }}
              >
                other_houses
              </span>
            </div>
            <div className="next_done_head">
              {t("common.pages.I want to continue with another building")}
            </div>
          </div>
        )}
      </div>
      <div className="step1_submit_btn_main step_4continue next_step_btn">
        <Button
          className="step1_started_btn"
          onClick={handleNavigate}
          disabled={!active ? true : false}
        >
          {t("common.pages.Continue")}
        </Button>
      </div>
    </div>
  );
};

export default FinalStepsDone;
