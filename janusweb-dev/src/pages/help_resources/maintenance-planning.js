import React, { useState, useRef, useEffect } from "react";
import "./style.css";
import image1 from "../../assets/img/help/maintenance-planning/image1.svg";
import image2 from "../../assets/img/help/maintenance-planning/image2.svg";
import image3 from "../../assets/img/help/maintenance-planning/image3.svg";
import image4 from "../../assets/img/help/maintenance-planning/image4.svg";
import image5 from "../../assets/img/help/maintenance-planning/image5.svg";
import image6 from "../../assets/img/help/maintenance-planning/image6.svg";
import image7 from "../../assets/img/help/maintenance-planning/image7.svg";
import image8 from "../../assets/img/help/maintenance-planning/image8.svg";
import image9 from "../../assets/img/help/maintenance-planning/image9.svg";
import image10 from "../../assets/img/help/maintenance-planning/image10.svg";
import image11 from "../../assets/img/help/maintenance-planning/image11.svg";
import image12 from "../../assets/img/help/maintenance-planning/image12.svg";
import image13 from "../../assets/img/help/maintenance-planning/image13.svg";
import image14 from "../../assets/img/help/maintenance-planning/image14.svg";
import image15 from "../../assets/img/help/maintenance-planning/image15.svg";
import image21 from "../../assets/img/help/maintenance-planning/image21.svg";
import image22 from "../../assets/img/help/maintenance-planning/image22.svg";
import image23 from "../../assets/img/help/maintenance-planning/image23.svg";
import image24 from "../../assets/img/help/maintenance-planning/image24.svg";
import image25 from "../../assets/img/help/maintenance-planning/image25.svg";

import image16 from "../../assets/img/help/how-it-works/image4.svg";
import image17 from "../../assets/img/help/how-it-works/image5.svg";
import image18 from "../../assets/img/help/how-it-works/image6.svg";
import image19 from "../../assets/img/help/how-it-works/image7.svg";
import image20 from "../../assets/img/help/how-it-works/image8.svg";

