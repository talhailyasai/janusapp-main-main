import React from "react";
import "../LandingPage.css";
import LandingHeader from "../LandingHeader/LandingHeader";
import LandingFooter from "../LandingFooter/LandingFooter";

const Features = () => {
  const features = [
    {
      title: "Komplett fastighetsregister",
      description:
        "Bygg upp en strukturerad databas över era fastigheter med Janus hierarkiska modell. Fastighetsregistret är grunden i systemet och kopplar samman all information.",
      points: [
        "Hierarkisk struktur: Fastighet > Byggnadsverk > Komponent",
        "Enkelt att skapa och hantera fastigheter via flera olika metoder",
        "Möjlighet att registrera detaljerad information för bättre analyser",
        "Koppling till underhållsposter och ronderingar på rätt nivå",
      ],
      image: require("../../../assets/img/destinationPagesImages/feature1.png"),
    },
    {
      title: "Intelligent underhållsplanering",
      description:
        "Skapa, importera och hantera underhållsplaner utifrån era specifika behov. Systemet är utformat för både nybörjare och erfarna användare.",
      points: [
        "Tre huvudsakliga arbetssätt: skapa från start, importera befintlig plan eller arbeta med standardiserade poster",
        "Avancerade inställningar för planering, rapportering och analys",
        "Möjlighet att arbeta med underhållspaket för effektivare hantering",
        "Stöd för indexuppräkning och avsättningsberäkningar",
      ],
      image: require("../../../assets/img/destinationPagesImages/feature2.png"),
    },
    {
      title: "Kvalitetssäkrad rondering",
      description:
        "Digitalisera er fastighetsskötsel och säkerställ att alla kontroller utförs enligt plan. Systemet hanterar automatiskt planering, uppföljning och analys.",
      points: [
        "Skapa anpassade skötselplaner baserade på komponenter",
        "Arbeta med färdiga texter för tillsyn och skötsel",
        "Stöd för AFF-avtal genom komponentpaket",
        "Mobilapp för effektivt arbete i fält",
      ],
      image: require("../../../assets/img/destinationPagesImages/feature3.png"),
    },
    {
      title: "Kraftfull mobilapp",
      description:
        "Utför och dokumentera ronderingar direkt på plats med den integrerade mobilappen. Perfekt för tekniker och fastighetsskötare.",
      points: [
        "Automatisk planering baserad på användarens behörigheter",
        "Kvalitetssäkring av utförda tillsyner och skötselåtgärder",
        "Möjlighet att använda streckkoder för extra säkerhet",
        "Automatisk beräkning av nästa datum för tillsyn/skötsel",
      ],
      image: require("../../../assets/img/destinationPagesImages/feature4.png"),
    },
    {
      title: "Smart analys och uppföljning",
      description:
        "Få en tydlig överblick över era fastigheter och underhållsbehov genom kraftfulla analysverktyg.",
      points: [
        "Kartvy med statusindikation för alla byggnader",
        "Analys av uppfyllnadsgrad för ronderingsuppdrag",
        "Beräkning av avsättningsbehov för underhåll",
        "Anpassningsbara rapporter med eget innehåll",
      ],
      image: require("../../../assets/img/destinationPagesImages/feature5.png"),
    },
  ];

  return (
    <>
      <LandingHeader />
      <div className="features-page">
        <div className="features-title">
          <h2 style={{ fontSize: "20px" }}>
            Intelligent fastighetsförvaltning
          </h2>
          <br />
          <p>
            Förenkla och digitalisera er underhållsplanering och
            fastighetsskötsel
          </p>
          <p>
            Janus är ett komplett verktyg för fastighetsägare, konsulter och
            entreprenörer som vill effektivisera arbetet med underhållsplaner
            och skötselplaner. Med Janus kan ni samarbeta sömlöst,
            kvalitetssäkra era processer och alltid ha uppdaterad information om
            era fastigheter.
          </p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`feature-item ${index % 2 !== 0 ? "bg-white" : ""}`}
            >
              <div
                className={`feature-content ${
                  index % 2 === 0 ? "content-reverse" : ""
                }`}
              >
                <div className="feature-text">
                  <h3>{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                  <ul className="feature-points">
                    {feature.points.map((point, idx) => (
                      <li key={idx}>{point}</li>
                    ))}
                  </ul>
                </div>
                <div className="feature-image">
                  <img src={feature.image} alt={feature.title} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="steps-section">
          <div className="steps-container">
            <div className="step-item">
              <div className="step-number">1</div>
              <h3>Skapa konto</h3>
              <p>
                Det går snabbt att skapa ett konto. Blir du inte nöjd kan du
                enkelt avsluta ditt abonnemang
              </p>
            </div>
            <div className="step-item">
              <div className="step-number">2</div>
              <h3>Följ guiden</h3>
              <p>
                Genom guiden skapar du enkelt all data du behöver med förenklade
                steg
              </p>
            </div>
            <div className="step-item">
              <div className="step-number">3</div>
              <h3>Planera & analysera</h3>
              <p>
                Skapa egna rapporter, analysera utfall, justera dina planer
                utifrån verkligt behov
              </p>
            </div>
          </div>
        </div>
        {/* <div className="" style={{ height: "100px", background: "" }}></div> */}
      </div>
      <LandingFooter />
    </>
  );
};

export default Features;
