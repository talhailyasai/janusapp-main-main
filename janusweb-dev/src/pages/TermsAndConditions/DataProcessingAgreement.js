import React from "react";
import "./TermsConditions.css";
const DataProcessingAgreement = ({ organizationName }) => {
  return (
    <div className="data-process-page">
      {/* <p className="terms_condition_heading">Databehandlingsavtal</p> */}
      <p className="inleding_para">
        <b>Detta databehandlingsavtal</b> ("Avtalet") ingås mellan:
      </p>
      <p className="inleding_para">
        <b>Personuppgiftsansvarig: </b>
        {organizationName || ""}
        <br />
        <b>Personuppgiftsbiträde:</b> BalancePoint AB, 556788-8622
      </p>

      <div>
        <p className="Inledning_heading">Bakgrund:</p>
        <p className="inleding_para">
          Personuppgiftsansvarig och personuppgiftsbiträde har ingått ett avtal
          om att personuppgiftsbiträdet ska behandla personuppgifter på uppdrag
          av den personuppgiftsansvarige. Avtalet reglerar behandlingen av
          personuppgifter i enlighet med EU:s dataskyddsförordning (GDPR).
        </p>
      </div>

      <div>
        <p className="Inledning_heading">1. Ändamål med behandlingen</p>
        <p className="inleding_para">
          Personuppgiftsbiträdet ska behandla personuppgifter enbart för de
          ändamål som anges i detta avtal och i enlighet med den
          personuppgiftsansvariges instruktioner. Behandlingen sker för följande
          syften:
          <br />
          <li>Tjänsteleverans (SaaS)</li>
        </p>
      </div>

      <div>
        <p className="Inledning_heading">2. Personuppgifter som behandlas</p>
        <p className="inleding_para">
          De personuppgifter som behandlas enligt detta avtal är:
          <br />
          <li>
            Namn, adress, e-postadress, telefonnummer, IP-adresser,
            betalningsinformation (via Stripe)
          </li>
          Behandlingen omfattar följande typer av data:
          <br />
          <li> Identifikationsdata, kontaktinformation, användardata</li>{" "}
        </p>
      </div>

      <div>
        <p className="Inledning_heading">3. Rättslig grund för behandlingen</p>
        <p className="inleding_para">
          Personuppgiftsansvarig intygar att det finns en rättslig grund för
          behandlingen av personuppgifter, och att den rättsliga grunden är:
          <br />
          <li> Samtycke/ berättigat intresse</li>
        </p>
      </div>

      <div>
        <p className="Inledning_heading">4. Behandlingens varaktighet</p>
        <p className="inleding_para">
          Behandlingen ska pågå under följande period:
          <br />
          <li>Under avtalets löptid</li>
        </p>
      </div>

      <div>
        <p className="Inledning_heading">5. Instruktioner för behandling</p>
        <p className="inleding_para">
          Personuppgiftsbiträdet får endast behandla personuppgifterna enligt de
          specifika instruktioner som ges av den personuppgiftsansvarige.
          Eventuella ändringar eller tillägg till instruktionerna ska meddelas
          skriftligen.
        </p>
      </div>

      <div>
        <p className="Inledning_heading">6. Användning av underbiträden</p>
        <p className="inleding_para">
          Personuppgiftsbiträdet får inte anlita underbiträden utan föregående
          skriftligt godkännande från den personuppgiftsansvarige. Om
          underbiträden används, ska personuppgiftsbiträdet säkerställa att
          samma dataskyddsavtal gäller för underbiträdet som mellan
          huvudparterna.
        </p>
      </div>

      <div>
        <p className="Inledning_heading">7. Säkerhet och konfidentialitet</p>
        <p className="inleding_para">
          Personuppgiftsbiträdet förbinder sig att vidta lämpliga tekniska och
          organisatoriska åtgärder för att säkerställa att personuppgifterna
          skyddas mot obehörig åtkomst, förlust, förstörelse eller annan olaglig
          behandling. Detta omfattar, men är inte begränsat till:
          <br />
          <li>Kryptering, brandväggar, åtkomstkontroll, säkerhetskopiering</li>
        </p>
      </div>

      <div>
        <p className="Inledning_heading">
          8. Rättigheter för registrerade personer
        </p>
        <p className="inleding_para">
          Personuppgiftsbiträdet förbinder sig att bistå personuppgiftsansvarige
          i att upprätthålla de registrerades rättigheter enligt GDPR, inklusive
          rätten att få tillgång till, rätta, radera eller begränsa behandlingen
          av sina personuppgifter.
        </p>
      </div>

      <div>
        <p className="Inledning_heading">
          9. Anmälan om personuppgiftsincident
        </p>
        <p className="inleding_para">
          Personuppgiftsbiträdet ska omedelbart informera
          personuppgiftsansvarige om en säkerhetsincident som leder till
          obehörig åtkomst, förlust eller förändring av personuppgifter.
        </p>
      </div>

      <div>
        <p className="Inledning_heading">
          10. Tillgång till och radering av personuppgifter
        </p>
        <p className="inleding_para">
          Efter avslutat uppdrag, eller vid personuppgiftsansvariges begäran,
          ska personuppgiftsbiträdet säkerställa att alla personuppgifter
          antingen raderas eller returneras till den personuppgiftsansvarige, om
          inte annan lagstiftning kräver lagring.
        </p>
      </div>

      <div>
        <p className="Inledning_heading">11. Tillsyn och revision</p>
        <p className="inleding_para">
          Personuppgiftsansvarige har rätt att genomföra revisioner eller
          granskningar av personuppgiftsbiträdets efterlevnad av detta avtal,
          med skälig förvarning och utan att störa verksamheten.
        </p>
      </div>

      <div>
        <p className="Inledning_heading">12. Ansvar och skadestånd</p>
        <p className="inleding_para">
          Om personuppgiftsbiträdet inte följer villkoren i detta avtal, ska det
          vara ansvarigt för alla skador, förluster eller kostnader som uppstår
          för personuppgiftsansvarige till följd av detta.
        </p>
      </div>

      <div>
        <p className="Inledning_heading">13. Gällande rätt och tvister</p>
        <p className="inleding_para">
          Detta avtal regleras av svensk lag, och tvister som uppstår i samband
          med detta avtal ska lösas av domstol i Stockholm.
        </p>
      </div>
    </div>
  );
};

export default DataProcessingAgreement;
