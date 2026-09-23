/* Grace Baby Class — site interactions */
(function () {
  "use strict";

  const header = document.getElementById("siteHeader");
  const nav = document.getElementById("mainNav");
  const navToggle = document.getElementById("navToggle");
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));
  const toTop = document.getElementById("toTop");

  /* ----- Mobile menu ----- */
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    navToggle.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  navLinks.forEach((link) =>
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    })
  );

  /* ----- Header shadow + back-to-top visibility ----- */
  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 8);
    toTop.classList.toggle("show", window.scrollY > 600);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  toTop.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );

  /* ----- Scrollspy: highlight active nav link ----- */
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) =>
          link.classList.toggle(
            "active",
            link.getAttribute("href") === "#" + entry.target.id
          )
        );
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );
  sections.forEach((section) => spy.observe(section));

  /* ----- Reveal-on-scroll animations ----- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  /* ----- Animated stat counters ----- */
  const counters = document.querySelectorAll(".stat-num");
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        counterObserver.unobserve(el);
        const target = Number(el.dataset.count || "0");
        const suffix = el.dataset.suffix || "";
        const duration = 1100;
        const start = performance.now();

        const tick = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    },
    { threshold: 0.6 }
  );
  counters.forEach((el) => counterObserver.observe(el));

  /* ----- Enquiry form ----- */
  const form = document.getElementById("enquiryForm");
  const note = document.getElementById("formNote");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    note.className = "form-note";

    const name = form.parentName.value.trim();
    const phone = form.phone.value.trim();
    const program = form.program.value;

    form.parentName.classList.toggle("invalid", !name);
    form.phone.classList.toggle("invalid", !/^[0-9]{10}$/.test(phone));
    form.program.classList.toggle("invalid", !program);

    if (!name || !/^[0-9]{10}$/.test(phone) || !program) {
      note.textContent = "Please fill in your name, a valid 10-digit phone number and choose a program.";
      note.classList.add("error");
      return;
    }

    const enquiry = {
      name,
      phone,
      program,
      message: form.message.value.trim(),
      sentAt: new Date().toISOString(),
    };

    // Store locally so the school can retrieve enquiries from this browser.
    const saved = JSON.parse(localStorage.getItem("gbc-enquiries") || "[]");
    saved.push(enquiry);
    localStorage.setItem("gbc-enquiries", JSON.stringify(saved));

    form.reset();
    note.textContent =
      "Thank you, " + name.split(" ")[0] + "! Your enquiry has been noted. We will reach out soon.";
    note.classList.add("success");
  });

  /* ----- Footer year ----- */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
