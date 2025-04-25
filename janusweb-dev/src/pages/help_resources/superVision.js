import React from "react";
import "./style.css";
import image1 from "../../assets/img/help/supervision/image1.svg";
import image2 from "../../assets/img/help/supervision/image2.svg";
import image3 from "../../assets/img/help/supervision/image3.svg";
import image4 from "../../assets/img/help/supervision/image4.svg";
import image5 from "../../assets/img/help/supervision/image5.svg";
import image6 from "../../assets/img/help/supervision/image6.svg";
import image7 from "../../assets/img/help/supervision/image7.svg";
import image8 from "../../assets/img/help/supervision/image8.svg";
import image9 from "../../assets/img/help/supervision/image9.svg";
import image10 from "../../assets/img/help/supervision/image10.svg";
import image11 from "../../assets/img/help/supervision/image11.svg";
import image12 from "../../assets/img/help/supervision/image12.svg";
import image13 from "../../assets/img/help/supervision/image13.svg";
import image14 from "../../assets/img/help/supervision/image14.svg";
import image15 from "../../assets/img/help/supervision/image15.svg";

import image16 from "../../assets/img/help/how-it-works/image4.svg";
import image17 from "../../assets/img/help/how-it-works/image5.svg";
import image18 from "../../assets/img/help/how-it-works/image6.svg";
import image19 from "../../assets/img/help/how-it-works/image7.svg";
import image20 from "../../assets/img/help/how-it-works/image8.svg";
import { useHistory } from "react-router-dom";
import Navbar from "./navbar";

