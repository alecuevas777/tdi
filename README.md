# TDI Gestión Inmobiliaria

Landing de TDI: corretaje, administración, obras y arquitectura en un solo sitio.

Sitio en vivo: [https://tdigestion.cl/](https://tdigestion.cl/)

La página es estática (`index.html`, `styles.css`, `script.js`). El formulario de contacto envía los datos a `api/contact.php`, que manda el correo por SMTP.

Quedan fuera de Git: `api/.env`, `api/config.php`, `sitemap.xml` y los `.htaccess`. Las variables de la API están en `api/.env.example`, sin contraseñas.
