document.addEventListener("DOMContentLoaded", () => {
  loadProjects();
});

async function loadProjects() {
  const list = document.getElementById("projects-list");

  try {
    const res = await fetch("ongoing_list.json");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    renderProjects(data.projects || []);
  } catch (err) {
    list.innerHTML = `<div class="empty-state">Unable to load projects (${err.message}).</div>`;
  }
}

function renderProjects(projects) {
  const list = document.getElementById("projects-list");
  list.innerHTML = "";

  if (!projects.length) {
    list.innerHTML = `<div class="empty-state">No projects published yet.</div>`;
    return;
  }

  projects.forEach(project => {
    const card = document.createElement("article");
    card.className = "project-card";

    const textCol = document.createElement("div");
    textCol.className = "project-card__text";

    const eyebrow = document.createElement("p");
    eyebrow.className = "eyebrow";
    eyebrow.textContent = project.status || "Project";
    textCol.appendChild(eyebrow);

    const title = document.createElement("h2");
    title.textContent = project.title;
    textCol.appendChild(title);

    const summary = document.createElement("p");
    summary.textContent = project.summary || "Full description is available in the Word document.";
    textCol.appendChild(summary);

    if (Array.isArray(project.tags) && project.tags.length) {
      const meta = document.createElement("div");
      meta.className = "project-card__meta";
      project.tags.forEach(tag => {
        const span = document.createElement("span");
        span.className = "tag";
        span.textContent = tag;
        meta.appendChild(span);
      });
      textCol.appendChild(meta);
    }

    const actions = document.createElement("div");
    actions.className = "project-card__actions";

    const detailsBtn = document.createElement("a");
    detailsBtn.classList.add("btn", "btn-primary");
    detailsBtn.href = `project_detail.html?id=${encodeURIComponent(project.id)}`;
    detailsBtn.textContent = "View details";
    actions.appendChild(detailsBtn);

    if (project.word_file) {
      const hint = document.createElement("span");
      hint.className = "file-hint";
      const fileName = project.word_file.split("/").pop();
      hint.textContent = `Source: ${fileName}`;
      actions.appendChild(hint);
    }

    textCol.appendChild(actions);

    const mediaCol = buildImageStrip(project.images, project.title);

    card.appendChild(textCol);
    card.appendChild(mediaCol);

    list.appendChild(card);
  });
}

function buildImageStrip(images = [], title = "Project") {
  const media = document.createElement("div");
  media.className = "project-card__media";

  const previews = images && images.length ? images : [null];

  previews.slice(0, 3).forEach((src, index) => {
    const thumb = document.createElement("div");
    thumb.className = "media-thumb";

    if (src) {
      const img = document.createElement("img");
      img.src = src;
      img.alt = `${title} preview ${index + 1}`;
      thumb.appendChild(img);
    } else {
      const placeholder = document.createElement("div");
      placeholder.style.height = "100%";
      placeholder.style.display = "grid";
      placeholder.style.placeItems = "center";
      placeholder.style.color = "#cbd5f5";
      placeholder.style.fontSize = "0.9rem";
      placeholder.textContent = "Preview image";
      thumb.appendChild(placeholder);
    }

    media.appendChild(thumb);
  });

  return media;
}
