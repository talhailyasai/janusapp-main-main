import React from "react";
import "./style.css";
import image1 from "../../assets/img/help/property-register/image1.svg";
import image2 from "../../assets/img/help/property-register/image2.svg";
import image3 from "../../assets/img/help/property-register/image3.svg";
import image4 from "../../assets/img/help/property-register/image4.svg";
import image5 from "../../assets/img/help/property-register/image5.svg";
import image6 from "../../assets/img/help/property-register/image6.svg";
import image7 from "../../assets/img/help/property-register/image7.svg";
import image8 from "../../assets/img/help/property-register/image8.svg";
import image9 from "../../assets/img/help/property-register/image9.svg";
import image10 from "../../assets/img/help/property-register/image10.svg";
import image11 from "../../assets/img/help/property-register/image11.svg";
import image12 from "../../assets/img/help/property-register/image12.svg";
import image13 from "../../assets/img/help/property-register/image13.svg";
import image14 from "../../assets/img/help/property-register/image14.svg";
import image15 from "../../assets/img/help/property-register/image15.svg";
import { useHistory } from "react-router-dom";
import Navbar from "./navbar";

const Index = () => {
  const history = useHistory();
  return (
    <>
      <Navbar />
      <div className="help-property-register how-it-works">
        <div className="crumb">
          <span onClick={() => history.push("/help-resources-articles")}>
            BÖRJA ANVÄNDA JANUS
          </span>{" "}
          : FASTIGHETSREGISTER
        </div>
        <div className="header">Fastighetsregister</div>
        <div className="work-section">
          <div className="title">Fastighetsregister</div>
          <div className="parah">
            Fastighetsregistret är uppbyggt i en hierarki där begreppet
            fastighet är överst. För underhållsplanering krävs att man
            registrerar fastigheter och byggnader. Man kan också registrera
            komponenter och på vilka kan man registrera ronderingar. Detta sker
            manuellt om man inte använder ronderingsappen och funktionerna för
            uppföljning och analys av skötsel.
          </div>
        </div>
        <div className="img-section">
          <img src={image1} alt="" />
        </div>
        <div className="work-section">
          <div className="parah">
            Observera att man måste skapa objekten i ordningen med fastigheten
            för. När man tar bort en fastighet så tar man också bort
            underliggande delar i hierarkin.
          </div>
        </div>
        <div className="work-section">
          <div className="title">Bra att känna till</div>
          <div className="parah">
            Fastighetsregistret är grunden i systemet och data som användare
            skapar kopplas till olika nivåer i fastighetsregistret, exempelvis
            kopplas underhållsposter till byggnader och ronderingar kopplas till
            komponenter.
          </div>
          <div className="parah">
            Även om man vill komma igång snabbt och att registreringen inte har
            särskilt många obligatoriska fält, så är det att rekommendera att
            fylla i så mycket uppgifter som möjligt så dessa används för
            exempelvis prissättning av underhållsposter.
          </div>
        </div>
        <div className="work-section">
          <div className="title">Skapa fastighet</div>
          <div className="parah">Fastighet kan skapas på flera olika sätt:</div>
          <ol>
            <li>I appen via funktionen</li>
            <li>I snabbåtkomst</li>
            <li>Via guide/import</li>
          </ol>
          <div className="parah">I appen via funktionen</div>
        </div>
        <div className="img-section">
          <img src={image2} alt="" />
        </div>
        <div className="img-section">
          <img src={image3} alt="" />
        </div>
        <div className="work-section">
          <div className="parah">
            För att skapa krävs att man står på “nivån” Fastighet. Det innebär
            att man antingen har en fastighet som är markerad i listan till
            vänster eller att det anges i arbetsytan “Välj en fastighet”.
          </div>
          <div className="parah">I snabbåtkomst</div>
        </div>
        <div className="img-section">
          <img src={image4} alt="" />
        </div>
        <div className="work-section">
          <div className="parah">Båda vägarna ger samma inmatningssätt.</div>
          <div className="parah">Via guide/import</div>
        </div>
        <div className="img-section">
          <img src={image5} alt="" />
        </div>
        <div className="work-section">
          <div className="parah">
            Fastigheter och byggnader kan skapas i guiden, men det sker då i
            samband med att man skapar underhållsplanen samtidigt. Hela guiden
            måste slutföras för att objekt ska skapas.
          </div>
        </div>
        <div className="work-section">
          <div className="title">Skapa byggnad</div>
          <div className="parah">
            Byggnad kan skapas på två sätt och båda förutsätter att det finns en
            fastighet:
          </div>
          <ol>
            <li>I appen via funktionen</li>
            <li>I snabbåtkomst</li>
          </ol>
          <div className="parah">I appen via funktionen</div>
        </div>
        <div className="img-section">
          <img src={image6} alt="" />
        </div>
        <div className="work-section">
          <div className="parah">
            För att skapa krävs att man står på “nivån” byggnad. Det innebär att
            man antingen har en byggnad som är markerad i listan till vänster
            och det anges även i arbetsytan vad som är aktuell fastighet och
            byggnad.
          </div>
          <div className="parah">I snabbåtkomst</div>
        </div>
        <div className="img-section">
          <img src={image7} alt="" />
        </div>
        <div className="img-section">
          <img src={image8} alt="" />
        </div>
        <div className="work-section">
          <div className="parah">Båda vägarna ger samma inmatningssätt.</div>
          <div className="title">Skapa komponent</div>
          <div className="parah">
            Byggnad kan skapas på två sätt och båda förutsätter att det finns en
            fastighet:
          </div>
          <ol>
            <li>I appen via funktionen</li>
            <li>I snabbåtkomst</li>
          </ol>
          <div className="parah">I appen via funktionen</div>
        </div>
        <div className="img-section">
          <img src={image9} alt="" />
        </div>
        <div className="img-section">
          <img src={image10} alt="" />
        </div>
        <div className="work-section">
          <div className="parah">
            På liknande sätt som tidigare ska komponentnivån vara aktiv.
            Komponenterna kan därefter läggas till en åt gången eller flera
            stycken i form av ett paket.
          </div>
          <div className="parah">I snabbåtkomst</div>
        </div>
        <div className="img-section">
          <img src={image11} alt="" />
        </div>
        <div className="img-section">
          <img src={image12} alt="" />
        </div>
        <div className="work-section">
          <div className="parah">Båda vägarna ger samma inmatningssätt.</div>
          <div className="title">Skapa aktivitet</div>
          <div className="parah">
            Aktivitet kan skapas i fastighetsregister, men skapas med fördel med
            mobilappen för rondering.
          </div>
        </div>
        <div className="img-section">
          <img src={image13} alt="" />
        </div>
        <div className="work-section">
          <div className="title">Skapa hyresobjekt</div>
          <div className="parah">Skapa adress</div>
        </div>
        <div className="img-section">
          <img src={image14} alt="" />
        </div>
        <div className="parah">Skapa hyresobjekt</div>
        <div className="img-section">
          <img src={image15} alt="" />
        </div>
        <div className="work-section">
          <div className="parah">
            Adressen skapas innan man skapar hyresobjektet. Detta för att man då
            väljer från en lista över tillgängliga adresser och därigenom
            undviker felaktiga adresser.
          </div>
          <div className="parah">
            Adresser och hyresobjekt är kopplade till byggnad i första hand.
            Förhållandet är att en byggnad kan ha flera adresser och på en
            adress kan det finnas flera hyresobjekt.
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
