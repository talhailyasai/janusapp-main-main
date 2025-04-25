import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./CookiePolicy.css";

const PrivacyPolicy = () => {
  useEffect(() => {
    // Scroll to the top of the page when the component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <p className="terms_use_heading">Personuppgiftspolicy</p>
      <div className="terms_use_main mb-3">
        <div className="terms_use_div">
          <p className="terms_last_updated_heading">
            {/* <span className="last_updated_date">
              Senast uppdaterad: 03/07/2024
            </span> */}
            {/* <br /> */}
            <br />
            BalancePoint AB och dess tjänst JANUS/dinunderhallsplan.se
            respekterar din integritet. Vi åtar oss att skydda integriteten för
            personer som besöker vår webbplats, personer som registrerar sig för
            att använda vår tjänst (”Kunder”) och personer som ansöker om ett
            jobb. Denna personuppgiftspolicy beskriver dina rättigheter till
            integritet och vårt åtagande att skydda dina personuppgifter.
          </p>
          <p className="terms_last_updated_heading">
            Företaget är baserat i Stockholm och följer The General Data
            Protection Regulation (EU 2016/679). Denna personuppgiftspolicy
            beskriver också dina rättigheter och möjligheter att till exempel
            begära registerutdrag, liksom vårt åtagande att skydda din
            integritet. Alla viktiga beslut om integritet på BalancePoint tas på
            företagsnivå.
          </p>
          <p className="terms_last_updated_heading">
            <strong>Vilka vi är</strong>
            <br />
            BalancePoint AB tillhandahåller den digitala produkten
            JANUS/dinunderhallsplan.se för att hjälpa fastighetsägare förenkla
            och förbättra sin hantering av teknisk förvaltning. Läs mer om
            BalancePoint på vår webbplats{" "}
            <a href="https://www.balancepoint.se/">
              https://www.balancepoint.se/
            </a>
            .
          </p>
          <p className="terms_last_updated_heading">
            <strong>När samlar vi in personuppgifter?</strong>
            <ul>
              <li>När du använder våra produkter</li>
              <li>
                När du registrerar dig för information via våra webbplatser
              </li>
              <li>
                När du interagerar med oss personligen, via telefon, via e-post,
                via sociala medier eller via våra webbplatser
              </li>
              <li>När du registrerar dig för ett evenemang</li>
              <li>När du ansöker om ett jobb</li>
            </ul>
          </p>
          <p className="terms_last_updated_heading">
            <strong>Varför samlar vi in personuppgifter?</strong>
            <p>Vi samlar in din personliga information för följande ändamål:</p>
            <ul>
              <li>
                Förbättra och utveckla kvalitet, funktionalitet och
                användarupplevelse för vår produkt, service och webbplats
              </li>
              <li>Utför direktförsäljning och avtalsprocesser</li>
              <li>
                Utför avtalsenliga skyldigheter som leverans, fakturor och
                betalningar i enlighet med våra avtal med dig som kund
              </li>
            </ul>
          </p>
          <p className="terms_last_updated_heading">
            <strong>Vilka personuppgifter samlar vi in?</strong>
            <p>
              Den typ av personuppgifter som BalancePoint behandlar om dig kan
              vara:{" "}
            </p>
            <ul>
              <li>
                Grundläggande kontaktinformation som namn, personnummer,
                telefonnummer, e-postadress och adress
              </li>
              <li>
                Information du ger oss när du ansöker om ett jobb som tidigare
                arbetsgivare, examen och referenser
              </li>
              <li>
                Demografisk information som ålder och kön samlas in om den ingår
                i din ansökan
              </li>
              <li>
                Din anställningsinformation som titel, arbetsgivare och
                befattning
              </li>
              <li>
                Dina preferenser och intressen i ett professionellt sammanhang
              </li>
              <li>Videor eller foto av dig inspelade i våra lokaler</li>
              <li>Innehåll som du har laddat upp som foton och videor</li>
              <li>
                Feedback eller frågor om våra produkter, service eller
                BalancePoint AB
              </li>
              <li>
                Din unika användarinformation såsom inloggnings-ID, användarnamn
                och lösenord
              </li>
              <li>
                Trafikinformation som tillhandahålls av din webbläsare såsom
                webbläsartyp, enhet, språk och IP-adress
              </li>
              <li>
                Ditt beteende och rörelse på våra webbplatser och i våra
                produkter
              </li>
              <li>
                E-postbeteende som vilka e-postmeddelanden från oss du öppnar,
                när du läser dem och hur
              </li>
            </ul>
            BalancePoint samlar inte in eller behandlar några speciella
            kategorier av personuppgifter.
          </p>
          <p className="terms_last_updated_heading">
            <strong>Hur samlar vi in personuppgifter?</strong>
            <br />
            BalancePoint samlar i allmänhet in personuppgifter direkt från dig.
            I vissa fall samlar vi också in personuppgifter om dig om ditt
            företag är kund hos BalancePoint.
            <br />
            Vi använder cookies och annan spårningsteknik när du använder våra
            webbplatser, våra produkter och interagerar med oss per e-post för
            att optimera din användarupplevelse. Vi kan också samla in
            personuppgifter om dig från andra källor, till exempel partners,
            sociala medieplattformar eller tredjepartsdataaggregat.
          </p>
          <p className="terms_last_updated_heading">
            <strong>Hur länge kommer vi att lagra personuppgifter?</strong>
            <br />
            BalancePoint lagrar bara dina personuppgifter så länge som det krävs
            för det angivna syftet. Vi kommer att överväga vårt behov av att
            svara på dina frågor eller lösa problem för att följa lagkrav enligt
            gällande lagar.
            <br />
            Detta innebär att vi kan behålla dina personuppgifter under en
            rimlig tid efter din senaste interaktion med oss. När de
            personuppgifter som vi samlat in inte längre krävs kommer vi att
            radera dem. Vi kan behandla vissa uppgifter för statistiska ändamål,
            men i sådana fall kommer dessa uppgifter att anonymiseras.
          </p>
          <p className="terms_last_updated_heading">
            <strong>
              Vad är den rättsliga grunden för behandling av personuppgifter?
            </strong>
            <ul>
              <li>
                <strong>Samtycke: </strong> Vi kan behandla din personliga
                information i vår marknadsföringskommunikation. Dessa kan
                innehålla information om vår produkt och tjänst, evenemang,
                aktiviteter och i vissa fall kampanjer för våra associerade
                partners produkter och tjänster. All denna kommunikation baseras
                på ditt samtycke genom att prenumerera via samtyckeformulär.
              </li>
              <li>
                <strong>Kontrakt:</strong> Vi kan använda dina personuppgifter
                för att uppfylla våra skyldigheter när det gäller våra avtal med
                kunder, partners eller leverantörer.
              </li>
              <li>
                <strong> Berättigat intresse:</strong> Vi kan också samla in din
                personliga information om det är av legitimt intresse och på ett
                sätt som vi anser inte strider mot dina integritetsrättigheter
                eller friheter.
              </li>
            </ul>
          </p>
          <p className="terms_last_updated_heading">
            <strong>Dina rättigheter som användare</strong>
            <ul>
              <li>
                Rätt att registrera utdrag. Du har rätt att kostnadsfritt en
                gång per kalenderår delta i ett registerutdrag av dina
                personuppgifter som vi lagrar och behandlar.
              </li>
              <li>
                Rätt till rättelse. Du har rätt att korrigera felaktig eller
                ofullständig information om dig själv.
              </li>
              <li>
                Dataportabilitet. Du kan ha rätt att begära överföring till en
                annan leverantör.
              </li>
              <li>
                Avaktivering och radering av användarkonto (rätten att bli
                bortglömd). Du har rätt att motsätta oss vår behandling av dina
                personuppgifter.
              </li>
            </ul>
            Använd info@balancepoint.se för förfrågningar relaterade till dina
            rättigheter.
          </p>
          <p className="terms_last_updated_heading">
            <strong>Cookies och pixeltaggar</strong>
            <br />
            Vi använder digital spårningsteknik för att samla in information om
            våra webbplatsbesökare och deras interaktioner.
            <br />
            BalancePoint använder cookies på olika sätt för att förbättra din
            upplevelse på vår webbplats. Cookies är små textfiler som skiljer en
            webbläsare från en annan.
            <br />
            Du hittar allt du behöver veta om cookies här:{" "}
            <a href="https://www.allaboutcookies.org/">
              https://www.allaboutcookies.org/
            </a>
            .
          </p>
          <p className="terms_last_updated_heading">
            <strong>Hur vi delar / överför dina personuppgifter</strong>
            <br />
            Vi kan överföra till eller dela personuppgifter med andra parter som
            behandlar uppgifter på uppdrag av företaget för att vi ska kunna
            tillhandahålla tjänsten.
            <p>
              Vi samarbetar bara med företag som behandlar personuppgifter inom
              EU / EES eller med företag som upprätthåller samma skyddsnivå som
              inom EU / EES genom t.ex. har gått med i det så kallade EU-US
              Privacy Shield-avtalet.
            </p>
            <p>
              Vi kan lämna ut nödvändig personlig information till myndigheter
              som polis, skattemyndigheter eller andra myndigheter om företaget
              är skyldigt att göra det enligt lag. Ett exempel på laglig
              utlämning är att bekämpa penningtvätt och finansiering av
              terrorism.
            </p>
          </p>
          <p className="terms_last_updated_heading">
            <strong>Säkerhet</strong>
            <br />
            Din säkerhet är viktig och vi vidtar därför adekvata tekniska och
            organisatoriska säkerhetsåtgärder för att säkerställa att dina
            personuppgifter inte kan missbrukas, förloras eller kasseras av
            obehöriga.
          </p>
          <p className="terms_last_updated_heading">
            <strong>Ändringar av denna personuppgiftspolicy</strong>
            <br />
            Företaget förbehåller sig rätten att göra ändringar i denna
            personuppgiftspolicy. Alla ändringar av denna personuppgiftspolicy
            kommer att publiceras på vår webbplats.
          </p>
          <p className="terms_last_updated_heading w-100">
            <strong>Hur man kontaktar oss</strong>
            <br />
            Kontakta oss om du har några frågor angående vår
            personuppgiftspolicy:
            <ul>
              <li>
                E-post till{" "}
                <Link to="#" style={{ marginLeft: "0.3rem" }}>
                  info@balancepoint.se
                </Link>
              </li>
              <li>
                För ytterligare kontaktinformation besök vår hemsida{" "}
                <a href="https://www.balancepoint.se/">
                  https://www.balancepoint.se/
                </a>
              </li>
            </ul>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
