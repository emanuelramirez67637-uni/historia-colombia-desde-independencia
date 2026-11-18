(function () {
  if (document.querySelector(".back-to-routes")) return;
  const back = document.createElement("a");
  back.className = "back-to-routes";
  back.href = "../index.html";
  back.setAttribute("aria-label", "Volver a recorridos extensos");
  back.setAttribute("title", "Volver a recorridos extensos");
  back.textContent = "←";
  document.body.appendChild(back);
})();
