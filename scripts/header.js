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
    ["Economía y cultura", prefix + pagesPrefix + "economia-sociedad.html", "economia-sociedad.html"],
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
})();
