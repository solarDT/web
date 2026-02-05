document.addEventListener("DOMContentLoaded", () => {
  loadMenuFromJSON();
});

function loadMenuFromJSON() {
  fetch("content.json")
    .then(res => res.json())
    .then(data => {
      setHeaderContent(data.site);
      applyBranding(data.branding);
      buildMenu(data.menu);
    })
    .catch(err => console.error("JSON load error:", err));
}

function setHeaderContent(site) {
  document.getElementById("logo-mark").textContent = site.logo_mark;
  document.getElementById("site-title").textContent = site.title;
  document.getElementById("site-subtitle").textContent = site.subtitle;
}

function applyBranding(brand) {
  const header = document.getElementById("site-header");
  if (brand.ribbon_bg) header.style.background = brand.ribbon_bg;
}

function isCommentToken(value) {
  if (typeof value !== "string") return false;
  const trimmed = value.trim();
  return (
    trimmed.startsWith("%%") ||
    (trimmed.startsWith("%") && trimmed.endsWith("%") && trimmed.length > 1)
  );
}

function buildMenu(menuItems) {
  const container = document.getElementById("menu-container");
  container.innerHTML = "";

  (menuItems || []).forEach(item => {
    if (!item || isCommentToken(item.label)) return;

    const submenuItems = Array.isArray(item.submenu)
      ? item.submenu.filter(sub => sub && !isCommentToken(sub.label))
      : [];

    const li = document.createElement("li");
    li.classList.add("nav-item");

    if (submenuItems.length > 0) {
      li.classList.add("nav-has-dropdown");

      const btn = document.createElement("button");
      btn.classList.add("nav-link-button");
      btn.textContent = item.label;

      const dropdown = document.createElement("ul");
      dropdown.classList.add("nav-dropdown");

      submenuItems.forEach(sub => {
        const s = document.createElement("li");
        const a = document.createElement("a");
        a.href = sub.link;
        a.textContent = sub.label;
        s.appendChild(a);
        dropdown.appendChild(s);
      });

      li.appendChild(btn);
      li.appendChild(dropdown);
    } else {
      const a = document.createElement("a");
      a.href = item.link || "#";
      a.textContent = item.label;
      li.appendChild(a);
    }

    container.appendChild(li);
  });
}
