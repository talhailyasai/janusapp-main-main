import React from "react";
import "./style.css";
import image1 from "../../assets/img/help/user-accounts/image1.svg";
import image2 from "../../assets/img/help/user-accounts/image2.svg";
import image3 from "../../assets/img/help/user-accounts/image3.svg";
import image4 from "../../assets/img/help/user-accounts/image4.svg";
import image5 from "../../assets/img/help/user-accounts/image5.svg";
import { useHistory } from "react-router-dom";
import Navbar from "./navbar";

const Index = () => {
  const history = useHistory();
  return (
    <>
      <Navbar />
      <div className="how-it-works">
        <div className="crumb">
          <span onClick={() => history.push("/help-resources-articles")}>
            BÖRJA ANVÄNDA JANUS
          </span>{" "}
          : ANVÄNDARKONTON
        </div>
        <div className="header">Användarkonton</div>
        <div className="work-section">
          <div className="parah">
            Systemet har två typer av användare, systemadministratör och vanliga
            användare. En vanlig användare ges behörighet till olika funktioner
            och olika fastigheter av systemadministratören.
          </div>
          <div className="parah">
            Du väljer själv antalet vanliga användare och det är direkt kopplat
            till hur många man har i abonnemanget, dvs det kan inte finnas
            inaktiva användare.
          </div>
        </div>
        <div className="img-section">
          <img src={image1} alt="" />
        </div>
        <div className="work-section">
          <div className="parah">
            Som vanlig användare ser du endast fliken ”Min profil” och kan där
            endast ändra uppgifter för epost, lösenord, namn och telefon.
          </div>
          <div className="parah">
            Som systemadministratör kan du via Åtgärdsmenyn skapa, ändra och ta
            bort användare.
          </div>
        </div>
        <div className="img-section">
          <img src={image2} alt="" />
        </div>
        <div className="work-section">
          <div className="parah">
            För varje användare kan systemadministratören ställa in vilka
            funktioner som användaren har tillgång till och vilka fastigheter
            som användaren kan se.
          </div>
          <div className="parah">
            Om Rondering har ett (i) tecken istället för ett skjutreglage
            betyder det att nuvarande abonnemang inte omfattar Rondering och
            mobilapp. För att ändra det klickar man på (i) och får då
            möjligheten att uppgradera abonnemanget.
          </div>
        </div>
        <div className="img-section">
          <img src={image3} alt="" />
        </div>
        <div className="work-section">
          <div className="parah">
            I fliken Betalningsuppgifter har systemadministratören tillgång till
            tidigare fakturor samt möjlighet att hantera abonnemanget, genom att
            uppgradera/nedgradera plan samt justera antalet användare.
          </div>
          <div className="parah">
            Vidare har man också möjlighet att ändra kort som används vid
            betalning.
          </div>
        </div>
        <div className="img-section">
          <img src={image4} alt="" />
        </div>
        <div className="work-section">
          <div className="parah">
            Ändringar i planen börjar gälla omgående när man lägger till
            användare. När du tar bort användare är dessa kvar i 30 dagar och
            därefter justeras abonnemanget.
          </div>
        </div>
        <div className="img-section">
          <img src={image5} alt="" />
        </div>
        <div className="work-section">
          <div className="parah">
            Om abonnemang och har för få användare jämfört med antalet
            registrerade användare, så kommer detta påpekas när
            systemadministratören loggar in i systemet och får då välja vilken
            användare som ska tas bort.
          </div>
        </div>
        <div className="work-section">
          <div className="title">Bra att veta</div>
          <div className="parah">
            Ett abonnemang har minst 1 användare och det är
            systemadministratören. Inloggningen kan delas av flera om man så
            önskar. Om man tar bort systemadministratören, vilket endast sker
            vid avslut av abonnemanget, bör man vara medveten om att efter 30
            dagar raderas data.
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
