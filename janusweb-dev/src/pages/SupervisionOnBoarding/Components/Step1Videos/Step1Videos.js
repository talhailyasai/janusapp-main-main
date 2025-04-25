import React, { useState } from "react";
import "../../../OnBoarding/Step2/Step2.css";
import Basic from "../../../../assets/img/pages/basic.png";
import Play from "../../../../assets/img/pages/Play.png";
import Navigation from "../../../../assets/img/pages/navigation.png";
import Fastighet from "../../../../assets/img/pages/fastighet.png";
import Underhållsplan from "../../../../assets/img/pages/under.png";
import Rondering from "../../../../assets/img/pages/rondering.png";
import { Button, Modal } from "@themesberg/react-bootstrap";
import VideoModal from "../../../OnBoarding/Step2/VedioModal";
import { useTranslation } from "react-i18next";
import { useOnboarding } from "context/OnboardingContext";

const Step1Videos = () => {
  const { t } = useTranslation();
  const [basicVed, setBasicVed] = useState(false);
  const [navigationVed, setNavigationVed] = useState(false);
  const [fastighetVed, setFastighetVed] = useState(false);
  const [underhållVed, setUnderhållVed] = useState(false);
  const [ronderingVed, setRonderingVed] = useState(false);
  const { nextStep } = useOnboarding();
  const [mandatory, setMandatory] = useState({
    basic: false,
    navigation: false,
  });

  const showVideo = (type) => {
    setMandatory((prev) => ({ ...prev, [type]: true }));
    if (type === "basic") setBasicVed(true);
    else if (type === "navigation") setNavigationVed(true);
  };
  return (
    <>
      <div className="step2_main">
        <div className="step2_div">
          <p className="basic_head">{t("common.pages.basic_function")}</p>

          <div className="basic_func_main">
            {/* Basics */}
            <div>
              <p className="basic_div_head">{t("common.pages.Basics")}</p>
              <div className="basic_func_div">
                <div
                  className="navigation_img_main"
                  onClick={() => showVideo("basic")}
                >
                  <img src={Basic} alt="basic-img" className="basic_img" />
                  <img src={Play} alt="play" className="play_img" />
                </div>
                <p className="step_vedio_min">2.53 min</p>
              </div>
            </div>
            {/* Navigation */}
            <div>
              <p className="basic_div_head">{t("common.pages.Navigation")}</p>
              <div className="basic_func_div">
                <div
                  className="navigation_img_main"
                  onClick={() => showVideo("navigation")}
                >
                  <img
                    src={Navigation}
                    alt="Navigation"
                    className="basic_img"
                  />
                  <img src={Play} alt="play" className="play_img" />
                </div>
                <p className="step_vedio_min">1.50 min</p>
              </div>
            </div>
            {/* Features */}
            <div>
              <p className="basic_div_head">{t("common.pages.Features")}</p>
              <div className="basic_func_div features_div">
                {/* Fastighet */}
                <div
                  className="fastighet_main"
                  onClick={() => setFastighetVed(true)}
                >
                  <div className="navigation_img_main">
                    <img
                      src={Fastighet}
                      alt="Fastighet"
                      className="fasti_img"
                    />
                    <img src={Play} alt="play" className="fastiplay_img" />
                  </div>
                  <p className="fastighet_head">
                    {t("common.pages.Fastighet")}
                  </p>
                  <p className="fastighet_head">4.53 min</p>
                </div>
                {/* Underhållsplan */}
                <div
                  className="fastighet_main underhall_main"
                  onClick={() => setUnderhållVed(true)}
                >
                  <div className="navigation_img_main">
                    <img
                      src={Underhållsplan}
                      alt="Underhållsplan"
                      className="fasti_img"
                    />
                    <img src={Play} alt="play" className="fastiplay_img" />
                  </div>
                  <p className="fastighet_head">
                    {t("common.pages.Underhållsplan")}
                  </p>
                  <p className="fastighet_head">4.33 min</p>
                </div>
                {/*  Rondering*/}
                <div
                  className="fastighet_main"
                  onClick={() => setRonderingVed(true)}
                >
                  <div className="navigation_img_main">
                    <img
                      src={Rondering}
                      alt="Fastighet"
                      className="fasti_img"
                    />
                    <img src={Play} alt="play" className="fastiplay_img" />
                  </div>
                  <p className="fastighet_head">
                    {t("common.pages.Rondering")}
                  </p>
                  <p className="fastighet_head">3.09 min</p>
                </div>
              </div>
            </div>
          </div>

          <div className="step1_submit_btn_main step2_continue_btn">
            <Button
              className="step1_started_btn"
              onClick={nextStep}
              // disabled={!mandatory.basic || !mandatory.navigation}
            >
              {t("common.pages.Continue")}
            </Button>
          </div>
        </div>
        {/*  Basic  Vedio Modal */}
        <VideoModal
          show={basicVed}
          onClose={() => setBasicVed(false)}
          onShow={() => setBasicVed(true)}
          source={
            "https://janus-uploads.s3.eu-north-1.amazonaws.com/1717534708732-1.-Onboarding-Basics.mp4"
          }
        />
        {/*  Navigation  Vedio Modal */}
        <VideoModal
          show={navigationVed}
          onClose={() => setNavigationVed(false)}
          onShow={() => setNavigationVed(true)}
          source={
            "https://janus-uploads.s3.eu-north-1.amazonaws.com/1717534864862-2.-Onboarding-Navigering.mp4"
          }
        />

        {/* Fastighet  Vedio Modal */}
        <VideoModal
          show={fastighetVed}
          onClose={() => setFastighetVed(false)}
          onShow={() => setFastighetVed(true)}
          source={
            "https://janus-uploads.s3.eu-north-1.amazonaws.com/1717534964154-3.-Features-Fastighet.mp4"
          }
        />
        {/* Underhållsplan  Vedio Modal */}
        <VideoModal
          show={underhållVed}
          onClose={() => setUnderhållVed(false)}
          onShow={() => setUnderhållVed(true)}
          source={
            "https://janus-uploads.s3.eu-north-1.amazonaws.com/1717535089937-3.-Features-Underh%C3%83%C2%A5llsplan.mp4"
          }
        />
        {/* Rondering  Vedio Modal */}
        <VideoModal
          show={ronderingVed}
          onClose={() => setRonderingVed(false)}
          onShow={() => setRonderingVed(true)}
          source={
            "https://janus-uploads.s3.eu-north-1.amazonaws.com/1717535016922-3.-Features-Rondering.mp4"
          }
        />
      </div>
    </>
  );
};

export default Step1Videos;