import { ReactComponent as Step1 } from "../../assets/img/help/maintenance-planning/step1.svg";
import { ReactComponent as Step2 } from "../../assets/img/help/maintenance-planning/step2.svg";
import { ReactComponent as Step3 } from "../../assets/img/help/maintenance-planning/step3.svg";
import { ReactComponent as Step4 } from "../../assets/img/help/maintenance-planning/step4.svg";
import { ReactComponent as Step5 } from "../../assets/img/help/maintenance-planning/step5.svg";
import { ReactComponent as Step6 } from "../../assets/img/help/maintenance-planning/step6.svg";
import { ReactComponent as Step7 } from "../../assets/img/help/maintenance-planning/step7.svg";
import { ReactComponent as Step8 } from "../../assets/img/help/maintenance-planning/step8.svg";
import { ReactComponent as Step9 } from "../../assets/img/help/maintenance-planning/step9.svg";
import { ReactComponent as Step10 } from "../../assets/img/help/maintenance-planning/step10.svg";
import { ReactComponent as Step11 } from "../../assets/img/help/maintenance-planning/step11.svg";
import { ReactComponent as Step12 } from "../../assets/img/help/maintenance-planning/step12.svg";
import { ReactComponent as Step13 } from "../../assets/img/help/maintenance-planning/step13.svg";
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
      <div className="help-maintenance how-it-works">
        <div className="crumb">
          <span onClick={() => history.push("/help-resources-articles")}>
            BÖRJA ANVÄNDA JANUS
          </span>{" "}
          : UNDERHÅLLSPLANERING
        </div>
        <div className="header">Underhållsplanering</div>
        <div className="work-section">
          <div className="parah">
            För att skapa en underhållsplan behöver du ha skapat ett
            fastighetsregister med byggnader.
          </div>
          <div className="title">Bra att veta</div>
          <div className="parah">
            Funktionerna för underhållsplanering är utformade för att vara enkla
            att använda om man inte har tidigare erfarenhet av
            underhållsplanering. Med detta sagt finns ändå ett behov av att göra
            grundläggande inställningar för att få ut analyser och rapporter på
            ett enkelt sätt samt att underhålla data.
          </div>
          <div className="parah">
            För dig som har erfarenhet av att arbeta med underhållsplanering
            finns avancerade funktioner som är utformade för att spara tid.
            Framförallt att kunna redigera flera poster samtidigt och att kunna
            skapa underhållspaket av poster från prislistan.
          </div>
        </div>
        <div className="img-section">
          <img src={image1} alt="" />
        </div>
        <div className="work-section">
          <div className="title">Datainställningar</div>
          <div className="parah">Inställningar plan</div>
          <div className="parah">
            Namn finns framförallt på underhållsrapporten.
          </div>
          <div className="parah">Startår är obligatoriskt</div>
          <div className="parah">
            Planens längd anges för rapport och analys samt för att lägga till
            rätt antal av poster som återkommer flera gånger under planens
            längd.
          </div>
          <div className="parah">
            Generellt påslag är att jämställa med en byggherrekostnad eller
            faktor som man anser att underhållsartiklarna behöver korrigeras med
            för att ge en rättvisande kostnad.
          </div>
          <div className="parah">
            Moms används i analys och rapport där man kan välja att visa
            kostnader inklusive eller exklusive moms.
          </div>
          <div className="parah">
            Använd index anger om prisökningar ska användas i planen eller ej.
          </div>
          <div className="parah">
            Årlig prisökning är en procentsats där man anger förväntade
            prisökningar för ingående poster i planen.
          </div>
          <div className="parah">
            Basår anger från vilket år eventuella prisökningar ska starta.
          </div>
          <div className="parah">
            Nuvarande avsättningar anger vad som faktiskt sätts av till
            underhållskostnader
          </div>
          <div className="parah">
            Rekommenderade avsättningar är ett värde som du som användare kommer
            fram till genom att analysera diagrammet och underhållsplanen för
            att hitta ett slutvärde som är optimalt för er.
          </div>
          <div className="parah">
            Genomsnittlig underhållskostnad är ett medelvärde av de poster som
            finns i planen. Observera att i beräkningen exkluderas poster som
            angivits som investeringar alternativt den angivna del av posten som
            är att betrakta som en investering.
          </div>
          <div className="parah">
            Ingångsvärde underhållsfond är ert aktuella saldo i
            underhållsfonden.
          </div>
          <div className="parah">
            Slutvärde underhållsfond är summan baserat på ingångsvärde plus
            nuvarande avsättningar minus genomsnittlig underhållskostnad.
            Slutvärde vid rekommenderade avsättningar är summan baserat på
            ingångsvärde plus rekommenderade avsättningar minus genomsnittlig
            underhållskostnad.
          </div>
        </div>
        <div className="work-section">
          <div className="parah">
            Underhållsartiklar Underhållsartiklarna är en prislista som ingår i
            systemet. När artiklarna används för att skapa en underhållspost så
            skapas en kopia av värdena som sedan kompletteras med mängd.
          </div>
          <div className="parah">
            Artiklarna kan inte ändras utan är gemensamma i systemet. Vill man
            ha samma artikel men i modifierad form, annat pris etc, så ska man
            kopiera den och skapa en ny post. På samma sätt kan man skapa egna
            artiklar. Artiklar som skapas av en användare tillhör den
            organisationen och är inte synliga utanför denna.
          </div>
        </div>
        <div className="img-section">
          <img src={image2} alt="" />
        </div>
        <div className="work-section">
          <div className="parah">
            Underhållspaket är ett sätt att gruppera flera underhållsartiklar
            tillsammans. Detta görs bl.a. när man arbetar med standardiserade
            planer för flera fastigheter/byggnader och är ett sätt att snabbt
            registrera många poster.
          </div>
        </div>
        <div className="img-section">
          <img src={image3} alt="" />
        </div>
        <div className="work-section">
          <div className="parah">
            Underhållsrapporten han anpassas genom ändra bilden på
            försättsbladet, t.ex. bild av den egna byggnaden. Om ingen bild
            anges används en standardsymbol. Egen rapporttext används i en egen
            sektion av underhållsrapporten. Genom texteditorn kan du utforma
            innehållet. Observera att du inte klippa och klistra från ett
            word-dokument och att formatet bibehålls utan detta måste
            kontrolleras i appens editor.
          </div>
        </div>
        <div className="img-section">
          <img src={image4} alt="" />
        </div>
        <div className="work-section">
          <div className="title">Skapa underhållsplan (enkel)</div>
          <div className="parah">
            <div>I guiden:</div>
            <div>Välj [BILD] (via guide)</div>
            <div>Ange inställningar för planen.</div>
            <div>Välj [BILD] sätt att skapa fastighetsregister.</div>
          </div>
          <div className="parah">
            <div>I appen via Snabbåtkomst:</div>
            <div>Välj skapa ny fastighet</div>
            <div>Välj skapa ny byggnad</div>
            <div>Välj skapa ny underhållspost</div>
          </div>
          <div className="parah">
            <div>I appen, via funktioner:</div>
            <div>Skapa fastighet, skapa byggnadsverk.</div>
            <div>
              Växla till underhåll i sidomenyn, Lägg till underhållsposter
            </div>
          </div>
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
          <div className="parah">
            <div>I appen via Snabbåtkomst:</div>
            <div>Välj skapa ny fastighet</div>
            <div>Välj skapa ny byggnad</div>
            <div>Välj skapa ny underhållspost</div>
          </div>
        </div>
        <div className="img-section">
          <img src={image5} alt="" />
        </div>
        <div className="images-section">
          <div className="images-row-space">
            <div>
              <div class="number-container number-1">
                <span class="number">1</span>
              </div>
              <img src={image16} alt="" />
            </div>
            <div className="">
              <div>
                <div class="number-container">
                  <span class="number">2</span>
                </div>
                <img src={image17} alt="" />
              </div>
              <img src={image18} alt="" />
            </div>
            <div className="">
              <div>
                <div class="number-container">
                  <span class="number">3</span>
                </div>
                <img src={image19} alt="" />
              </div>
              <img src={image20} alt="" />
            </div>
          </div>
        </div>
        <div className="work-section">
          <div className="parah">
            <div>I appen, via funktioner:</div>
            <div>Skapa fastighet, skapa byggnadsverk.</div>
            <div>
              Växla till underhåll i sidomenyn, Lägg till underhållsposter
            </div>
          </div>
        </div>
        <div className="img-section">
          <img src={image6} alt="" />
        </div>
        <div className="img-section">
          <img src={image7} alt="" />
        </div>
        <div className="img-section">
          <img src={image8} alt="" />
        </div>
        <div className="work-section">
          <div className="title">Importera befintlig plan</div>
          <div className="parah">
            <div>I appen via Snabbåtkomst:</div>
            <div>Välj skapa ny fastighet</div>
            <div>Välj skapa ny byggnad</div>
            <div>Välj skapa ny importera plan</div>
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
          <div className="parah">
            <div>I guiden:</div>
            <div>Välj Importera befintlig underhållsplan</div>
            <div>Ange inställningar för planen.</div>
            <div>Välj Skapa fastigheter från filimport</div>
          </div>
        </div>
        {/* <div className="images-section">
          <div className="images-row">
            <img src={step10} alt="" />
            <img src={step11} alt="" />
            <img src={step12} alt="" />
          </div>
          <div className="img-section">
            <img src={step13} alt="" />
          </div>
        </div> */}
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
        <div className="parah">
          Observera att guiden måste slutföras för att fastigheterna ska sparas.{" "}
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
          <img src={image3} alt="" />
        </div>
        <div className="work-section">
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
        <div className="work-section">
          <div className="title">Skapa underhållsplan (avancerad)</div>
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
        <div className="image-section-wrapper">
          <img src={image21} alt="" />
          <img src={image23} alt="" />
          <img src={image24} alt="" />
          <div>
            <img src={image25} alt="" />
          </div>
        </div>
        <div className="work-section">
          <div className="title">Förvalta planen</div>
          <div className="parah">
            Som användare bör du känna till att artiklar som läggs till i
            underhållsplanen är kopior av data från underhållsartiklar och har
            därefter ingen koppling. Det betyder att när en artikel ändrar pris
            i underhållsartiklar så uppdateras detta inte i din underhållsplan
            utan du måste då ändra den specifika underhållsposten. Observera att
            om man har många poster med samma artikelnummer är det en fördel att
            använda ”Redigera flera”. Prisförändringar hanteras främst genom att
            använda en årlig uppräkning av index i första hand samt genom att
            använda ett generellt påslag, liknande en byggherrekostnad.
          </div>
        </div>
        <div className="work-section">
          <div className="title">Tips</div>
          <div className="parah">
            Ta för vana att uppdatera underhållsplanen regelbundet. Framförallt
            när åtgärder utförs, men även att granska om start år för en åtgärd
            kan flyttas fram utan att det medför risker.
          </div>
        </div>
        <div className="work-section">
          <div className="title">Tips</div>
          <div className="parah">
            Skilj mellan underhåll och investeringar. Ibland är det svårt att
            dra en gräns när en byggnad renoveras och förbättras.
          </div>
        </div>
        <div className="work-section">
          <div className="title">Tips</div>
          <div className="parah">
            Prissättning som sker genom olika prislistor för
            underhållsplanering, inklusive den interna är att betrakta som
            budget eller bedömning. Ert verkliga pris får ni genom att ta in
            anbud från utförare och uppdatera underhållsposten när det blir
            känt.
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
