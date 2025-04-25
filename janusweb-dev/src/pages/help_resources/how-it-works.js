import React, { useState, useRef, useEffect } from "react";
import "./style.css";
import image1 from "../../assets/img/help/how-it-works/image1.svg";
import image2 from "../../assets/img/help/how-it-works/image2.svg";
import image3 from "../../assets/img/help/how-it-works/image3.svg";
import image4 from "../../assets/img/help/how-it-works/image4.svg";
import image5 from "../../assets/img/help/how-it-works/image5.svg";
import image6 from "../../assets/img/help/how-it-works/image6.svg";
import image7 from "../../assets/img/help/how-it-works/image7.svg";
import image8 from "../../assets/img/help/how-it-works/image8.svg";
import image9 from "../../assets/img/help/how-it-works/image9.svg";
import image10 from "../../assets/img/help/how-it-works/image10.svg";
import image11 from "../../assets/img/help/how-it-works/image11.svg";
import image12 from "../../assets/img/help/how-it-works/image12.svg";
import image13 from "../../assets/img/help/how-it-works/image13.svg";
import image14 from "../../assets/img/help/how-it-works/image14.svg";
import image15 from "../../assets/img/help/how-it-works/image15.svg";

import { ReactComponent as Step1 } from "../../assets/img/help/how-it-works/step1.svg";
import { ReactComponent as Step2 } from "../../assets/img/help/how-it-works/step2.svg";
import { ReactComponent as Step3 } from "../../assets/img/help/how-it-works/step3.svg";
import { ReactComponent as Step4 } from "../../assets/img/help/how-it-works/step4.svg";
import { ReactComponent as Step5 } from "../../assets/img/help/how-it-works/step5.svg";
import { ReactComponent as Step6 } from "../../assets/img/help/how-it-works/step6.svg";
import { ReactComponent as Step7 } from "../../assets/img/help/how-it-works/step7.svg";
import { ReactComponent as Step8 } from "../../assets/img/help/how-it-works/step8.svg";
import { ReactComponent as Step9 } from "../../assets/img/help/how-it-works/step9.svg";
import { ReactComponent as Step10 } from "../../assets/img/help/how-it-works/step10.svg";
import { ReactComponent as Step11 } from "../../assets/img/help/how-it-works/step11.svg";
import { ReactComponent as Step12 } from "../../assets/img/help/how-it-works/step12.svg";
import { ReactComponent as Step13 } from "../../assets/img/help/how-it-works/step13.svg";
import { useHistory } from "react-router-dom";
import Navbar from "./navbar";

