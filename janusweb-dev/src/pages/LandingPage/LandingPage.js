import React, { useState, useRef, useEffect } from "react";
import { Button, Form, Image, Modal } from "@themesberg/react-bootstrap";
import { useTranslation } from "react-i18next";
import Logo from "../../assets/img/hirez_revB_small.png";
import headerImg from "../../assets/img/landingpage/headerImg.webp";
import financesImg from "../../assets/img/landingpage/financesImg.png";
import constructionImg from "../../assets/img/landingpage/construction.png";
import checkImg from "../../assets/img/landingpage/check.png";
import firstGif from "../../assets/gif/firstGif.gif";
import secGif from "../../assets/gif/secGif.gif";
import thirdGif from "../../assets/gif/thirdGif.gif";
import "./LandingPage.css";
import { useHistory, Link } from "react-router-dom";
import ProgressBar from "react-scroll-progress-bar";
import api from "api";
import CookieConsent from "react-cookie-consent";
import Popup from "reactjs-popup";
import Swal from "sweetalert2";
import useWindowDimensions from "../../utils/getWindowDimensions";
import LandingFooter from "./LandingFooter/LandingFooter";
import LandingHeader from "./LandingHeader/LandingHeader";

const LandingPage = () => {
  const [showProp, setShowProp] = useState(false);
  const [showPropPlus, setShowPropPlus] = useState(false);
  const [show, setShow] = useState(false);
  const [user, setUser] = useState(null);
  const [CookieAccepted, setCookieAccepted] = useState(false);
  const { height, width } = useWindowDimensions();

  const { t } = useTranslation();
  const history = useHistory();
  const secondDivRef = useRef(null);
  const buttonRef = useRef(null);

  const scrollToSecondDiv = () => {
    secondDivRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleChange = (e) => {
    setUser((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e, data) => {
    e.preventDefault();
    try {
      const res = await api.post("/landing", data);
      setUser(null);
      handleClose();
      Swal.fire(
        "Tack för ditt meddelande!",
        "Vi återkommer inom kort",
        "success"
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleAccept = () => {
    localStorage.setItem("cookieAccpeted", true);
  };

  useEffect(() => {
    let isAccpeted = localStorage.getItem("cookieAccpeted");
    setCookieAccepted(isAccpeted);
  }, []);

  useEffect(() => {
    const addTransitionEffect = () => {
      // Create and append the transition element
      const transitionElement = document.createElement("div");
      transitionElement.className = "autoTransition";
      buttonRef.current?.appendChild(transitionElement);

      // Trigger the transition
      setTimeout(() => {
        transitionElement.classList.add("active");
      }, 50);

      // Remove the element after transition completes
      setTimeout(() => {
        transitionElement?.remove();
      }, 1050); // 1000ms transition + 50ms buffer
    };

    // Set up the interval
    const intervalId = setInterval(() => {
      addTransitionEffect();
    }, 30000); // Run every 30 seconds

    // Initial run
    // addTransitionEffect();

    // Cleanup
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div>
      <LandingHeader />
      <div className="header_section">
        <div>
          <div>
            <h3 className="header_headings">Underhållsplan</h3>
            <h3 className="header_headings"> Snabbt, Enkelt,</h3>
            <h3 className="header_headings lastHeading">Digitalt</h3>
          </div>
          {width < 500 && (
            <div style={{ marginBottom: "1rem" }}>
              <Image src={headerImg} className="headerImg" />
            </div>
          )}
          <p className="header_para">
            Janus är tjänsten som hjälper dig att skapa professionella
            underhållsplaner som
            <p className="lastHeading">
              sparar din tid, ger dig kontroll över fastigheten och förenklar
              analys & rapportering.
            </p>
          </p>
          <Button
            main
            className="navRegister interestedBtn"
            onClick={scrollToSecondDiv}
          >
            Jag är intresserad!
            <span class="material-symbols-outlined interestedArrow">
              arrow_right_alt
            </span>
          </Button>
        </div>
        {width > 500 && (
          <div>
            <Image src={headerImg} className="headerImg" />
          </div>
        )}
      </div>

      <div ref={secondDivRef}></div>
      <div className="finances_section">
        <div>
          <h3 className="header_headings text-center">
            God ekonomi, välskötta fastigheter?
          </h3>

          <div className="finances_img_sec">
            <Image src={financesImg} className="financesImg" />
          </div>
          <div className="finances_cards">
            <div className="finances_card">
              <span class="material-symbols-outlined finances_icon">
                schedule
              </span>
              <h5>Kom igång snabbt</h5>
              <p className="text-center">
                För att lyckas med underhållsplanering är det viktigt att komma
                igång snabbt och få rätt struktur på planen. Genom smarta
                funktioner ser Janus till att du har nära till målet.
              </p>
            </div>
            <div className="finances_card">
              <span class="material-symbols-outlined finances_icon">
                analytics
              </span>
              <h5>Analysera utfallet</h5>
              <p className="text-center">
                Oavsett om du skapar planen med Janus eller importerar data
                erbjuds ett förstklassigt analysverktyg som du kan använda för
                att sprida kunskap kring fastigheternas behov.
              </p>
            </div>
            <div className="finances_card">
              <span class="material-symbols-outlined finances_icon">
                balance
              </span>
              <h5>Påverka din ekonomi</h5>
              <p className="text-center">
                Genom att erbjuda skötselplan och underhållsplan skapar Janus
                din aktiva förvaltningsplan. Följ upp leveranser av tjänster och
                förutse framtida behov.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="features_section">
        <h3 className="header_headings mb-3">Vad kan Janus göra för dig?</h3>
        <div className="feature_cards">
          <div className="feature_card_wrap">
            <div className="feature_card ">
              <div className="card_header">
                <span class="material-symbols-outlined feature_icon">
                  construction
                </span>
                <h4>Underhåll</h4>
              </div>
              <p className="feature_para">
                Skapa planer med automatik, uppdatera och justera med enkelhet,
                kommunicera behovet på tydligt och visuellt tilltalande sätt.
                Och spara tid.
              </p>
              <hr />
              <h6>Viktiga Funktioner</h6>
              <div className="features">
                <div className="featureList">
                  <span class="material-symbols-outlined feature_check">
                    check
                  </span>
                  <p className="mb-0">Janus Prislista</p>
                </div>
                <div className="featureList">
                  <span class="material-symbols-outlined feature_check">
                    check
                  </span>
                  <p className="mb-0">Underhållspaket</p>
                </div>
                <div className="featureList">
                  <span class="material-symbols-outlined feature_check">
                    check
                  </span>
                  <p className="mb-0">Analys & Rapportering</p>
                </div>
              </div>
            </div>
          </div>
          <div className="feature_card_wrap">
            <div className="feature_card">
              <div className="card_header">
                <span class="material-symbols-outlined feature_icon">
                  home_work
                </span>
                <h4>Fastigheter</h4>
              </div>
              <p className="feature_para">
                Genom fastighetsregistret har du kontroll över ytor,
                mängduppgifter, och komponenter. Färdigt med förslag på
                skötselinstruktioner.
              </p>
              <hr />
              <h6>Viktiga Funktioner</h6>
              <div className="features">
                <div className="featureList">
                  <span class="material-symbols-outlined feature_check">
                    check
                  </span>
                  <p className="mb-0">Fastighetsdata</p>
                </div>
                <div className="featureList">
                  <span class="material-symbols-outlined feature_check">
                    check
                  </span>
                  <p className="mb-0">Färdiga skötseltexter</p>
                </div>
                <div className="featureList">
                  <span class="material-symbols-outlined feature_check">
                    check
                  </span>
                  <p className="mb-0">Skötselpaket</p>
                </div>
              </div>
            </div>
          </div>
          <div className="feature_card_wrap">
            <div className="feature_card">
              <div className="card_header">
                <span class="material-symbols-outlined feature_icon">
                  checklist
                </span>
                <h4>Rondering</h4>
              </div>
              <p className="feature_para">
                En effektiv rondering gör att du undviker onödiga reparationer
                och minskar risker kopplade till fastighetsägaransvaret.
              </p>
              <hr />
              <h6>Viktiga Funktioner</h6>
              <div className="features">
                <div className="featureList">
                  <span class="material-symbols-outlined feature_check">
                    check
                  </span>
                  <p className="mb-0">Automatisk planering</p>
                </div>
                <div className="featureList">
                  <span class="material-symbols-outlined feature_check">
                    check
                  </span>
                  <p className="mb-0">Uppföljning via karta</p>
                </div>
                <div className="featureList">
                  <span class="material-symbols-outlined feature_check">
                    check
                  </span>
                  <p className="mb-0">Analys avtalsuppfyllnad</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="videos_section mt-3">
        <h4 className="video_heading">Så här går det till...</h4>
        <p className="ready">1-2-3 Klar för start</p>
        <div className="inner_videos">
          <div className="video_section">
            <img
              src={firstGif}
              className="landingGif"
              alt="Full flexibility"
              onClick={() => window.open(firstGif, "_blank")}
              style={{ cursor: "pointer" }}
            />
            <div className="gifText">
              <h4 className="gifHeading">Full flexibilitet</h4>
              <p className="gifPara">
                Genom ett flexibelt abonnemang utan bindningtider och en egen
                portal för att administrera användare och fakturor får du full
                frihet.
              </p>
            </div>
          </div>
          {width > 500 ? (
            <div className="video_section">
              <div className="gifText">
                <h4 className="gifHeading">Snabbt</h4>
                <p className="gifPara">
                  För att du ska få full nytta av tjänsten snabbast möjligt, har
                  vi skapat funktioner som automatiserar uppstarten och som gör
                  att du kommer känna dig som "hemma".
                </p>
              </div>
              <img
                src={secGif}
                className="landingGif"
                alt="Full flexibility"
                onClick={() => window.open(secGif, "_blank")}
                style={{ cursor: "pointer" }}
              />
            </div>
          ) : (
            <div className="video_section">
              <img
                src={secGif}
                className="landingGif"
                alt="Full flexibility"
                onClick={() => window.open(secGif, "_blank")}
                style={{ cursor: "pointer" }}
              />
              <div className="gifText">
                <h4 className="gifHeading">Snabbt</h4>
                <p className="gifPara">
                  För att du ska få full nytta av tjänsten snabbast möjligt, har
                  vi skapat funktioner som automatiserar uppstarten och som gör
                  att du kommer känna dig som "hemma".
                </p>
              </div>
            </div>
          )}
          <div className="video_section">
            <img
              src={thirdGif}
              className="landingGif"
              alt="Full flexibility"
              onClick={() => window.open(thirdGif, "_blank")}
              style={{ cursor: "pointer" }}
            />
            <div className="gifText">
              <h4 className="gifHeading">Enkelt</h4>
              <p className="gifPara">
                Oavsett om du redan har en underhållsplan eller ska ta fram en
                ny plan kan du använda tjänstens smarta verktyg för att
                importera data och snabbt vara igång med analysen.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="price_plans_section mt-3">
        <h3 className="video_heading price_heading">Prisplaner</h3>
        <div className="pice_plans">
          <div className="price_inner">
            <div className="price_cards">
              <div className="price_card">
                <h4 className="clrWhite">Standard</h4>
                <div className="plan_price">
                  <h3 className="clrWhite">99</h3>
                  <div className="standard_man_main">
                    kr/mån
                    <div className="moms_heading">ex. moms</div>
                  </div>
                </div>
                <div className="plan_content">
                  <h5 className="clrWhite">Innehåll</h5>
                  <Popup
                    className="landingPagePopup"
                    trigger={
                      <span
                        class="material-symbols-outlined arrow_down standard_icon"
                        // onClick={() => setShowPropPlus(!showPropPlus)}
                      >
                        arrow_drop_down_circle
                      </span>
                    }
                    position={width <= 500 ? "bottom center" : "right top"}
                    on="click"
                    closeOnDocumentClick
                    mouseLeaveDelay={300}
                    mouseEnterDelay={0}
                    contentStyle={{
                      padding: "0px",
                      border: "none",
                      width: width <= 500 ? "90%" : "auto",
                    }}
                    arrow={true}
                  >
                    <div className="landing_standard_main">
                      <div className="landing_standard_prop">
                        <span class="material-symbols-outlined">
                          check_circle
                        </span>
                        <p className="standard_actual_prop">
                          Underhållsplan (skapa, uppdatera, analysera)
                        </p>
                      </div>
                      <div className="landing_standard_prop">
                        <span class="material-symbols-outlined">
                          check_circle
                        </span>
                        <p className="standard_actual_prop">
                          Fastighetsregister
                        </p>
                      </div>
                      <div className="landing_standard_prop">
                        <span class="material-symbols-outlined">
                          check_circle
                        </span>
                        <p className="standard_actual_prop">
                          Inga funktionsbegränsningar
                        </p>
                      </div>
                      <div className="landing_standard_prop">
                        <span class="material-symbols-outlined">
                          check_circle
                        </span>
                        <p className="standard_actual_prop">
                          Ingen bindningstid
                        </p>
                      </div>
                      <div className="landing_standard_prop">
                        <span class="material-symbols-outlined">
                          check_circle
                        </span>
                        <p className="standard_actual_prop">
                          5 Fastighet, 15 byggnader, 50 komponenter, 1 GB
                          lagring{" "}
                        </p>
                      </div>
                    </div>
                  </Popup>
                </div>
              </div>
              <div className="price_card">
                <h4 className="clrWhite">Standard Plus</h4>
                <div className="plan_price">
                  <h3 className="clrWhite">159</h3>
                  <div className="standard_man_main">
                    kr/mån
                    <div className="moms_heading">ex. moms</div>
                  </div>
                </div>
                <div className="plan_content">
                  <h5 className="clrWhite">Innehåll</h5>
                  <Popup
                    className="landingPagePopup"
                    trigger={
                      <span
                        class="material-symbols-outlined arrow_down standard_icon"
                        // onClick={() => setShowPropPlus(!showPropPlus)}
                      >
                        arrow_drop_down_circle
                      </span>
                    }
                    position={width <= 500 ? "bottom center" : "right top"}
                    on="click"
                    closeOnDocumentClick
                    mouseLeaveDelay={300}
                    mouseEnterDelay={0}
                    contentStyle={{
                      padding: "0px",
                      border: "none",
                      width: width <= 500 ? "90%" : "auto",
                    }}
                    arrow={true}
                  >
                    <div className="landing_standard_main">
                      <div className="landing_standard_prop">
                        <span class="material-symbols-outlined">
                          check_circle
                        </span>
                        <p className="standard_actual_prop">
                          Allt i Standard samt upp till:
                        </p>
                      </div>
                      <div className="landing_standard_prop">
                        <span class="material-symbols-outlined">
                          check_circle
                        </span>
                        <p className="standard_actual_prop">15 Fastigheter</p>
                      </div>
                      <div className="landing_standard_prop">
                        <span class="material-symbols-outlined">
                          check_circle
                        </span>
                        <p className="standard_actual_prop">50 Byggnadsverk</p>
                      </div>
                      <div className="landing_standard_prop">
                        <span class="material-symbols-outlined">
                          check_circle
                        </span>
                        <p className="standard_actual_prop">250 Komponenter</p>
                      </div>
                      <div className="landing_standard_prop">
                        <span class="material-symbols-outlined">
                          check_circle
                        </span>
                        <p className="standard_actual_prop">
                          10 GB lagring för filer och bilder{" "}
                        </p>
                      </div>
                      <div className="landing_standard_prop">
                        <span class="material-symbols-outlined">
                          check_circle
                        </span>
                        <p className="standard_actual_prop">
                          Skötselplan med analys
                        </p>
                      </div>
                    </div>
                  </Popup>

                  {/* Properties  */}
                  {/* {showPropPlus && (
              <div className="landing_standard_main">
                <div className="landing_standard_prop">
                  <span class="material-symbols-outlined">
                    check_circle
                  </span>
                  <p className="standard_actual_prop">
                    Allt i Standard plus upp till:
                  </p>
                </div>
                <div className="landing_standard_prop">
                  <span class="material-symbols-outlined">
                    check_circle
                  </span>
                  <p className="standard_actual_prop">15 Fastigheter</p>
                </div>
                <div className="landing_standard_prop">
                  <span class="material-symbols-outlined">
                    check_circle
                  </span>
                  <p className="standard_actual_prop">50 Byggnadsverk</p>
                </div>
                <div className="landing_standard_prop">
                  <span class="material-symbols-outlined">
                    check_circle
                  </span>
                  <p className="standard_actual_prop">250 Komponenter</p>
                </div>
                <div className="landing_standard_prop">
                  <span class="material-symbols-outlined">
                    check_circle
                  </span>
                  <p className="standard_actual_prop">
                    10 GB lagring för filer och bilder{" "}
                  </p>
                </div>
                <div className="landing_standard_prop">
                  <span class="material-symbols-outlined">
                    check_circle
                  </span>
                  <p className="standard_actual_prop">
                    Skotselplan med avtalsuppfyllelse
                  </p>
                </div>
              </div>
            )} */}
                </div>
              </div>
            </div>

            <div className="plans_tip">
              <p>Tips!</p>
              <p>
                Du kan när som helst byta plan och appen kommer att meddela om
                och när behovet uppstår, så vi rekommenderar att du börjar med
                Standard om du inte ska arbeta med skötselplan och mobilapp.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="thankyou_section">
        <div className="thankyou_inner">
          <h3 className="mb-5">Tack för din tid!!</h3>
          <Button
            main
            className="navRegister landing_thank_btn"
            onClick={() =>
              window.open(
                `${process.env.REACT_APP_FRONT_END_URL}/sign-up`,
                "_blank"
              )
            }
          >
            Jag vill komma igång - skapa konto
          </Button>
          <Button className="thankBtn landing_thank_btn" onClick={handleShow}>
            Intressant, men abonnemangen passar inte vår verksamhet
          </Button>
          {/* <Button className="thankBtn landing_thank_btn kikar_btn">
      Kikar bara runt, men jag tar gärna hjälp av ert kostnadsfria verktyg
    </Button> */}
        </div>
        {/* Form Modal */}
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Kontakt</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form
              onSubmit={(e) => {
                handleSubmit(e, user);
              }}
            >
              <Form.Group className="landing_nameField">
                <Form.Label>Namn</Form.Label>
                <Form.Control
                  name="name"
                  type="text"
                  onChange={handleChange}
                  value={user?.name}
                  required={true}
                />
              </Form.Group>
              <Form.Group className="landing_nameField">
                <Form.Label>Epost</Form.Label>
                <Form.Control
                  name="email"
                  type="email"
                  onChange={handleChange}
                  value={user?.email}
                  required={true}
                />
              </Form.Group>
              <Form.Group className="landing_nameField">
                <Form.Label>Telefon</Form.Label>
                <Form.Control
                  name="phone"
                  type="number"
                  onChange={handleChange}
                  value={user?.phone}
                  required={true}
                />
              </Form.Group>
              <Form.Group className="landing_nameField">
                <Form.Label>Meddelande</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="message"
                  onChange={handleChange}
                  value={user?.message}
                  required={true}
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Skicka
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
      {!CookieAccepted && (
        <CookieConsent onAccept={() => handleAccept()} buttonText="Jag förstår">
          Vi använder cookies för att säkerställa att du får den bästa
          surfupplevelsen på vår webbplats. Genom att använda vår webbplats
          bekräftar du att du har läst och förstått vår
          <Link to="/cookie-policy" className="cookiePolicy" target="_blank">
            Cookiepolicy
          </Link>
        </CookieConsent>
      )}

      <LandingFooter />
    </div>
  );
};

export default LandingPage;
