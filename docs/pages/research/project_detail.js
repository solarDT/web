document.addEventListener("DOMContentLoaded", () => {
  initProjectDetail();
});

async function initProjectDetail() {
  const statusEl = document.getElementById("docx-status");
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  try {
    const res = await fetch("ongoing_list.json");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const project = (data.projects || []).find(p => p.id === id) || (data.projects || [])[0];

    if (!project) {
      statusEl.textContent = "No project found.";
      return;
    }

    hydrateProject(project);
    await renderDocx(project);
  } catch (err) {
    statusEl.textContent = `Unable to load project (${err.message}).`;
  }
}

function hydrateProject(project) {
  document.title = project.title || "Project Detail";

  const crumb = document.getElementById("project-crumb");
  const titleEl = document.getElementById("project-title");
  const summaryEl = document.getElementById("project-summary");
  const tagsEl = document.getElementById("project-tags");
  const imagesEl = document.getElementById("project-images");
  const statusBadge = document.getElementById("project-status");

  crumb.textContent = project.title;
  titleEl.textContent = project.title;
  summaryEl.textContent = project.summary || "";
  statusBadge.textContent = project.status || "Project";

  tagsEl.innerHTML = "";
  if (Array.isArray(project.tags)) {
    project.tags.forEach(tag => {
      const span = document.createElement("span");
      span.className = "tag";
      span.textContent = tag;
      tagsEl.appendChild(span);
    });
  }

  imagesEl.innerHTML = "";
  const previews = project.images && project.images.length ? project.images : [null];

  previews.slice(0, 4).forEach((src, index) => {
    const wrap = document.createElement("div");
    wrap.className = "detail-image";

    if (src) {
      const img = document.createElement("img");
      img.src = src;
      img.alt = `${project.title} preview ${index + 1}`;
      wrap.appendChild(img);
    } else {
      wrap.style.display = "grid";
      wrap.style.placeItems = "center";
      wrap.style.color = "#cbd5f5";
      wrap.textContent = "Preview image";
    }

    imagesEl.appendChild(wrap);
  });
}

async function renderDocx(project) {
  const statusEl = document.getElementById("docx-status");
  const root = document.getElementById("docx-root");

  if (!project.word_file) {
    statusEl.textContent = "No Word document linked for this project.";
    return;
  }

  // Ensure dependencies are present, try to load fallback if missing
  if (!window.JSZip) {
    await loadScript("../../assets/vendor/jszip.min.js").catch(() => loadScript("https://unpkg.com/jszip@3.10.1/dist/jszip.min.js"));
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
    const res = await fetch(project.word_file);
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
    // If script already present, resolve once it loads
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
