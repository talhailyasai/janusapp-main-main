import React from "react";
import Logo from "../../assets/img/janus.png";
import { Button } from "@themesberg/react-bootstrap";
import { GrStatusGood } from "react-icons/gr";
import { prcingDetails } from "utils/pricing";
import api from "api";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const PricingCard = ({ type, isLarge }) => {
  const { t } = useTranslation();

  const onChoosePlan = async (priceId) => {
    const userId = localStorage.getItem("userId");
    const user = JSON.parse(localStorage.getItem("user"));
    if (userId || user?._id) {
      let res = await api.get(
        `/stripe/getCheckoutSession/${userId || user?._id}/${priceId}`
      );
      window.location = res.data.url;
    } else {
      toast.error(t("User not found"));
    }
  };
  return (
    <div className="standard_plan_main">
      <img src={Logo} alt="logo" className="pricing_logo" />
      <p className="standard_plan_heading">{type}</p>
      <div className="planCardInfo">{prcingDetails[type].desc}</div>
      <p className="standard_price">
        {prcingDetails[type].price} kr
        <span className="standard_month">
          per <br /> månad
        </span>
      </p>
      <div className="d-flex justify-content-center">
        <Button
          className="choose_plan_btn"
          onClick={() => onChoosePlan(prcingDetails[type].priceId)}
        >
          Abonnera
        </Button>
      </div>
      <div className="mt-3 top_feature_heading">
        <p className="top_feature_heading">I detta ingår:</p>
        {prcingDetails[type].features?.map((el, index) => {
          return (
            <div className="standard_plan_features">
              <GrStatusGood
                className={`plan_good_icon ${
                  index == 4 && type == "Standard" ? "largeIcon" : ""
                }`}
              />
              <p className="standard_plan_feature_heading">{el}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PricingCard;
