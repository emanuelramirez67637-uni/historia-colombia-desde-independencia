(function () {
  if (document.querySelector("#main-nav")) return;

  const topbar = document.querySelector(".topbar");
  if (!topbar) return;

  const isPages = location.pathname.includes("/paginas/");
  const prefix = isPages ? "../" : "";
  const pagesPrefix = isPages ? "" : "paginas/";
  const file = location.pathname.toLowerCase();

  const items = [
    ["Inicio", prefix + "index.html", "index.html"],
    ["Historia completa", prefix + pagesPrefix + "historia.html", "historia.html"],
    ["Presidentes", prefix + pagesPrefix + "presidentes.html", "presidentes.html"],
    ["Narcotráfico", prefix + pagesPrefix + "narcotrafico.html", "narcotrafico.html"],
    ["Masacres", prefix + pagesPrefix + "masacres.html", "masacres.html"],
    ["Guerrillas", prefix + pagesPrefix + "conflicto.html", "conflicto.html"],
    ["Economía", prefix + pagesPrefix + "economia.html", "economia.html"],
    ["Cultura", prefix + pagesPrefix + "cultura.html", "cultura.html"],
    ["Personajes", prefix + pagesPrefix + "personajes.html", "personajes.html"]
  ];

  const button = document.createElement("button");
  button.type = "button";
  button.className = "menu-button";
  button.setAttribute("aria-expanded", "false");
  button.setAttribute("aria-controls", "main-nav");
  button.textContent = "Menú";

  const nav = document.createElement("nav");
  nav.id = "main-nav";
  nav.setAttribute("aria-label", "Navegación principal");

  items.forEach(([label, href, id]) => {
    const link = document.createElement("a");
    link.textContent = label;
    link.href = href;
    if (file.endsWith(id) || (id === "index.html" && (file.endsWith("/") || file.endsWith("index.html")))) {
      link.className = "active";
      link.setAttribute("aria-current", "page");
    }
    nav.appendChild(link);
  });

  topbar.appendChild(button);
  topbar.appendChild(nav);
  button.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    button.setAttribute("aria-expanded", String(open));
  });

  if (location.pathname.includes("/paginas/")) {
    const categoryPages = items.filter(([label]) => label !== "Inicio");
    const currentIndex = categoryPages.findIndex(([, , id]) => file.endsWith(id));
    if (currentIndex >= 0) {
      const toolbar = document.createElement("div");
      toolbar.className = "page-interaction";
      toolbar.innerHTML = `<label for="page-search">Buscar dentro de esta página</label><input id="page-search" type="search" placeholder="Ej.: víctimas, reforma, 1989..." autocomplete="off">`;
      const hero = document.querySelector(".article-hero");
      hero?.insertAdjacentElement("afterend", toolbar);

      const pageSearch = toolbar.querySelector("#page-search");
      pageSearch.addEventListener("input", () => {
        const query = pageSearch.value.trim().toLocaleLowerCase();
        document.querySelectorAll(".article-body > section").forEach((section) => {
          section.hidden = Boolean(query) && !section.textContent.toLocaleLowerCase().includes(query);
        });
      });

      const previous = categoryPages[(currentIndex - 1 + categoryPages.length) % categoryPages.length];
      const next = categoryPages[(currentIndex + 1) % categoryPages.length];
      const footerNav = document.createElement("nav");
      footerNav.className = "page-stepper";
      footerNav.innerHTML = `<a href="${previous[1]}"><span>Anterior</span><strong>${previous[0]}</strong></a><a href="${next[1]}"><span>Siguiente</span><strong>${next[0]}</strong></a>`;
      document.querySelector(".article-layout")?.appendChild(footerNav);
    }
  }
})();
