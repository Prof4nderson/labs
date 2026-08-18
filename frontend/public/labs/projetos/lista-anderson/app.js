// Renderiza o site a partir do config.js — não é preciso editar este arquivo.
(function () {
  var scope = document.getElementById("scope");
  scope.classList.add("accent-" + (config.accent || "cyan"));

  document.getElementById("owner-name").textContent = config.ownerName;
  document.getElementById("site-title").textContent = config.siteTitle;
  document.getElementById("site-subtitle").textContent = config.siteSubtitle;
  document.getElementById("footer-text").textContent = config.footerText;
  document.getElementById("item-count").textContent =
    config.items.length + " itens";

  document.title = config.siteTitle;

  var placeholder =
    '<div class="placeholder">' +
    '<svg class="icon-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M10.41 10.41a2 2 0 1 1-2.83-2.83"/><line x1="13.5" y1="13.5" x2="6" y2="21"/>' +
    '<line x1="18" y1="12" x2="21" y2="15"/><path d="M3.59 3.59A2 2 0 0 0 3 5v14a2 2 0 0 0 2 2h14a2 2 0 0 0 1.41-.59"/>' +
    '<path d="M21 15V5a2 2 0 0 0-2-2H9"/><line x1="2" y1="2" x2="22" y2="22"/></svg>' +
    "<span>Adicione o caminho da foto</span></div>";

  function escapeHtml(text) {
    var div = document.createElement("div");
    div.textContent = text == null ? "" : text;
    return div.innerHTML;
  }

  var grid = document.getElementById("grid");
  var html = config.items
    .map(function (item) {
      var isLink = !!item.link;
      var tag = item.tag
        ? '<span class="neon-tag">' + escapeHtml(item.tag) + "</span>"
        : "";
      var media = item.image
        ? '<img src="' +
          escapeHtml(item.image) +
          '" alt="' +
          escapeHtml(item.title) +
          '" loading="lazy" />'
        : placeholder;

      var inner =
        '<div class="card-media">' +
        media +
        tag +
        "</div>" +
        '<div class="card-body">' +
        '<h3 class="card-title">' +
        escapeHtml(item.title) +
        "</h3>" +
        '<p class="card-desc">' +
        escapeHtml(item.description) +
        "</p>" +
        "</div>";

      if (isLink) {
        return (
          '<a class="glass-card card" href="' +
          escapeHtml(item.link) +
          '" target="_blank" rel="noopener noreferrer">' +
          inner +
          "</a>"
        );
      }
      return '<div class="glass-card card">' + inner + "</div>";
    })
    .join("");

  grid.innerHTML = html;
})();
