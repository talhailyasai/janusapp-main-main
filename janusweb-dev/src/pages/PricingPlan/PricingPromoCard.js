import React, { useState } from "react";
import Logo from "../../assets/img/janus.png";
import { Button } from "@themesberg/react-bootstrap";
import { GrStatusGood } from "react-icons/gr";
import { prcingDetails } from "utils/pricing";
import api from "api";
import { toast } from "react-toastify";
import { useUserContext } from "context/SidebarContext/UserContext";
import { useHistory } from "react-router-dom";

const PricingPromoCard = ({ type, isLarge }) => {
  const history = useHistory();
  const [promoCode, setPromoCode] = useState("");
  const [message, setMessage] = useState("");
  const { user } = useUserContext();
  const userId = localStorage.getItem("userId");
  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!promoCode.trim()) {
      toast.warning("Vänligen ange kampanjkod");
      return;
    }
    try {
      const response = await api.post(
        `/stripe/subscribeWithPromo/${
          userId || user?._id
        }/${process.env.REACT_APP_STRIPE_STANDARD_PLUS_PRICE_ID}`,
        { promoCode }
      );
      if (response.error) {
        setMessage(response.error);
      } else {
        setMessage(
          "Prenumeration lyckades! Du har nu tillgång till Standard Plus."
        );
        history.push("/sign-in");
        toast.success(
          "Prenumeration lyckades! Du har nu tillgång till Standard Plus."
        );
      }
    } catch (error) {
      setMessage("Något gick fel.");
    }
  };
  return (
    <div className="standard_plan_main">
      <img src={Logo} alt="logo" className="pricing_logo" />
      <p className="standard_plan_heading">{type}</p>
      <div className="planCardInfo h-auto">
        <p className="mb-0">
          Begränsad gratis - 10 dagar att prova och utforska
        </p>
        <p className="mb-0">
          <b>Varning: </b>data raderas automatiskt efter periodens slut.
        </p>
      </div>
      <div className="promo-input-container">
        <input
          type="text"
          className="promo-input"
          placeholder="Ange kampanjkod"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
        />

        {message && (
          <p
            style={{
              fontSize: "14px",
              margin: "0.5rem 0",
            }}
          >
            {message}
          </p>
        )}
      </div>
      <div className="d-flex justify-content-center">
        <Button className="choose_plan_btn" onClick={(e) => handleSubscribe(e)}>
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

export default PricingPromoCard;
