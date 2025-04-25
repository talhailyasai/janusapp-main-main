export const prcingDetails = {
  Standard: {
    desc: "Prisplan för upp till 5 fastigheter för att hantera underhållsplan.",
    features: [
      "Underhållsplan (skapa, uppdatera, analysera)",
      "Fastighetsregister",
      "Inga funktionsbegränsningar",
      "Ingen bindningstid",
      "5 Fastighet, 15 byggnader, 50 komponenter, 1 GB lagring",
    ],
    price: 99,
    priceId: "price_1Nza7kEs3213AcM8nK3tjAnv",
  },
  "Standard Plus": {
    desc: "Som Standard, men fler objekt och mer utrymme. Utöver underhållsplan har du även skötselplan.",
    features: [
      "Allt i Standard samt upp till:",
      "15 Fastigheter",
      "50 Byggnadsverk",
      "250 Komponenter",
      "10 GB lagring för filer och bilder",
      "Skötselplan med analys",
    ],
    price: 159,
    priceId: "price_1NzbXKEs3213AcM8S2GJOLEX",
  },
};

export const plans = {
  prod_OnAXslApK3GQUp: "Standard Plus",
  prod_OnAS7z7LR5AVQ1: "Standard",
};
