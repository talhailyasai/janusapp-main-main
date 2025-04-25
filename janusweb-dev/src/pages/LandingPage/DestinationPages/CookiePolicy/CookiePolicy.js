import React from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import "./CookiePolicy.css";

const CookiePolicy = () => {
  useEffect(() => {
    // Scroll to the top of the page when the component mounts
    window.scrollTo(0, 0);
  }, []);
  return (
    <div>
      <p className="terms_use_heading">Cookie Policy </p>
      <div className="terms_use_main mb-3">
        <div className="terms_use_div">
          <p className="terms_last_updated_heading">
            <span className="last_updated_date">
              Senast uppdaterad: 03/07/2024
            </span>
            <br /> <br />
            Välkommen till Janus! Vi är engagerade i att skydda din integritet
            och säkerställa att din personliga information hanteras på ett
            säkert och ansvarsfullt sätt. Denna Cookiepolicy förklarar hur vi
            använder cookies och liknande teknologier för att förbättra din
            upplevelse på vår plattform.
          </p>
          <div className="terms_use_heading_main">
            <p className="terms_acept_heading">Vad är Cookies?</p>
            <p className="terms_last_updated_heading">
              Cookies är små textfiler som lagras på din enhet (dator,
              surfplatta eller smartphone) när du besöker webbplatser. De
              används ofta för att göra webbplatser mer effektiva och för att ge
              information till webbplatsens ägare.
            </p>

            <p className="terms_acept_heading">Hur vi använder Cookies</p>
            <p className="terms_last_updated_heading">
              Vi använder cookies för att förbättra din upplevelse med Janus,
              förbättra våra tjänster och säkerställa att vår plattform fungerar
              som avsett. Så här använder vi cookies:
              <br />
              <br />
              <li>
                <span className="user_account_heading">
                  Nödvändiga Cookies:{" "}
                </span>
                Dessa cookies är nödvändiga för driften av vår webbplats och
                mobila applikationer. De gör det möjligt för dig att navigera på
                webbplatsen och använda dess funktioner, såsom att komma åt
                säkra områden.
              </li>
              <li>
                <span className="user_account_heading">Prestanda Cookies:</span>
                Dessa cookies samlar information om hur du använder vår
                webbplats, till exempel vilka sidor du besöker mest och
                eventuella fel du stöter på. Detta hjälper oss att förbättra
                funktionaliteten på vår webbplats.
              </li>
              <li>
                <span className="user_account_heading">
                  Funktionella Cookies:
                </span>
                Dessa cookies gör det möjligt för vår webbplats att komma ihåg
                val du gör (såsom ditt användarnamn, språk eller den region du
                befinner dig i) och tillhandahålla förbättrade, mer personliga
                funktioner.
              </li>
              <li>
                <span className="user_account_heading">
                  Målgruppsinriktade Cookies:
                </span>
                Dessa cookies används för att leverera innehåll som är mer
                relevant för dig och dina intressen. De kan användas för att
                tillhandahålla riktad reklam eller för att mäta effektiviteten
                av en reklamkampanj.
              </li>
            </p>
            <p className="terms_acept_heading">Typer av Cookies Vi Använder</p>
            <p className="terms_last_updated_heading">
              <li>
                <span className="user_account_heading">Session Cookies:</span>
                Dessa är tillfälliga cookies som upphör när du stänger din
                webbläsare. De används för att upprätthålla din session på vår
                webbplats och säkerställa en sömlös upplevelse.
              </li>
              <li>
                <span className="user_account_heading">
                  Beständiga Cookies:
                </span>
                Dessa cookies förblir på din enhet under en viss period eller
                tills du raderar dem. De hjälper oss att känna igen dig som en
                återkommande besökare och komma ihåg dina preferenser.
              </li>
            </p>
            <p className="terms_acept_heading">Tredjeparts Cookies</p>
            <p className="terms_last_updated_heading">
              Vi kan tillåta tredjeparts tjänsteleverantörer att placera cookies
              på din enhet för att samla in information om dina aktiviteter på
              vår webbplats. Dessa tredjeparts cookies används för analys och
              för att leverera relevant reklam på andra webbplatser.
            </p>

            <p className="terms_acept_heading">Hantering av Cookies</p>
            <p className="terms_last_updated_heading">
              Du har rätt att välja om du vill acceptera cookies eller inte.
              Observera dock att om du väljer att inaktivera cookies, kan vissa
              funktioner på vår webbplats kanske inte fungera korrekt.
              <br />
              <br />
              <li>
                <span className="user_account_heading">
                  Webbläsarinställningar:
                </span>
                De flesta webbläsare låter dig kontrollera cookies genom deras
                inställningar. Du kan ställa in din webbläsare för att vägra
                cookies, radera cookies eller meddela dig när en cookie placeras
                på din enhet.
              </li>
              <li>
                <span className="user_account_heading">Avanmälan:</span>
                Du kan välja bort tredjeparts cookies som används för
                reklamändamål genom att besöka Network Advertising Initiatives
                avanmälan-sida eller Digital Advertising Alliances
                avanmälan-sida.
              </li>
            </p>
            <p className="terms_acept_heading">Ditt Samtycke</p>
            <p className="terms_last_updated_heading">
              Genom att fortsätta använda vår webbplats, samtycker du till vår
              användning av cookies enligt denna policy. Du kan när som helst
              återkalla ditt samtycke genom att ändra dina
              webbläsarinställningar för att inaktivera cookies.
            </p>
            <p className="terms_acept_heading">
              Ändringar av Denna Cookiepolicy
            </p>
            <p className="terms_last_updated_heading">
              Vi kan uppdatera denna Cookiepolicy från tid till annan för att
              återspegla förändringar i våra rutiner eller av andra operativa,
              juridiska eller regulatoriska skäl. Vi uppmuntrar dig att granska
              denna policy regelbundet för den senaste informationen om vår
              användning av cookies.
            </p>
            <p className="terms_acept_heading">Kontakta Oss</p>
            <p className="terms_last_updated_heading">
              Om du har några frågor eller funderingar om vår Cookiepolicy,
              vänligen kontakta oss på:
              <Link to="#" style={{ marginLeft: "0.3rem" }}>
                info@balancepoint.se
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
