document.addEventListener("DOMContentLoaded", () => {
  loadNews();
});

async function loadNews() {
  const list = document.getElementById("news-list");

  try {
    const res = await fetch("news.json");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();

    if (data.page?.title) {
      document.title = data.page.title;
      const titleEl = document.getElementById("news-page-title");
      if (titleEl) titleEl.textContent = data.page.title;
    }

    const subtitleEl = document.getElementById("news-page-subtitle");
    if (subtitleEl) subtitleEl.textContent = data.page?.subtitle || "";

    renderNews(Array.isArray(data.items) ? data.items : []);
  } catch (err) {
    list.innerHTML = `<div class="empty-state">Unable to load news (${err.message}).</div>`;
  }
}

function renderNews(items) {
  const list = document.getElementById("news-list");
  list.innerHTML = "";

  const cleaned = items.filter(item => item && item.title && item.id);

  if (!cleaned.length) {
    list.innerHTML = `<div class="empty-state">No news published yet.</div>`;
    return;
  }

  cleaned.forEach(item => {
    const article = document.createElement("article");
    article.className = "news-item";

    const detailHref = `news_detail.html?id=${encodeURIComponent(item.id)}`;

    const mediaLink = document.createElement("a");
    mediaLink.className = "news-item__media";
    mediaLink.href = detailHref;
    mediaLink.setAttribute("aria-label", item.title);

    if (item.image) {
      const img = document.createElement("img");
      img.src = item.image;
      img.alt = item.title;
      mediaLink.appendChild(img);
    } else {
      const placeholder = document.createElement("div");
      placeholder.style.height = "100%";
      placeholder.style.display = "grid";
      placeholder.style.placeItems = "center";
      placeholder.style.color = "#cbd5f5";
      placeholder.style.fontSize = "0.95rem";
      placeholder.textContent = "News image";
      mediaLink.appendChild(placeholder);
    }

    const content = document.createElement("div");
    content.className = "news-item__content";

    const title = document.createElement("h2");
    title.textContent = item.title;
    content.appendChild(title);

    const meta = document.createElement("div");
    meta.className = "news-meta";

    if (item.date) {
      meta.appendChild(createMetaItem(item.date));
    }
    if (meta.childNodes.length) {
      content.appendChild(meta);
    }

    const summary = document.createElement("p");
    summary.textContent = item.summary || "";
    content.appendChild(summary);

    const actions = document.createElement("div");
    actions.className = "news-actions";

    const btn = document.createElement("a");
    btn.classList.add("btn", "btn-outline");
    btn.href = detailHref;
    btn.textContent = "Read more";
    actions.appendChild(btn);

    content.appendChild(actions);

    article.appendChild(mediaLink);
    article.appendChild(content);

    list.appendChild(article);
  });
}

function createMetaItem(text) {
  const wrap = document.createElement("span");
  wrap.className = "news-meta__item";

  const dot = document.createElement("span");
  dot.className = "news-meta__dot";
  dot.setAttribute("aria-hidden", "true");
  wrap.appendChild(dot);

  const label = document.createElement("span");
  label.textContent = String(text);
  wrap.appendChild(label);

  return wrap;
}
