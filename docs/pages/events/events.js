document.addEventListener("DOMContentLoaded", () => {
  loadEvents();
});

async function loadEvents() {
  const list = document.getElementById("events-list");

  try {
    const res = await fetch("events.json");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const items = data.items;
    renderEvents(Array.isArray(items) ? items : []);
  } catch (err) {
    list.innerHTML = `<div class="empty-state">Unable to load events (${err.message}).</div>`;
  }
}

function resolveHref(href) {
  const raw = String(href || "").trim();
  if (!raw || raw === "#") return "";

  // Keep absolute URLs and absolute paths untouched
  if (/^(https?:)?\/\//i.test(raw) || raw.startsWith("mailto:") || raw.startsWith("/")) {
    return raw;
  }

  // Most JSON links in this repo are relative to docs/ (root). This page lives at docs/pages/events/.
  if (raw.startsWith("assets/") || raw.startsWith("pages/")) {
    return `../../${raw}`;
  }

  return raw;
}

function getYear(item) {
  if (!item) return "";
  if (item.year !== undefined && item.year !== null && String(item.year).trim() !== "") {
    return String(item.year).trim();
  }

  const dateText = String(item.date || "").trim();
  const match = dateText.match(/\b(19|20)\d{2}\b/);
  return match ? match[0] : "";
}

function buildEventCard(item) {
  const article = document.createElement("article");
  article.className = "event-item";

  const date = document.createElement("div");
  date.className = "event-date";

  const month = document.createElement("div");
  month.className = "event-month";
  month.textContent = item.month || "";

  const day = document.createElement("div");
  day.className = "event-day";
  day.textContent = item.day || "";

  date.appendChild(month);
  date.appendChild(day);

  const content = document.createElement("div");
  content.className = "event-item__content";

  const title = document.createElement("h2");
  title.textContent = item.title;
  content.appendChild(title);

  const desc = document.createElement("p");
  desc.textContent = item.text || "";
  content.appendChild(desc);

  const href = resolveHref(item.link);
  if (href) {
    const actions = document.createElement("div");
    actions.className = "event-actions";

    const a = document.createElement("a");
    a.className = "event-link";
    a.href = href;
    a.textContent = item.link_label || "View event";

    if (/\.pdf(\?|#|$)/i.test(href) || /^https?:\/\//i.test(href)) {
      a.target = "_blank";
      a.rel = "noopener";
    }

    actions.appendChild(a);
    content.appendChild(actions);
  }

  article.appendChild(date);
  article.appendChild(content);

  return article;
}

function renderEvents(items) {
  const list = document.getElementById("events-list");
  list.innerHTML = "";

  const cleaned = items.filter(item => item && item.title);

  if (!cleaned.length) {
    list.innerHTML = `<div class="empty-state">No events published yet.</div>`;
    return;
  }

  const grouped = new Map();
  cleaned.forEach(item => {
    const year = getYear(item) || "Other";
    if (!grouped.has(year)) grouped.set(year, []);
    grouped.get(year).push(item);
  });

  const years = Array.from(grouped.keys()).sort((a, b) => {
    if (a === "Other") return 1;
    if (b === "Other") return -1;

    const aNum = Number(a);
    const bNum = Number(b);

    const aIsNum = Number.isFinite(aNum);
    const bIsNum = Number.isFinite(bNum);

    if (aIsNum && bIsNum) return bNum - aNum;
    if (aIsNum) return -1;
    if (bIsNum) return 1;
    return String(a).localeCompare(String(b));
  });

  years.forEach(year => {
    const section = document.createElement("section");
    section.className = "events-year";

    const header = document.createElement("div");
    header.className = "events-year-header";

    const h2 = document.createElement("h2");
    h2.className = "events-year-title";
    h2.textContent = year;
    header.appendChild(h2);

    const rule = document.createElement("div");
    rule.className = "events-year-rule";
    header.appendChild(rule);

    section.appendChild(header);

    const yearList = document.createElement("div");
    yearList.className = "events-year-list";

    grouped.get(year).forEach(item => {
      yearList.appendChild(buildEventCard(item));
    });

    section.appendChild(yearList);
    list.appendChild(section);
  });
}
