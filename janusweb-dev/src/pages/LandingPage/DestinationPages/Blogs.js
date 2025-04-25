import React from "react";
import "../LandingPage.css";
import { useHistory } from "react-router-dom";
import LandingHeader from "../LandingHeader/LandingHeader";
import LandingFooter from "../LandingFooter/LandingFooter";

const ImagePath =
  "https://media.istockphoto.com/id/1985248194/sv/foto/businessman-using-laptop-computer-with-digital-padlock-on-internet-technology-networking.jpg?s=1024x1024&w=is&k=20&c=-s90dwfDlZr_2OxAG_W1fG4uBQN7bDGRRP6_Jocia48=";

const Blogs = () => {
  const history = useHistory();
  const blogs = [
    {
      image: require("../../../assets/img/destinationPagesImages/blog1.png"),
      description:
        "Behöver du en underhållsplan – men vet inte var du ska börja? Många fastighetsägare skjuter på det viktiga arbetet, ofta för att det känns för stort. Men det måste inte vara krångligt. I den här artikeln får du tips för att komma igång. ",
    },
    {
      image: require("../../../assets/img/destinationPagesImages/blog2.png"),
      description:
        "Trygg ekonomi och välskött fastighet – En bra underhållsplan hjälper styrelsen att planera smart, undvika oväntade kostnader och ta hand om fastigheten på lång sikt. Vi visar hur ni gör, steg för steg.",
    },
    {
      image: require("../../../assets/img/destinationPagesImages/blog3.png"),
      description:
        "En genomtänkt underhållsplan gör det enklare att ta hand om fastigheten på ett strukturerat  sätt. I den här guiden går vi igenom hur du skapar, uppdaterar och använder en underhållsplan för att säkerställa att byggnaden förblir i gott skick över tid.",
    },
    {
      image: require("../../../assets/img/destinationPagesImages/blog4.png"),
      description:
        "Undvik dyra misstag – fem fallgropar i BRF:ens underhållsplanering En underhållsplan är ett viktigt verktyg för föreningens ekonomi och fastighetens skick. Men många BRF:er gör misstag som kan bli kostsamma i längden. I den här artikeln går vi igenom fem vanliga fel – och hur ni undviker dem.",
    },
    {
      image: require("../../../assets/img/destinationPagesImages/blog5.png"),
      description:
        "Så bygger ni en hållbar underhållsplan En genomtänkt och uppdaterad underhållsplan sparar både pengar och huvudvärk. Här får din BRF en överskådlig guide till långsiktig planering, smart samordning och digitala verktyg som förenklar arbetet.",
    },
    {
      image: require("../../../assets/img/destinationPagesImages/blog6.png"),
      description:
        "Framgångsrika byggprojekt börjar med rätt plan Byggprojekt i en BRF kräver mer än bara hantverk – det handlar om planering, struktur och kommunikation. Här får ni en tydlig sammanfattning av stegen som hjälper er att genomföra projektet smidigt, från behovsanalys till slutbesiktning.",
    },
  ];

  return (
    <>
      <LandingHeader />
      <div className="blog-container">
        <h2>Blog</h2>
        <div className="blog-items">
          {blogs.map((blog, index) => (
            <div
              className="blog-item cursor-pointer"
              key={index}
              onClick={() => {
                // history.push(`blog-${index + 1}`);
                window.open(`/blog-${index + 1}`, "_blank");
              }}
            >
              <img src={blog.image} alt={`Blog Image ${index + 1}`} />
              <p>{blog.description}</p>
            </div>
          ))}
        </div>
      </div>
      <LandingFooter />
    </>
  );
};

export default Blogs;
