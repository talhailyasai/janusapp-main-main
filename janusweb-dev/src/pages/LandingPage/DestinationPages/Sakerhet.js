import React from "react";
import "../LandingPage.css";
import LandingHeader from "../LandingHeader/LandingHeader";
import LandingFooter from "../LandingFooter/LandingFooter";

const Sakerhet = () => {
  return (
    <>
      <LandingHeader />
      <div className="destination-page">
        <p className="destination-title">Förtroende och säkerhet</p>
        <div>
          <h3>Dataskydd och integritet</h3>
          <p>
            Vi följer GDPR och tillämpar principen om dataminimering genom att
            endast lagra personuppgifter som är nödvändiga för tjänstens
            funktion. Vår datahanteringspolicy säkerställer att all insamlad
            information har ett specifikt och legitimt syfte.
          </p>
           <h3>Säker molninfrastruktur</h3>
          <p>
            Vår plattform drivs på Amazon Web Services (AWS), en infrastruktur
            som uppfyller internationella säkerhetscertifieringar inklusive ISO
            27001, SOC 2 och GDPR-kompatibilitet. Vi implementerar AWS
            säkerhetsfunktioner enligt branschens bästa praxis.
          </p>
           <h3>Omfattande säkerhetsåtgärder</h3>
          <p>
            All data skyddas genom TLS-kryptering under överföring och AES-256
            kryptering i lagrat tillstånd. Åtkomst till systemen regleras genom
            rollbaserad behörighetskontroll och multifaktorautentisering för
            administrativ personal.
          </p>
           <h3>Certifierad betalningshantering</h3>
          <p>
            Betalningstransaktioner hanteras uteslutande av Stripe, en PCI DSS
            Level 1-certifierad betaltjänstleverantör. Inga kreditkortsuppgifter
            lagras på våra servrar.
          </p>
           <h3>Proaktiv säkerhetshantering</h3>
          <p>
            Vi tillämpar kontinuerlig säkerhetsövervakning, regelbundna
            sårbarhetsanalyser och systematiska säkerhetsuppdateringar för att
            upprätthålla en robust skyddsnivå.
          </p>
        </div>
      </div>
      <LandingFooter />
    </>
  );
};

export default Sakerhet;
