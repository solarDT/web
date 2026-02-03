document.addEventListener("DOMContentLoaded", () => {
  initNewsDetail();
});

async function initNewsDetail() {
  const statusEl = document.getElementById("docx-status");
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  try {
    const res = await fetch("news.json");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const item = (data.items || []).find(n => n.id === id) || (data.items || [])[0];

    if (!item) {
      statusEl.textContent = "No news item found.";
      return;
    }

    hydrateNews(item);
    await renderDocx(item);
  } catch (err) {
    statusEl.textContent = `Unable to load news (${err.message}).`;
  }
}

function hydrateNews(item) {
  document.title = item.title || "News Detail";

  const crumb = document.getElementById("news-crumb");
  const badge = document.getElementById("news-badge");
  const titleEl = document.getElementById("news-title");
  const summaryEl = document.getElementById("news-summary");
  const imgEl = document.getElementById("news-image");
  const metaEl = document.getElementById("news-meta");

  if (crumb) crumb.textContent = item.title || "News";
  if (badge) badge.textContent = "News";
  if (titleEl) titleEl.textContent = item.title || "";
  if (summaryEl) summaryEl.textContent = item.summary || "";

  if (metaEl) {
    metaEl.innerHTML = "";
    if (item.date) {
      metaEl.appendChild(buildMeta("Date", item.date));
    }
  }

  if (imgEl) {
    if (item.image) {
      imgEl.src = item.image;
      imgEl.alt = item.title || "News image";
      imgEl.style.display = "block";
    } else {
      imgEl.style.display = "none";
    }
  }
}

function buildMeta(label, value) {
  const span = document.createElement("span");
  span.innerHTML = `<strong>${label}:</strong> ${escapeHtml(String(value))}`;
  return span;
}

function escapeHtml(str) {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

async function renderDocx(item) {
  const statusEl = document.getElementById("docx-status");
  const root = document.getElementById("docx-root");

  if (!item.word_file) {
    statusEl.textContent = "No Word document linked for this news item.";
    return;
  }

  // Ensure dependencies are present, try to load fallback if missing
  if (!window.JSZip) {
    await loadScript("../../assets/vendor/jszip.min.js").catch(() =>
      loadScript("https://unpkg.com/jszip@3.10.1/dist/jszip.min.js")
    );
  }

  if (!window.docx || typeof window.docx.renderAsync !== "function") {
    await loadScript("../../assets/vendor/docx-preview.min.js").catch(() =>
      loadScript("https://unpkg.com/docx-preview@0.3.1/dist/docx-preview.min.js")
    );
  }

  if (!window.docx || typeof window.docx.renderAsync !== "function") {
    statusEl.textContent = "Word renderer not available (docx-preview failed to load).";
    return;
  }

  statusEl.textContent = "Loading document…";

  try {
    const res = await fetch(item.word_file);
    if (!res.ok) throw new Error(`File not found (${res.status})`);

    const buffer = await res.arrayBuffer();
    await window.docx.renderAsync(buffer, root, null, { inWrapper: true });
    statusEl.remove();
  } catch (err) {
    statusEl.textContent = `Unable to render Word document: ${err.message}`;
  }
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      if (existing.dataset.loaded === "true") {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error(`Failed to load ${src}`)));
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.defer = true;
    script.onload = () => {
      script.dataset.loaded = "true";
      resolve();
    };
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
}