const Index = () => {
  const history = useHistory();
  return (
    <>
      <Navbar />
      <div className="help-supervision how-it-works">
        <div className="crumb">
          <span onClick={() => history.push("/help-resources-articles")}>
            BÖRJA ANVÄNDA JANUS
          </span>{" "}
          : RONDERING
        </div>
        <div className="header">Rondering</div>
        <div className="work-section">
          <div className="parah">
            För att skapa en skötselplan behöver du ha skapat ett
            fastighetsregister med byggnader och i byggnaderna skapar du de
            komponenter som ska ronderas. Begreppet komponent kan du som
            användare definiera själv vad det ska omfatta. En komponent kan vara
            en byggnadsdel, hel byggnad, en installation, en grönyta etc.
          </div>
        </div>
        <div className="work-section">
          <div className="title">Bra att veta</div>
          <div className="parah">
            <div>
              Funktionerna för skötselplanering kan användas genom att lägga
              till komponenter med färdiga texter för tillsyn och skötsel. I de
              fall man har flera fastigheter och arbetar efter ett AFF-avtal kan
              du förenkla registreringen genom att skapa komponentpaket som
              speglar avtalet och lägga till samma paket på varje fastighet.
            </div>
            <div>
              Du bör också känna till att eftersom komponenter ingår i
              fastighetsregistret så går det att skapa skötselplanen med
              Standard licens för systemet. Genom att ha en Standard Plus licens
              får du tillgång till planering, uppföljning och analys samt
              mobilappen för planering och utförande.
            </div>
            <div>
              Mobilappen kan användas med eller utan streckkoder beroende på era
              krav/behov av kvalitetssäkring.
            </div>
          </div>
        </div>
        <div className="work-section">
          <div className="title">Datainställningar</div>
          <div className="parah">
            Komponenter I fliken komponenter finns systemets färdiga komponenter
            som du kan använda för att skapa din skötselplan. När dessa läggs
            till kopieras data till fastighetsregistret och justeringar gäller
            endast den specifika/unika komponenten. Det är möjligt att lägga
            till egna komponenter som då endast är synliga för den egna
            organisationen.
          </div>
        </div>
        <div className="img-section">
          <img src={image1} alt="" />
        </div>
        <div className="work-section">
          <div className="parah">
            Komponentpaket är ett sätt att gruppera flera komponenter
            tillsammans. Det är en fördel att göra detta när man arbetar utifrån
            ett avtal som gäller för flera fastigheter. Eventuella justering
            görs sedan på den individuella fastigheten ifall en komponent inte
            finns i verkligheten.
          </div>
        </div>
        <div className="img-section">
          <img src={image2} alt="" />
        </div>
        <div className="work-section">
          <b>Skapa skötselplan</b>
          <div>I appen via Snabbåtkomst:</div>
          <div>Välj skapa ny fastighet</div>
          <div>Välj skapa ny byggnad</div>
          <div>Välj skapa ny byggnad</div>
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
            <div>Välj Åtgärdsmenyn och lägg till komponent</div>
          </div>
        </div>
        <div className="img-section">
          <img src={image4} alt="" />
        </div>
        <div className="img-section">
          <img src={image5} alt="" />
        </div>
        <div className="img-section">
          <img src={image6} alt="" />
        </div>
        <div className="work-section">
          <div className="title">Skapa skötselplan (paket)</div>
          <div>
            Skapa fastigheter och byggnader på något av tidigare beskrivna sätt.
          </div>
          <div className="parah">
            Välj därefter datainställningar och rondering därefter fliken
            komponentpaket. Skapa ditt paket genom att dra komponenter till
            detta. När paketet är klart går du till Fastighet och väljer byggnad
            i listan och välj sedan Åtgärdsmenyn och Lägg till komponentpaket.
          </div>
        </div>
        <div className="image-section-wrapper">
          <img src={image7} alt="" />
          <img src={image8} alt="" />
          <img src={image10} alt="" />
          <div className="">
            <img src={image11} alt="" />
          </div>
        </div>
        <div className="work-section">
          <div className="title">Utföra rondering</div>
          <div>
            Ronderingarna dokumenteras i systemet som aktiviteter. Dessa kan man
            manuellt lägga till vid behov på respektive komponent genom att
            välja den i listan och sedan välja Åtgärdsmenyn och lägg till
            aktivitet. Observera att detta inte är ett tänkt huvudsakligt
            användande utan registrering sker snabbast genom mobilappen.
          </div>
        </div>
        <div className="img-section">
          <img src={image12} alt="" />
        </div>
        <div className="work-section">
          <div className="title">Ronderingsflöde</div>
          <div>
            Arbetsflödet för att utföra ronderingar sker genom Planering,
            Uppföljning och Analys.
          </div>
        </div>
        <div className="work-section">
          <div className="title">Planering</div>
          <div>
            När du skapar ditt komponentregister genom att lägga till
            komponenter i en byggnad skapar du också en skötselplan. Varje
            komponent har ett intervall för tillsyn respektive skötsel och utgår
            från det datum du skapade komponenten. När aktiviteter utförs på
            komponenten räknas nästa datum ut för tillsyn/skötsel per automatik.
          </div>
        </div>
        <div className="parah">
          Som utgångspunkt styrs behörigheten till komponenten genom att man ger
          användaren tillgång till den fastighet som komponenten finns i via
          användarregistret (Användarkonton). I planeringsfliken finns möjlighet
          att ändra utförare (vid semester eller avvikelse). Här får du också en
          översikt över komponenter som via länken tar dig till fastigheten där
          den finns.
        </div>
        <div className="parah">
          Mobilapp I mobilappen sköts planering per automatik och genom att
          logga in med användarnamn ser man endast de fastigheter som man har
          behörighet till. Mobilappen avhandlas i eget avsnitt.
        </div>
        <div className="img-section">
          <img src={image13} alt="" />
        </div>
        <div className="work-section">
          <div className="title">Uppföljning</div>
          <div>
            I uppföljningsfliken kan du via en karta se status för byggnaderna.
            Observera att detta kräver att byggnaden har angivna värden för
            latitud och longitud (använd gärna Google Maps för att ta reda på
            data).
          </div>
          <div>
            Här kan du filtrera på olika status för de pins som representerar
            byggnaden. Dessa kommer i 3 färger, svart indikerar att ronderingar
            sker enligt plan, gul indikerar att byggnaden har åtgärder som ska
            utföras denna vecka/månad (beroende på hur du ställt skjutreglaget)
            och slutligen röd som innebär att åtgärden är försenad. [Detaljerade
            regler för pins]
          </div>
        </div>
        <div className="img-section">
          <img src={image14} alt="" />
        </div>
        <div className="work-section">
          <div className="title">Analys</div>
          <div>
            Analysen sker per automatik i systemet och räknar ut till vilken
            andel uppdraget som matats in är uppfyllt. Urvalsperioden är vecka,
            månad eller kvartal. Beroende på intervallen för tillsyn respektive
            skötsel väljer man lämplig period. Uppfyllnadsgraden kommer variera
            beroende på vilken period man väljer [Detaljerade regler för analys]
          </div>
        </div>
        <div className="img-section">
          <img src={image15} alt="" />
        </div>
        <div className="work-section">
          <div className="title">Tips</div>
          <div>AFF-definitioner:</div>
          <div>tillsyn</div>
          <div>
            driftåtgärder som omfattar observation av funktion hos ett objekt
            och rapportering av eventuella avvikelser
          </div>
        </div>
        <div className="work-section">
          <div className="title">skötsel</div>
          <div>
            driftåtgärder som omfattar åtgärderna justering eller vård av ett
            objekt samt byte eller tillförsel av förbrukningsmaterial
          </div>
        </div>
        <div className="work-section">
          <div className="title">rondering</div>
          <div>
            sekvens av åtgärder som utförs efter en på förhand vald plan
          </div>
        </div>
        <div className="work-section">
          <div className="title">drift</div>
          <div>
            tekniska åtgärder som syftar till att upprätthålla funktionen hos
            ett objekt Drift innefattar tillsyn och skötsel och utförs med ett
            förväntat intervall minst en gång per år. Den funktion som ska
            upprätthållas är den för tillfället möjliga med hänsyn till slitage,
            objektets ålder, prestationsförmåga samt till den verksamhet som
            bedrivs.
          </div>
        </div>
        <div className="work-section">
          <div className="title">NB:</div>
          <div>
            när man genomför en skötsel så har man per definition även genomfört
            en tillsyn.
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
