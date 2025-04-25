import React from "react";
import "./style.css";
import image1 from "../../assets/img/help/data-setting/image1.svg";
import image2 from "../../assets/img/help/data-setting/image2.svg";
import { useHistory } from "react-router-dom";
import Navbar from "./navbar";

const Index = () => {
  const history = useHistory();
  return (
    <>
      <Navbar />
      <div className="help-data-settings how-it-works">
        <div className="crumb">
          <span onClick={() => history.push("/help-resources-articles")}>
            BÖRJA ANVÄNDA JANUS
          </span>{" "}
          : DATAINSTÄLLNINGAR
        </div>
        <div className="header">Datainställningar</div>
        <div className="work-section">
          <div className="parah">
            Inställningar för respektive funktion hittar du under
            Datainställningar. Struktur och funktion är även beskrivet i
            respektive avsnitt. Datainställningar kräver att du är
            systemadministratör som användare.
          </div>
        </div>
        <div className="work-section">
          <div className="title">Fastighet</div>
          <div>
            Fliken Fastighet har inga inställningar som kan göras av användaren.
            Samma sak gäller för fliken Byggnad, men här finns uppslagsregister
            för byggnadsattribut. Adresser är en förutsättning för att kunna
            registrera hyresobjekt. Adress och hyresobjekt är passiva register i
            systemet och behöver inte fyllas i för att ha full funktionalitet
            för underhåll och rondering.
          </div>
        </div>
        <div className="work-section">
          <div className="title">Rondering</div>
          <div>
            Komponenter är ett standardbibliotek av komponenter. Du kan antingen
            nyttja dessa så som de är eller skapa egna. Det är först när en
            komponent läggs till i en byggnad som du kan anpassa data.
            Komponentpaket är ett sätt att gruppera flera komponenter
            tillsammans. Framförallt när man arbetar efter ett avtal som gäller
            flera fastigheter.
          </div>
        </div>
        <div className="work-section">
          <div className="title">Underhåll</div>
          <div>Inställningar plan</div>
        </div>
        <div className="img-section">
          <img src={image1} alt="" />
        </div>
        <div className="work-section">
          <div className="parah">
            Namn används i underhållsrapporten. Startår är det är som
            underhållsplanen startar. Detta kommer gälla även för avsättningar.
            Planens längd avser hur många år planen sträcker sig. Detta har
            betydelse för när man lägger till aktiviteter som ska återkomma
            flera gånger under planen. Generellt påslag är en schablon som läggs
            till utöver de kostnader som gäller för en viss åtgärd. Detta är att
            betrakta som en byggherrekostnad eller liknande. Moms används som en
            generell sats och tillämpas i analys och rapport för att visa
            kostnader inklusive respektive exklusive moms. Index: man kan välja
            att använda index i underhållsplanen genom att kryssa i rutan använd
            index. Där anger man sedan den förväntade årliga prisökningen samt
            basår, dvs från vilket år som indexuppräkningen startar.
          </div>
        </div>
        <div className="img-section">
          <img src={image2} alt="" />
        </div>
        <div className="work-section">
          <div className="title">Avsättningar</div>
          <div className="parah">
            <div>
              Nuvarande avsättningar anger vad som faktiskt sätts av till
              underhållskostnader Rekommenderade avsättningar är ett värde som
              du som användare kommer fram till genom att analysera diagrammet
              och underhållsplanen för att hitta ett slutvärde som är optimalt
              för er.
            </div>
            <div>
              Genomsnittlig underhållskostnad är ett medelvärde av de poster som
              finns i planen. Observera att i beräkningen exkluderas poster som
              angivits som investeringar alternativt den angivna del av posten
              som är att betrakta som en investering. Ingångsvärde
              underhållsfond är ert aktuella saldo i underhållsfonden. Slutvärde
              underhållsfond är summan baserat på ingångsvärde plus nuvarande
              avsättningar minus genomsnittlig underhållskostnad.
            </div>
            <div>
              Slutvärde vid rekommenderade avsättningar är summan baserat på
              ingångsvärde plus rekommenderade avsättningar minus genomsnittlig
              underhållskostnad.
            </div>
          </div>
        </div>
        <div className="work-section">
          <div className="title">Underhållsartiklar</div>
          <div className="parah">
            Underhållsartiklarna är en prislista som ingår i systemet. När
            artiklarna används för att skapa en underhållspost så skapas en
            kopia av värdena som sedan kompletteras med mängd.
          </div>
          <div className="parah">
            Artiklarna kan inte ändras utan är gemensamma i systemet. Vill man
            ha samma artikel men i modifierad form, annat pris etc, så ska man
            kopiera den och skapa en ny post. På samma sätt kan man skapa egna
            artiklar. Artiklar som skapas av en användare tillhör den
            organisationen och är inte synliga utanför denna.
          </div>
          <div className="parah">
            Underhållspaket är ett sätt att gruppera flera underhållsartiklar
            tillsammans. Detta görs bl.a. när man arbetar med standardiserade
            planer för flera fastigheter/byggnader och är ett sätt att snabbt
            registrera många poster.
          </div>
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
      </div>
    </>
  );
};

export default Index;
