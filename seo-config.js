/* =========================================================
   TDI — Configuración SEO / entorno
   ÚNICO valor JS del dominio: SITE_URL.

   Los crawlers de redes (WhatsApp, Facebook, LinkedIn) no
   ejecutan JavaScript. Si el dominio cambia, actualiza también
   las URLs absolutas de:
     - index.html (canonical, Open Graph, Twitter, JSON-LD)
     - sitemap.xml
     - robots.txt
   ========================================================= */
(function (global) {
  var SITE_URL = "https://tdigestion.cl";
  var host = (global.location && global.location.hostname) || "";
  var productionHosts = ["tdigestion.cl", "www.tdigestion.cl"];
  var isProduction = productionHosts.indexOf(host) !== -1;

  global.TDI_SEO = {
    siteName: "TDI",
    siteLegalName: "TDI Gestión Inmobiliaria",
    siteUrl: SITE_URL,
    title: "TDI | Corretaje, Administración, Obras y Arquitectura",
    description: "TDI integra corretaje, administración, obras y arquitectura para gestionar tu propiedad con un solo equipo, desde la compra hasta la administración.",
    ogDescription: "TDI integra corretaje, administración, obras y arquitectura para gestionar tu propiedad con un solo equipo.",
    ogImage: SITE_URL + "/assets/images/seo/tdi-og-image-1200x630.png",
    schemaLogo: SITE_URL + "/assets/images/seo/tdi-schema-logo-512x512.png",
    isProduction: isProduction
  };

  var robots = document.querySelector('meta[name="robots"]');
  if (robots) {
    robots.setAttribute("content", isProduction ? "index, follow" : "noindex, nofollow");
  }
})(window);
