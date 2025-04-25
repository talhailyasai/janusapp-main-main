import React, { useState, useEffect } from "react";
import "./PricingPlan.css";
import PricingCard from "./pricingCard";
import { useTranslation } from "react-i18next";
import api from "api";
import PricingPromoCard from "./PricingPromoCard";
import { useHistory } from "react-router-dom";

const PricingPlan = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [showPromoCard, setShowPromoCard] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      if (
        (user?.plan === "Standard Plus" ||
          user?.plan === "Standard" ||
          user?.canceledPlan) &&
        !user?.trialEnd
      ) {
        history.push("/");
        return;
      }
      if (user?.trialEnd) {
        setShowPromoCard(false);
      }
    }
  }, []);

  return (
    <div className="pricing_plan_main">
      <p className="pricing_plan_heading">{t("common.pages.Pricing Plans")}</p>
      <div className="stand_and_plus_main">
        <PricingCard type="Standard" />
        <PricingCard type="Standard Plus" />
        {showPromoCard && <PricingPromoCard type="Standard Plus" />}
      </div>
    </div>
  );
};

export default PricingPlan;
