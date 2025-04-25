import React from "react";
import "./style.css";
import Navbar from "./navbar";
import image1 from "../../assets/img/help/interface/image1.svg";
import image2 from "../../assets/img/help/interface/image2.svg";
import image3 from "../../assets/img/help/interface/image3.svg";
import image4 from "../../assets/img/help/interface/image4.svg";
import image5 from "../../assets/img/help/interface/image5.svg";

const Index = () => {
  return (
    <>
      <Navbar />
      <div className="how-it-works">
        <div className="help-interface-section">
          <div className="section-title">Gränssnitt - upplägg</div>
          <div className="images-section">
            <div className="images-row">
              <img src={image1} alt="" />
              <img src={image2} alt="" />
            </div>
          </div>
          <div className="work-section">
            <div className="para">
              <div>Gränssnittet i Janus är indelat i fyra områden:</div>
              <ol>
                <li>
                  Sidofält - åtkomst till startsidan samt olika funktioner och
                  tillhörande inställningar, därtill även en funktion för att
                  snabbinfoga
                </li>
                <li>
                  Sidhuvud - ikonfält för att komma åt hjälpfunktioner, ändra
                  språk, användaruppgifter samt logga ut
                </li>
                <li>
                  Huvudfönster - visar respektive funktion indelad i olika
                  flikar samt åtgärdsmeny för att hantera data
                </li>
                <li>
                  Redigeringsfält - innehåller detaljer om respektive post med
                  möjlighet att redigera data{" "}
                </li>
              </ol>
            </div>
          </div>
        </div>

        <div className="help-interface-section">
          <div className="section-title">Sidofältet</div>
          <div className="images-section">
            <div className="img-section">
              <img src={image3} alt="" />
            </div>
          </div>
          <div className="work-section">
            <div className="para">
              <div>Sidofältet i Janus är indelat i fyra delar:</div>
              <ol>
                <li>
                  Hemknapp - logotypen är en hemknapp som tar dig till
                  startsidan
                </li>
                <li>
                  Snabbinfoga - öppnar en meny från vänster som hjälper dig att
                  snabbt skapa nya poster i olika delar av systemet
                </li>
                <li>
                  Funktionsmeny - här ser du de funktioner som du har tillgång,
                  tillgången justeras av administratören i “Användarkonton”.
                  Beroende av vilken del av systemet du använder kommer en
                  fastighetslista visas nedan.
                </li>
              </ol>
            </div>
          </div>
        </div>

        <div className="help-interface-section">
          <div className="section-title">Sidhuvud</div>
          <div className="images-section">
            <div className="img-section">
              <img src={image4} alt="" />
            </div>
          </div>
          <div className="work-section">
            <div className="para">
              <div>Sidhuvudet har snabbåtkomst till 4 delar:</div>
              <ol>
                <li>Genväg till hjälpavsnitt samt till uppstartsguide</li>
                <li>Inställning för språk svenska/engelska</li>
                <li>Uppgifter för inloggad användare</li>
                <li>Logga ut</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="help-interface-section">
          <div className="section-title">Huvudfönster och redigeringsfält</div>
          <div className="images-section">
            <div className="img-section">
              <img src={image5} alt="" />
            </div>
          </div>
          <div className="work-section">
            <div className="para">
              <div>Huvudfönstret har i huvudsak 3 delar</div>
              <ol>
                <li>Flikindelning av information och/eller funktioner</li>
                <li>Visar data för aktuell post</li>
                <li>
                  Åtgärdsmeny - här visas möjliga åtgärder med aktuell post.
                  Menyn förändras beroende på vilken funktion och vilken flik
                  man befinner sig på.{" "}
                </li>
                <li>
                  När man ska ändra eller skapa ny data sker det genom att man
                  först väljer Åtgärdsmenyn därefter öppnas inmatningsfält från
                  höger där man anger data.
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
