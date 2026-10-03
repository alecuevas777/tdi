/* =========================================================
   TDI — SCRIPT
   Índice:
   1. Navbar: cambio de estado al hacer scroll
   2. Menú móvil (hamburguesa)
   3. Cierre de menú móvil al navegar / con Escape
   4. Reveal de bloques con IntersectionObserver
   5. Testimonios: destacado + lista
   6. Formulario de contacto
   7. Galería de la ficha de propiedad
   8. Carrusel del hero
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

  /* -------------------------------------------------------
     1. NAVBAR: CAMBIO DE ESTADO AL HACER SCROLL
     Solo escribe en el DOM cuando el estado realmente cambia.
     ------------------------------------------------------- */
  var header = document.getElementById("siteHeader");
  var SCROLL_THRESHOLD = 40;
  var headerIsScrolled = false;

  function updateHeaderState() {
    var nextState = window.scrollY > SCROLL_THRESHOLD;
    if (nextState === headerIsScrolled) return;
    headerIsScrolled = nextState;
    header.classList.toggle("is-scrolled", nextState);
  }

  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState, { passive: true });

  /* -------------------------------------------------------
     2. MENÚ MÓVIL (HAMBURGUESA)
     ------------------------------------------------------- */
  var menuToggle = document.getElementById("menuToggle");
  var mobileNav = document.getElementById("mobileNav");
  var mobileNavOverlay = document.getElementById("mobileNavOverlay");
  var mobileNavClose = document.getElementById("mobileNavClose");

  function openMobileNav() {
    mobileNav.classList.add("is-open");
    mobileNavOverlay.classList.add("is-open");
    menuToggle.setAttribute("aria-expanded", "true");
    mobileNav.setAttribute("aria-hidden", "false");
    mobileNavOverlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeMobileNav() {
    mobileNav.classList.remove("is-open");
    mobileNavOverlay.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    mobileNav.setAttribute("aria-hidden", "true");
    mobileNavOverlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  menuToggle.addEventListener("click", function () {
    var isOpen = mobileNav.classList.contains("is-open");
    if (isOpen) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  });

  mobileNavOverlay.addEventListener("click", closeMobileNav);
  mobileNavClose.addEventListener("click", closeMobileNav);

  var desktopNavQuery = window.matchMedia("(min-width: 1025px)");
  function handleDesktopNavChange(event) {
    if (event.matches) closeMobileNav();
  }
  if (desktopNavQuery.addEventListener) {
    desktopNavQuery.addEventListener("change", handleDesktopNavChange);
  } else if (desktopNavQuery.addListener) {
    desktopNavQuery.addListener(handleDesktopNavChange);
  }

  /* -------------------------------------------------------
     3. CIERRE DE MENÚ MÓVIL AL NAVEGAR / CON ESCAPE
     ------------------------------------------------------- */
  var mobileLinks = mobileNav.querySelectorAll("a");
  mobileLinks.forEach(function (link) {
    link.addEventListener("click", closeMobileNav);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && mobileNav.classList.contains("is-open")) {
      closeMobileNav();
    }
  });

  /* -------------------------------------------------------
     La URL se queda en la raíz: el ancla solo desplaza.
     ------------------------------------------------------- */
  function cleanAddressBar() {
    if (!location.hash) return;
    history.replaceState(null, "", location.pathname + location.search);
  }

  function scrollToSection(hash) {
    if (!hash || hash === "#") return;
    var behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    if (hash === "#top") {
      window.scrollTo({ top: 0, behavior: behavior });
      return;
    }
    var target = document.querySelector(hash);
    if (!target) return;
    target.scrollIntoView({ behavior: behavior, block: "start" });
  }

  document.addEventListener("click", function (event) {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    var link = event.target.closest("a[href^='#']");
    if (!link || (link.target && link.target !== "_self")) return;
    var hash = link.getAttribute("href");
    if (!hash || hash === "#") return;
    if (hash !== "#top" && !document.querySelector(hash)) return;
    event.preventDefault();
    scrollToSection(hash);
    cleanAddressBar();
  });

  if (location.hash) {
    var initialHash = location.hash;
    scrollToSection(initialHash);
    cleanAddressBar();
  }

  /* -------------------------------------------------------
     4. REVEAL DE BLOQUES CON INTERSECTIONOBSERVER
     Dispara al entrar al viewport. No anima secciones enteras
     ni lee scrollY para interpolar. Una sola vez por bloque.
     ------------------------------------------------------- */
  var revealTargets = document.querySelectorAll("[data-reveal]");
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function showReveal(target) {
    target.classList.add("is-visible");
  }

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealTargets.forEach(showReveal);
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          showReveal(entry.target);
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    revealTargets.forEach(function (target) {
      revealObserver.observe(target);
    });
  }

  /* -------------------------------------------------------
     5. TESTIMONIOS
     ------------------------------------------------------- */
  var reviewMain = document.getElementById("reviewMain");
  var reviewList = document.getElementById("reviewList");
  var reviewDots = document.getElementById("reviewDots");
  var reviewCounter = document.getElementById("reviewCounter");

  if (reviewMain && reviewList && reviewDots && reviewCounter) {
    var reviews = [
      {
        author: "Daniela Garrido",
        postedAt: "2026-06-05",
        rating: 5,
        comment: "Recomendado 100%, Bruno era el corredor de la propiedad que arrendé y cero problemas, siempre estuvo ahí para los requerimientos solicitados, buena comunicación, resolución de problemas y cordial.",
      },
      {
        author: "Miguel Angel Estrada Friz",
        postedAt: "2026-06-05",
        rating: 5,
        comment: "Excelente atención. Explicación detallada y clara. Han solucionado de manera oportuna los problemas que he presentado. Recomendado.",
      },
      {
        author: "Eduardo Arteaga",
        postedAt: "2026-08-05",
        rating: 5,
        comment: "Desde hace varios años que trabajo con TDI Gestión Inmobiliaria, ellos se encargan de arrendar y gestionar un par de propiedades que tengo en Concepción. Yo ya no vivo en Concepción por lo tanto necesito de alguien en quien pueda…",
      },
      {
        author: "Nicolas Diaz",
        postedAt: "2026-06-05",
        rating: 5,
        comment: "Excelente servicio y muy profesionales, Bruno sabe mucho del tema y te ayuda en el proceso paso a paso, 100% recomendados.",
      },
      {
        author: "Bruno Villarroel Corales",
        postedAt: "2026-06-05",
        rating: 5,
        comment: "Excelente atención, servicios integrales y muy completos, realizaron una posesión efectiva y regularizaron la propiedad.",
      },
      {
        author: "Christian Rodriguez",
        postedAt: "2026-06-05",
        rating: 5,
        comment: "He trabajado con Bruno y he tenido una muy buena experiencia, muy profesional y responsable!!!",
      },
      {
        author: "Juan Viveros Villarroel",
        postedAt: "2026-06-05",
        rating: 5,
        comment: "Me realizaron una escritura de compraventa y una posesión efectiva y todo resultó muy bien.",
      },
      {
        author: "Pedro Arriagada",
        postedAt: "2026-06-05",
        rating: 5,
        comment: "Recomiendo al 100% el corretaje de Bruno!, entiende perfecto y rápidamente el requerimiento que uno necesita.",
      },
      {
        author: "Anneliese Ortiz",
        postedAt: "2026-06-05",
        rating: 5,
        comment: "Me han asesorado como arrendadora y como arrendataria y ambas experiencias han sido muy buenas. Muy profesionales en la gestión.",
      },
      {
        author: "Katalina Pezo",
        postedAt: "2026-06-05",
        rating: 5,
        comment: "A mi familia le realizaron una subdivisión de una propiedad y todo salió excelente.",
      },
      {
        author: "Luis Cisterna Rubilar",
        postedAt: "2026-06-05",
        rating: 5,
        comment: "Al momento de buscar propiedades para arrendar la inmobiliaria TDI fue un gran apoyo y guía dentro de ese proceso, orientación y calidez; es por eso que los prefiero y ya cumpliré 2 años arrendando con ellos. Recomendado 100% y a Bruno.",
      },
      {
        author: "Patricia Cárcamo Isla",
        postedAt: "2026-06-05",
        rating: 5,
        comment: "Trabajo muy comprometido.",
      },
      {
        author: "Paulita Linda",
        postedAt: "2026-07-05",
        rating: 5,
        comment: "Muy preocupados, siempre atentos y responsables en la gestión inmobiliaria, siempre responden y ayudan con todo tipo de consultas. 100% recomendables.",
      },
    ];

    var activeReview = 0;
    var TRANSITION_MS = 260;

    function reviewInitials(name) {
      var parts = name.trim().split(/\s+/);
      var first = parts[0] ? parts[0].charAt(0) : "";
      var last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : "";
      return (first + last).toUpperCase();
    }

    function stars(count) {
      return "★★★★★".slice(0, count);
    }

    function escapeHtml(value) {
      return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    }

    function reviewRole(postedAt) {
      var from = new Date(postedAt + "T12:00:00");
      var now = new Date();
      if (isNaN(from.getTime()) || from > now) {
        return "Google";
      }

      var months = (now.getFullYear() - from.getFullYear()) * 12 + (now.getMonth() - from.getMonth());
      if (now.getDate() < from.getDate()) months -= 1;
      if (months < 0) months = 0;

      var days = Math.floor((now.getTime() - from.getTime()) / 86400000);
      var years = Math.floor(months / 12);
      var label;

      if (days < 1) {
        label = "Hoy";
      } else if (days < 7) {
        label = days === 1 ? "Hace 1 día" : "Hace " + days + " días";
      } else if (months < 1) {
        var weeks = Math.max(1, Math.floor(days / 7));
        label = weeks === 1 ? "Hace 1 semana" : "Hace " + weeks + " semanas";
      } else if (years >= 1) {
        label = years === 1 ? "Hace 1 año" : "Hace " + years + " años";
      } else {
        label = months === 1 ? "Hace un mes" : "Hace " + months + " meses";
      }

      return "Google · " + label;
    }

    function paintFeatured(index) {
      var review = reviews[index];
      reviewMain.innerHTML =
        '<div class="review-rating" aria-label="' + review.rating + ' de 5">' + stars(review.rating) + "</div>" +
        '<p class="review-comment">' + escapeHtml(review.comment) + "</p>" +
        '<div class="review-author">' +
          '<span class="review-initials" aria-hidden="true">' + escapeHtml(reviewInitials(review.author)) + "</span>" +
          '<div class="review-author-info">' +
            '<span class="review-name">' + escapeHtml(review.author) + "</span>" +
            '<span class="review-role">' + escapeHtml(reviewRole(review.postedAt)) + "</span>" +
          "</div>" +
        "</div>";
    }

    function renderFeatured(index, animate) {
      if (!animate || prefersReducedMotion) {
        paintFeatured(index);
        return;
      }
      reviewMain.classList.add("is-transitioning");
      window.setTimeout(function () {
        paintFeatured(index);
        reviewMain.classList.remove("is-transitioning");
      }, TRANSITION_MS);
    }

    var SIDE_LIST_COUNT = 3;

    function renderList() {
      reviewList.innerHTML = "";
      var shown = 0;
      for (var offset = 1; offset < reviews.length && shown < SIDE_LIST_COUNT; offset++) {
        var index = (activeReview + offset) % reviews.length;
        var review = reviews[index];
        var item = document.createElement("li");
        item.innerHTML =
          '<button type="button" class="review-item" data-index="' + index + '" aria-label="Ver testimonio de ' + escapeHtml(review.author) + '">' +
            '<span class="review-initials review-initials-sm" aria-hidden="true">' + escapeHtml(reviewInitials(review.author)) + "</span>" +
            '<span class="review-item-body">' +
              '<span class="review-item-top">' +
                '<span class="review-name-sm">' + escapeHtml(review.author) + "</span>" +
                '<span class="review-rating-sm">' + stars(review.rating) + "</span>" +
              "</span>" +
              '<span class="review-role-sm">' + escapeHtml(reviewRole(review.postedAt)) + "</span>" +
              '<span class="review-excerpt">' + escapeHtml(review.comment) + "</span>" +
            "</span>" +
          "</button>";
        reviewList.appendChild(item);
        shown += 1;
      }

      reviewList.querySelectorAll("button[data-index]").forEach(function (button) {
        button.addEventListener("click", function () {
          setActiveReview(parseInt(button.getAttribute("data-index"), 10));
        });
      });
    }

    function renderDots() {
      reviewDots.innerHTML = "";
      reviews.forEach(function (_, index) {
        var dot = document.createElement("button");
        dot.type = "button";
        dot.className = "reviews-dot" + (index === activeReview ? " is-active" : "");
        dot.setAttribute("role", "tab");
        dot.setAttribute("aria-label", "Testimonio " + (index + 1));
        dot.setAttribute("aria-selected", index === activeReview ? "true" : "false");
        dot.addEventListener("click", function () {
          setActiveReview(index);
        });
        reviewDots.appendChild(dot);
      });
    }

    function renderCounter() {
      var total = String(reviews.length).padStart(2, "0");
      var current = String(activeReview + 1).padStart(2, "0");
      reviewCounter.textContent = current + " / " + total;
    }

    function setActiveReview(index) {
      if (index === activeReview) return;
      activeReview = index;
      renderFeatured(activeReview, true);
      renderList();
      renderDots();
      renderCounter();
    }

    renderFeatured(activeReview, false);
    renderList();
    renderDots();
    renderCounter();
  }

  /* -------------------------------------------------------
     6. FORMULARIO DE CONTACTO
     Valida en cliente y envía a la API PHP (SMTP Hostinger).
     ------------------------------------------------------- */
  var contactForm = document.getElementById("contactForm");
  var contactSuccess = document.getElementById("contactSuccess");
  var contactSubmit = document.getElementById("contactSubmit");
  var contactSubmitLabel = document.getElementById("contactSubmitLabel");

  if (contactForm && contactSuccess && contactSubmit && contactSubmitLabel) {
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var consultaField = document.getElementById("contactConsulta");
    var correoField = document.getElementById("contactCorreo");
    var honeypotField = document.getElementById("contactHp");

    function fieldOf(input) {
      return input.closest(".form-field");
    }

    function setFieldError(input, hasError) {
      var field = fieldOf(input);
      if (!field) return;
      field.classList.toggle("has-error", hasError);
    }

    function setSubmitError(visible) {
      contactForm.classList.toggle("has-submit-error", visible);
    }

    function validateContactForm() {
      var isValid = true;

      contactForm.querySelectorAll("[required]").forEach(function (input) {
        var empty = !input.value.trim();
        setFieldError(input, empty);
        if (empty) isValid = false;
      });

      if (correoField && correoField.value.trim() && !emailPattern.test(correoField.value.trim())) {
        setFieldError(correoField, true);
        isValid = false;
      }

      return isValid;
    }

    contactForm.querySelectorAll(".form-input, .form-select, .form-textarea").forEach(function (input) {
      input.addEventListener("input", function () {
        setFieldError(input, false);
        setSubmitError(false);
      });
      input.addEventListener("change", function () {
        setFieldError(input, false);
        setSubmitError(false);
      });
    });

    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();
      setSubmitError(false);

      if (!validateContactForm()) {
        var firstError = contactForm.querySelector(".has-error .form-input, .has-error .form-select, .has-error .form-textarea");
        if (firstError) firstError.focus();
        return;
      }

      var payload = {
        name: document.getElementById("contactNombre").value.trim(),
        phone: document.getElementById("contactTelefono").value.trim(),
        email: correoField ? correoField.value.trim() : "",
        location: document.getElementById("contactComuna").value.trim(),
        service: consultaField ? consultaField.value : "",
        message: document.getElementById("contactMensaje").value.trim(),
        tdi_hp: honeypotField ? honeypotField.value : ""
      };

      contactSubmit.disabled = true;
      contactSubmitLabel.textContent = "Enviando...";

      if (window.location.protocol === "file:") {
        setSubmitError(true);
        contactSubmit.disabled = false;
        contactSubmitLabel.textContent = "Enviar consulta";
        return;
      }

      var contactUrl = new URL("api/contact.php", window.location.href).href;

      fetch(contactUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
        .then(function (response) {
          return response.json().then(function (body) {
            return { ok: response.ok && body && body.ok === true, body: body };
          });
        })
        .then(function (result) {
          if (!result.ok) {
            throw new Error("delivery-failed");
          }

          contactForm.classList.add("is-hidden");
          contactSuccess.hidden = false;
          window.requestAnimationFrame(function () {
            contactSuccess.classList.add("is-visible");
          });
          contactForm.reset();
        })
        .catch(function () {
          setSubmitError(true);
        })
        .finally(function () {
          contactSubmit.disabled = false;
          contactSubmitLabel.textContent = "Enviar consulta";
        });
    });
  }

  /* -------------------------------------------------------
     7. GALERÍA DE LA FICHA DE PROPIEDAD
     ------------------------------------------------------- */
  document.querySelectorAll("[data-gallery]").forEach(function (gallery) {
    var slides = gallery.querySelectorAll("img");
    var dots = gallery.querySelectorAll("[data-gallery-dot]");
    var prev = gallery.querySelector("[data-gallery-prev]");
    var next = gallery.querySelector("[data-gallery-next]");
    var index = 0;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (img, i) {
        img.classList.toggle("is-active", i === index);
      });
      dots.forEach(function (dot, i) {
        var active = i === index;
        dot.classList.toggle("is-active", active);
        dot.setAttribute("aria-selected", active ? "true" : "false");
      });
    }

    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
      });
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        show(i);
      });
    });
  });

  /* ============================================
   * 8. Carrusel del hero
   * ============================================ */
  (function initHeroCarousel() {
    var hero = document.querySelector("[data-hero]");
    if (!hero) return;

    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var prev = hero.querySelector("[data-hero-prev]");
    var next = hero.querySelector("[data-hero-next]");
    var index = 0;
    var timer = null;
    var delay = 7000;
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function showHero(nextIndex) {
      if (!slides.length) return;
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        var active = i === index;
        slide.classList.toggle("is-active", active);
        if (active) {
          slide.removeAttribute("aria-hidden");
          slide.removeAttribute("inert");
        } else {
          slide.setAttribute("aria-hidden", "true");
          slide.setAttribute("inert", "");
        }
      });
      dots.forEach(function (dot, i) {
        var active = i === index;
        dot.classList.toggle("is-active", active);
        dot.setAttribute("aria-selected", active ? "true" : "false");
      });
    }

    function stopHero() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    function startHero() {
      stopHero();
      if (reduce || slides.length < 2) return;
      timer = window.setInterval(function () {
        showHero(index + 1);
      }, delay);
    }

    if (prev) {
      prev.addEventListener("click", function () {
        showHero(index - 1);
        startHero();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        showHero(index + 1);
        startHero();
      });
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        showHero(i);
        startHero();
      });
    });

    hero.addEventListener("mouseenter", stopHero);
    hero.addEventListener("focusin", stopHero);
    hero.addEventListener("mouseleave", function () {
      startHero();
    });
    hero.addEventListener("focusout", function (event) {
      if (!hero.contains(event.relatedTarget)) startHero();
    });

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stopHero();
      else startHero();
    });

    showHero(0);
    startHero();
  })();

});