const Index = () => {
  const history = useHistory();
  // First slider states
  const sliderRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [itemsPerView, setItemsPerView] = useState(3);

  // Second slider states
  const sliderRefFour = useRef(null);
  const [currentIndexFour, setCurrentIndexFour] = useState(0);
  const [canScrollLeftFour, setCanScrollLeftFour] = useState(false);
  const [canScrollRightFour, setCanScrollRightFour] = useState(true);
  const [itemsPerViewFour, setItemsPerViewFour] = useState(2);

  const totalImages = 9; // First slider total
  const totalImagesFour = 4; // Second slider total

  // Calculate items per view for first slider
  const calculateItemsPerView = () => {
    const width = window.innerWidth;
    if (width > 1024) return 3;
    if (width > 768) return 2;
    return 1;
  };

  // Calculate items per view for second slider
  const calculateItemsPerViewFour = () => {
    const width = window.innerWidth;
    if (width > 768) return 2;
    return 1;
  };

  // Handle resize for both sliders
  useEffect(() => {
    const handleResize = () => {
      // First slider
      const newItemsPerView = calculateItemsPerView();
      setItemsPerView(newItemsPerView);
      if (currentIndex > totalImages - newItemsPerView) {
        setCurrentIndex(0);
        sliderRef.current?.scrollTo({ left: 0, behavior: "smooth" });
      }

      // Second slider
      const newItemsPerViewFour = calculateItemsPerViewFour();
      setItemsPerViewFour(newItemsPerViewFour);
      if (currentIndexFour > totalImagesFour - newItemsPerViewFour) {
        setCurrentIndexFour(0);
        sliderRefFour.current?.scrollTo({ left: 0, behavior: "smooth" });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [currentIndex, currentIndexFour]);

  // Check scroll buttons for first slider
  const checkScrollButtons = () => {
    const maxIndex = totalImages - itemsPerView;
    setCanScrollLeft(currentIndex > 0);
    setCanScrollRight(currentIndex < maxIndex);
  };

  // Check scroll buttons for second slider
  const checkScrollButtonsFour = () => {
    const maxIndex = totalImagesFour - itemsPerViewFour;
    setCanScrollLeftFour(currentIndexFour > 0);
    setCanScrollRightFour(currentIndexFour < maxIndex);
  };

  // Handle slide for first slider
  const handleSlide = (direction) => {
    const container = sliderRef.current;
    if (!container) return;

    const maxIndex = totalImages - itemsPerView;
    let newIndex;

    if (direction === "next") {
      newIndex = Math.min(currentIndex + itemsPerView, maxIndex);
    } else {
      newIndex = Math.max(currentIndex - itemsPerView, 0);
    }

    setCurrentIndex(newIndex);

    const svgElement = container.querySelector(".slider-item");
    const elementWidth = svgElement.offsetWidth;
    const gap = 16;
    const scrollAmount = newIndex * (elementWidth + gap);

    container.scrollTo({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  // Handle slide for second slider
  const handleSlideFour = (direction) => {
    const container = sliderRefFour.current;
    if (!container) return;

    const maxIndex = totalImagesFour - itemsPerViewFour;
    let newIndex;

    if (direction === "next") {
      newIndex = Math.min(currentIndexFour + itemsPerViewFour, maxIndex);
    } else {
      newIndex = Math.max(currentIndexFour - itemsPerViewFour, 0);
    }

    setCurrentIndexFour(newIndex);

    const svgElement = container.querySelector(".slider-item");
    const elementWidth = svgElement.offsetWidth;
    const gap = 16;
    const scrollAmount = newIndex * (elementWidth + gap);

    container.scrollTo({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  // Check buttons effect for both sliders
  useEffect(() => {
    checkScrollButtons();
  }, [currentIndex, itemsPerView]);

  useEffect(() => {
    checkScrollButtonsFour();
  }, [currentIndexFour, itemsPerViewFour]);

  return (
    <>
      <Navbar />
      <div className="how-it-works">
        <div className="crumb">
          <span onClick={() => history.push("/help-resources-articles")}>
            BÖRJA ANVÄNDA JANUS
          </span>{" "}
          : SÅ HÄR FUNGERAR JANUS
        </div>
        <div className="header">Så här fungerar Janus</div>
        <div className="work-section">
          <div className="title">Vad är Janus</div>
          <div className="parah">
            Janus är ett verktyg för att hantera underhållsplaner och
            skötselplaner. Oavsett om du är en professionell användare som vill
            skapa detaljerade planer eller om du endast vill digitalisera en
            befintlig plan, så gör Janus det enkelt att samarbeta, effektivisera
            arbetsflöden och kvalitetssäkra processerna för skötsel och
            underhåll.
          </div>
        </div>
        <div className="work-section">
          <div className="title">Vad kan du göra i Janus?</div>
          <div className="parah">
            Oavsett om du är fastighetsägare, konsult eller entreprenör,
            tillhandahåller Janus verktyg för att skapa och förvalta
            underhållsplaner.
          </div>
          <div className="parah">
            Liknande funktioner finns för ronderingar. Här sköter systemet till
            stora delar planering, uppföljning och analys med automatik. Denna
            passar dig som vill kvalitetssäkra fastighetsdriften eller
            förvaltningsuppdraget.
          </div>
          <div className="parah">
            Systemet är utformat att du som användare ska kunna komma igång utan
            manualer och konsultstöd, oavsett dina förutsättningar vid start.
            Som användare väljer du graden av automation när planerna genereras
            vilket ger ytterligare hjälp att praktiskt komma igång med
            underhållsplanering.
          </div>
          <div className="parah">
            Genom att vara en central plattform säkerställer ni att data är
            tillgängliga, genom enkla inställningar och användande säkerställer
            ni att underhållsplanen alltid är uppdaterad och relevant.
          </div>
        </div>
        <div className="work-section">
          <div className="title">Så här är Janus organiserat</div>
          <div className="parah">
            Utgångspunkten i Janus är fastighetsregistret. Strukturen är
            Fastighet-Byggnadsverk-Komponent. Det data som produceras i form av
            underhållsposter och ronderingar kopplas till byggnadsverk
            respektive komponent.
          </div>
        </div>
        <div className="img-section">
          <img src={image1} alt="image" />
        </div>
        <div className="work-section">
          <div className="parah">
            Användare i Janus är kopplade till en organisation som genom
            systemadministratören som sköter abonnemang och behörigheter. En
            användare ges behörighet till de funktioner som denne behöver samt
            till de fastigheter som denne arbetar med.
          </div>
        </div>
        <div className="img-section">
          <img src={image2} alt="" />
        </div>
        <div className="work-section">
          <div className="title">Så här kommer du igång</div>
          <div className="parah">
            Det finns stöd för 3 huvudsakliga startlägen:
          </div>
          <ol>
            <li>Du skapar underhållsplan från start</li>
            <li>Du har en befintlig plan som du vill importera</li>
            <li>
              Du arbetar med standardiserade poster för flera fastigheter som
              justeras efter fastighetens egenskaper
            </li>
          </ol>
          <div className="parah">
            Arbetssätten kan kombineras för att passa ditt behov. När du som
            användare loggar in för första gången startas automatiskt en guide
            som hjälper dig skapa din underhållsplan med korrekta värden och
            förslag på lämpliga poster. Denna guide kan även startas och
            användas senare för att skapa nya fastigheter och underhållsposter
            om man föredrar det framför appens funktioner. Gemensamt, oavsett
            vilket startläge du utgår ifrån, är att underhållplanen behöver ha
            angivna inställningar samt att det måste finnas byggnadsverk
            registrerade för att kunna använda verktyget.
          </div>
        </div>
        <div className="work-section">
          <div className="title">Skapa underhållsplan från start</div>
          <div className="parah">I guiden:</div>
        </div>
        {/* <div className="images-section">
          <div className="images-row">
            <img src={step1} alt="img-sec" />
            <img src={step2} alt="img-sec" />
            <img src={step3} alt="img-sec" />
          </div>
          <div className="images-row">
            <img src={step4} alt="img-sec" />
            <img src={step5} alt="img-sec" />
            <img src={step6} alt="img-sec" />
          </div>
          <div className="images-row">
            <img src={step7} alt="img-sec" />
            <img src={step8} alt="img-sec" />
          </div>
          <div className="images-row">
            <img src={step9} alt="img-sec" />
          </div>
        </div> */}
        {/* First Slider */}
        <div className="images-section-slider">
          <button
            className={`slider-btn prev-btn ${
              !canScrollLeft ? "disabled" : ""
            }`}
            onClick={() => handleSlide("prev")}
            disabled={!canScrollLeft}
          >
            <span>←</span>
          </button>
          <div className="slider-container" ref={sliderRef}>
            <div className="slider-track">
              <div className="slider-item">
                <Step1 />
              </div>
              <div className="slider-item">
                <Step2 />
              </div>
              <div className="slider-item">
                <Step3 />
              </div>
              <div className="slider-item">
                <Step4 />
              </div>
              <div className="slider-item">
                <Step5 />
              </div>
              <div className="slider-item">
                <Step6 />
              </div>
              <div className="slider-item">
                <Step7 />
              </div>
              <div className="slider-item">
                <Step8 />
              </div>
              <div className="slider-item">
                <Step9 />
              </div>
            </div>
          </div>

          <button
            className={`slider-btn next-btn ${
              !canScrollRight ? "disabled" : ""
            }`}
            onClick={() => handleSlide("next")}
            disabled={!canScrollRight}
          >
            <span>→</span>
          </button>
        </div>
        <div className="work-section">
          <div className="parah">I appen via Snabbåtkomst:</div>
          <div className="parah">Välj skapa ny fastighet</div>
          <div className="parah">Välj skapa ny byggnad</div>
          <div className="parah">Välj skapa ny underhållspost</div>
        </div>
        <div className="img-section">
          <img src={image3} alt="" />
        </div>
        <div className="images-section">
          <div className="images-row-space">
            <div>
              <div class="number-container number-1">
                <span class="number">1</span>
              </div>
              <img src={image4} alt="" />
            </div>
            <div className="">
              <div>
                <div class="number-container">
                  <span class="number">2</span>
                </div>
                <img src={image5} alt="" />
              </div>
              <img src={image6} alt="" />
            </div>
            <div className="">
              <div>
                <div class="number-container">
                  <span class="number">3</span>
                </div>
                <img src={image7} alt="" />
              </div>
              <img src={image8} alt="" />
            </div>
          </div>
        </div>
        <div className="work-section">
          <div className="parah">I appen, via funktioner:</div>
          <div className="parah">Skapa fastighet, skapa byggnadsverk.</div>
          <div className="parah">
            Växla till underhåll i sidomenyn, Lägg till underhållsposter
          </div>
        </div>
        <div className="img-section">
          <img src={image9} alt="" />
        </div>
        <div className="img-section">
          <img src={image10} alt="" />
        </div>
        <div className="img-section">
          <img src={image11} alt="" />
        </div>
        <div className="work-section">
          <div className="title">Importera befintlig plan</div>
          <div className="parah">I appen via Snabbåtkomst:</div>
          <div className="parah">Välj skapa ny fastighet</div>
          <div className="parah">Välj skapa ny byggnad</div>
          <div className="parah">
            Välj skapa ny importera plan och leta upp fil att importera
          </div>
        </div>
        <div className="img-section">
          <img src={image12} alt="" />
        </div>{" "}
        <div className="img-section">
          <img src={image13} alt="" />
        </div>{" "}
        <div className="img-section">
          <img src={image14} alt="" />
        </div>
        <div className="work-section">
          <div className="parah">I guiden:</div>
          <div className="parah">
            Välj Importera befintlig underhållsplanplan
          </div>
          <div className="parah">Ange inställningar för planen.</div>
          <div className="parah">Välj Skapa fastigheter från filimport.</div>
        </div>
        {/* Second Slider */}
        <div className="images-section-slider slider-four">
          <button
            className={`slider-btn prev-btn ${
              !canScrollLeftFour ? "disabled" : ""
            }`}
            onClick={() => handleSlideFour("prev")}
            disabled={!canScrollLeftFour}
          >
            <span>←</span>
          </button>

          <div className="slider-container" ref={sliderRefFour}>
            <div className="slider-track">
              <div className="slider-item">
                <Step10 />
              </div>
              <div className="slider-item">
                <Step11 />
              </div>
              <div className="slider-item">
                <Step12 />
              </div>
              <div className="slider-item">
                <Step13 />
              </div>
            </div>
          </div>

          <button
            className={`slider-btn next-btn ${
              !canScrollRightFour ? "disabled" : ""
            }`}
            onClick={() => handleSlideFour("next")}
            disabled={!canScrollRightFour}
          >
            <span>→</span>
          </button>
        </div>
        {/* <div className="images-section">
          <div className="images-row">
            <img src={Step10} alt="" />
            <img src={Step11} alt="" />
            <img src={Step12} alt="" />
          </div>
          <div className="img-section">
            <img src={Step13} alt="" />
          </div>
        </div> */}
        <div className="work-section">
          <div className="parah">
            Observera att guiden måste slutföras för att fastigheterna ska
            sparas.
          </div>
        </div>
        <div className="work-section">
          <div className="title">Standardiserade poster i paket</div>
          <div className="parah">
            Skapa fastigheter och byggnader på något av tidigare beskrivna sätt.
          </div>
          <div className="parah">
            Välj därefter datainställningar och underhåll därefter fliken
            underhållspaket. Skapa ditt paket genom att dra artiklar till detta.
            När paketet är klart går du till Underhåll och fliken
            skapa/redigera. Välj en byggnad i listan och välj sedan Åtgärdsmenyn
            och Lägg till paket.
          </div>
        </div>
        <div className="img-section">
          <img src={image15} alt="" />
        </div>
        <div className="wor-section">
          <div className="parah">
            Observera att du behöver skapa ditt egna paket om du vill ändra
            innehållet. Om det saknas artiklar att välja till paketet, kan dessa
            skapas i fliken “Underhållsartiklar.
          </div>
          <div className="parah">
            Kopiering av artiklar från listan till paketen sker genom att
            dra-och-släppa.
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
