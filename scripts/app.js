const content = window.HISTORIA_CONTENT;
const timeline = document.querySelector("#timeline");
const peopleGrid = document.querySelector("#people-grid");
const dialog = document.querySelector("#detail-dialog");

function renderTimeline(filter = "todos") {
  const events = filter === "todos" ? content.events : content.events.filter((event) => event.category === filter);
  timeline.innerHTML = events.map((event, index) => `
    <article class="timeline-card" tabindex="0" data-event="${content.events.indexOf(event)}">
      <time>${event.year}</time>
      <h3>${event.title}</h3>
      <p>${event.summary}</p>
    </article>
  `).join("");
}

function renderPeople() {
  peopleGrid.innerHTML = content.people.map((person) => `
    <a class="person-card" href="paginas/personaje.html?nombre=${person.slug}" ${person.image ? `style="background-image:linear-gradient(180deg, transparent 15%, rgba(23,25,29,.94)), url('${person.image}')"` : ""}>
      <span>${person.role}</span>
      <h3>${person.name}</h3>
      <p>${person.text}</p>
    </a>
  `).join("");
}

function renderAttacks() {
  document.querySelector("#attacks-grid").innerHTML = content.attacks.map((attack) => `
    <article class="attack-card">
      <time>${attack.year}</time>
      <h3>${attack.title}</h3>
      <p>${attack.summary}</p>
      <button type="button" data-attack="${content.attacks.indexOf(attack)}">Ver responsabilidad y contexto</button>
    </article>
  `).join("");
}

function openEvent(index) {
  const event = content.events[index];
  if (!event) return;
  document.querySelector("#detail-period").textContent = `${event.period} · ${event.year}`;
  document.querySelector("#detail-title").textContent = event.title;
  document.querySelector("#detail-summary").textContent = event.summary;
  document.querySelector("#detail-context").textContent = event.context;
  document.querySelector("#detail-impact").textContent = event.impact;
  dialog.showModal();
  try { localStorage.setItem("ultimaConsulta", event.title); } catch (_) {}
}

function openAttack(index) {
  const attack = content.attacks[index];
  if (!attack) return;
  document.querySelector("#detail-period").textContent = `${attack.location} · ${attack.year}`;
  document.querySelector("#detail-title").textContent = attack.title;
  document.querySelector("#detail-summary").textContent = attack.summary;
  document.querySelector("#detail-context").textContent = attack.responsible;
  document.querySelector("#detail-impact").textContent = "Las víctimas, sus familias y las investigaciones siguen siendo parte central de la memoria histórica. Las responsabilidades deben comprobarse mediante sentencias, archivos judiciales y fuentes institucionales.";
  dialog.showModal();
  try { localStorage.setItem("ultimaConsulta", attack.title); } catch (_) {}
}

renderTimeline();
renderPeople();
renderAttacks();

document.querySelectorAll(".filter").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    renderTimeline(button.dataset.filter);
  });
});

timeline.addEventListener("click", (event) => {
  const card = event.target.closest(".timeline-card");
  if (card) openEvent(Number(card.dataset.event));
});
timeline.addEventListener("keydown", (event) => {
  if ((event.key === "Enter" || event.key === " ") && event.target.closest(".timeline-card")) {
    event.preventDefault();
    openEvent(Number(event.target.closest(".timeline-card").dataset.event));
  }
});

document.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

document.querySelector("#random-event").addEventListener("click", () => {
  openEvent(Math.floor(Math.random() * content.events.length));
});

document.querySelector("#attacks-grid").addEventListener("click", (event) => {
  const button = event.target.closest("[data-attack]");
  if (button) openAttack(Number(button.dataset.attack));
});

const search = document.querySelector("#search");
const searchResults = document.querySelector("#search-results");
search.addEventListener("input", () => {
  const query = search.value.trim().toLowerCase();
  if (!query) {
    searchResults.innerHTML = "";
    return;
  }
  const eventMatches = content.events.filter((event) =>
    `${event.title} ${event.summary} ${event.period} ${event.year}`.toLowerCase().includes(query)
  );
  const attackMatches = content.attacks.filter((attack) =>
    `${attack.title} ${attack.summary} ${attack.location} ${attack.year}`.toLowerCase().includes(query)
  ).map((attack) => ({ title: attack.title, year: attack.year, period: attack.location, attackIndex: content.attacks.indexOf(attack) }));
  const peopleMatches = content.people.filter((person) =>
    `${person.name} ${person.role} ${person.text}`.toLowerCase().includes(query)
  ).map((person) => ({ title: person.name, year: person.role, summary: person.text }));
  const matches = eventMatches.concat(attackMatches).concat(peopleMatches);
  searchResults.innerHTML = matches.slice(0, 7).map((match) => {
    const eventIndex = content.events.indexOf(match);
    const attackIndex = match.attackIndex;
    return `<button class="search-result" type="button" ${eventIndex >= 0 ? `data-event="${eventIndex}"` : ""} ${attackIndex !== undefined ? `data-attack="${attackIndex}"` : ""}>
      <strong>${match.title}</strong><small>${match.year || match.period}</small>
    </button>`;
  }).join("") || "<p>No se encontraron resultados.</p>";
});

searchResults.addEventListener("click", (event) => {
  const result = event.target.closest("[data-event]");
  if (result) openEvent(Number(result.dataset.event));
  const attackResult = event.target.closest("[data-attack]");
  if (attackResult) openAttack(Number(attackResult.dataset.attack));
});

const menuButton = document.querySelector(".menu-button");
const nav = document.querySelector("#main-nav");
menuButton.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

const quiz = {
  question:"¿Dónde se declaró la independencia en 1810?",
  options:["Santa Fe de Bogotá","Cartagena","Popayán","Tunja"],
  answer:0,
  feedback:"Correcto: el proceso comenzó en Santa Fe con el cabildo abierto del 20 de julio."
};
document.querySelector("#quiz-question").textContent = quiz.question;
document.querySelector("#quiz-options").innerHTML = quiz.options.map((option, index) =>
  `<button type="button" data-answer="${index}">${option}</button>`
).join("");
document.querySelector("#quiz-options").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  const selected = Number(button.dataset.answer);
  const feedback = document.querySelector("#quiz-feedback");
  document.querySelectorAll("#quiz-options button").forEach((item) => item.classList.remove("correct", "wrong"));
  if (selected === quiz.answer) {
    button.classList.add("correct");
    feedback.textContent = quiz.feedback;
  } else {
    button.classList.add("wrong");
    feedback.textContent = "Revisa la cronología: el hecho clave ocurrió en Santa Fe de Bogotá.";
  }
});
