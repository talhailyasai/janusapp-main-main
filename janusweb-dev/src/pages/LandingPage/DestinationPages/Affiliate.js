import React from "react";
import "../LandingPage.css";
import LandingHeader from "../LandingHeader/LandingHeader";
import LandingFooter from "../LandingFooter/LandingFooter";

const Affiliate = () => {
  return (
    <>
      <LandingHeader />
      <div className="destination-page" style={{ maxWidth: "56%" }}>
        <p className="destination-title">Affiliate/Partner</p>
        <div>
          <h2>
            Ny intäktskälla – Affiliate-partner för vår digitala
            underhållsplanslösning
          </h2>
          <h3>Skapa mervärde för dina kunder och din verksamhet samtidigt</h3>
          <p>
            Som konsult inom fastighetsförvaltning eller underhållsplanering kan
            du nu förvandla programvarukostnader till en intäktskälla genom att
            rekommendera vår SaaS-lösning för underhållsplaner till dina kunder.
          </p>
           <h3>Affärsmässiga fördelar för din konsultverksamhet</h3>
          <p>
            <strong>Transformera kostnader till intäkter:</strong> Ersätt
            utgifter för programvarulicenser med provisionsintäkter från
            kundrekommendationer
            <br />
            <strong>Långsiktig intäktsström:</strong> Erhåll kontinuerlig
            provision under hela kundens användningsperiod Komplett service utan
            merjobb: Vi hanterar teknisk implementation, kundservice och
            produktutveckling
          </p>
           <h3>Konkreta fördelar för dina kunder</h3>
          <p>
            <strong>Effektiviserad administration: </strong>Dokumenthantering
            och processer digitaliseras med minimal inlärningskurva
            <br />
            <strong> Strukturerad rapportering:</strong> Datadriven
            beslutsinformation om underhållsbehov med tydlig visualisering
            Centraliserad informationshantering: Eliminerar
            versionshanteringsproblem med realtidsuppdateringar och säker
            molnlagring
          </p>
           <h3>Enkel onboarding-process</h3>
          <p>
            <strong>Kostnadsfri registrering:</strong> Aktivera ditt
            affiliate-konto med personlig
            <br />
            <strong>Spårningslänk Kundintroduktion:</strong> Integrera vår
            lösning i ditt befintliga tjänsteutbud
            <br />
            <strong>Automatiserad provisionshantering:</strong>
            Transparent rapportering och regelbundna utbetalningar
          </p>
           <h3>Strategiskt partnerskap</h3>
          <p>
            Omvandla din affärsmodell genom att erbjuda moderna digitala
            lösningar som genererar intäkter samtidigt som de höjer kvaliteten
            på dina konsulttjänster.
          </p>
        </div>
      </div>
      <LandingFooter />
    </>
  );
};

export default Affiliate;
