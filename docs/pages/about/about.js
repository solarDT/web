document.addEventListener("DOMContentLoaded", () => {
  loadAboutJSON();
});

function loadAboutJSON() {
  fetch("about.json")
    .then(res => res.json())
    .then(data => {
      setInlineText(document.getElementById("about-title"), data.title);
      setInlineText(document.getElementById("about-subtitle"), data.subtitle);

      applyBackground(document.getElementById("about-hero"), data);

      buildSections(data.sections);
      scrollToHash();
      window.addEventListener("hashchange", scrollToHash);
    })
    .catch(err => console.error("About page JSON load error:", err));
}

function applyBackground(el, sec) {
  if (sec.background_type === "color") {
    el.style.background = sec.background_value;
  }
  if (sec.background_type === "image") {
    el.style.background = `url("${sec.background_image}") center/cover no-repeat`;
  }
}

function scrollToHash() {
  const hash = decodeURIComponent(window.location.hash || "").replace(/^#/, "");
  if (!hash) return;

  const el = document.getElementById(hash);
  if (!el) return;

  requestAnimationFrame(() => {
    el.scrollIntoView({ block: "start" });
  });
}

function normalizeStringArray(content) {
  if (!content) return [];
  if (Array.isArray(content)) return content.map(item => String(item ?? ""));
  return [String(content)];
}

function toCssLength(value) {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value === "number" && Number.isFinite(value)) return `${value}px`;
  return String(value);
}

function applyImageModifiers(img, wrapper, sec) {
  if (!img || !wrapper || !sec) return;

  const side = (sec.image_side || sec.image_position || "").toLowerCase();
  if (side === "left") wrapper.classList.add("image-left");

  const width = toCssLength(sec.image_width ?? sec.image_size);
  if (width) img.style.width = width;

  const height = toCssLength(sec.image_height);
  if (height) img.style.height = height;

  const maxWidth = toCssLength(sec.image_max_width);
  if (maxWidth) img.style.maxWidth = maxWidth;

  const objectFit = sec.image_object_fit || sec.image_fit;
  if (objectFit) img.style.objectFit = objectFit;

  const shiftX = toCssLength(sec.image_shift_x ?? sec.image_shift);
  const shiftY = toCssLength(sec.image_shift_y);

  if (shiftX || shiftY) {
    img.style.transform = `translate(${shiftX || "0px"}, ${shiftY || "0px"})`;
  }
}

function setInlineText(el, text) {
  if (!el) return;
  el.textContent = "";
  appendInlineMarkup(el, text);
}

function appendInlineMarkup(target, text) {
  if (!target) return;

  const str = String(text ?? "");
  let i = 0;

  while (i < str.length) {
    if (str.startsWith("**", i)) {
      const close = str.indexOf("**", i + 2);
      if (close === -1) {
        target.appendChild(document.createTextNode(str.slice(i)));
        break;
      }

      const strong = document.createElement("strong");
      appendInlineMarkup(strong, str.slice(i + 2, close));
      target.appendChild(strong);
      i = close + 2;
      continue;
    }

    if (str[i] === "<") {
      const close = str.indexOf(">", i + 1);
      if (close === -1) {
        target.appendChild(document.createTextNode(str.slice(i)));
        break;
      }

      const em = document.createElement("em");
      appendInlineMarkup(em, str.slice(i + 1, close));
      target.appendChild(em);
      i = close + 1;
      continue;
    }

    let next = str.length;
    const nextBold = str.indexOf("**", i);
    if (nextBold !== -1 && nextBold < next) next = nextBold;
    const nextItalic = str.indexOf("<", i);
    if (nextItalic !== -1 && nextItalic < next) next = nextItalic;

    target.appendChild(document.createTextNode(str.slice(i, next)));
    i = next;
  }
}

function renderContent(container, content) {
  const lines = normalizeStringArray(content);
  let list = null;

  lines.forEach(line => {
    if (!line.trim()) {
      list = null;
      return;
    }

    const bulletMatch = line.trimStart().match(/^#\s*(.*)$/);

    if (bulletMatch) {
      if (!list) {
        list = document.createElement("ul");
        list.className = "about-bullets";
        container.appendChild(list);
      }

      const li = document.createElement("li");
      appendInlineMarkup(li, bulletMatch[1]);
      list.appendChild(li);
      return;
    }

    list = null;

    const p = document.createElement("p");
    appendInlineMarkup(p, line);
    container.appendChild(p);
  });
}

function buildSections(sections) {
  const container = document.getElementById("about-container");
  container.innerHTML = "";

  sections.forEach(sec => {
    const div = document.createElement("section");
    div.classList.add("about-section");
    div.id = sec.id;

    applyBackground(div, sec);
    if (sec.font_color) div.style.color = sec.font_color;

    // Section title
    const h2 = document.createElement("h2");
    setInlineText(h2, sec.title);
    div.appendChild(h2);

    if (sec.type === "text") {
      const wrapper = document.createElement("div");
      wrapper.classList.add("about-text");

      renderContent(wrapper, sec.content);

      div.appendChild(wrapper);
    }

    if (sec.type === "text-image") {
      const wrapper = document.createElement("div");
      wrapper.classList.add("about-mixed");

      const textDiv = document.createElement("div");
      textDiv.classList.add("about-text", "about-mixed__text");

      renderContent(textDiv, sec.content);

      const img = document.createElement("img");
      img.classList.add("about-mixed__image");
      img.src = sec.image;
      img.alt = sec.title;

      wrapper.appendChild(textDiv);
      wrapper.appendChild(img);

      applyImageModifiers(img, wrapper, sec);
      div.appendChild(wrapper);
    }

    if (sec.type === "domains-impact") {
      const wrapper = document.createElement("div");
      wrapper.classList.add("about-domains-impact");

      const domainsBlock = document.createElement("div");
      domainsBlock.classList.add("about-domains-block");

      if (sec.domains?.title) {
        const h3 = document.createElement("h3");
        setInlineText(h3, sec.domains.title);
        domainsBlock.appendChild(h3);
      }

      const domainsGrid = document.createElement("div");
      domainsGrid.classList.add("about-domain-grid");

      (sec.domains?.cards || []).forEach((card, index) => {
        const article = document.createElement("article");
        article.classList.add("about-domain-card");

        const badge = document.createElement("div");
        badge.classList.add("about-domain-badge");
        badge.textContent = String(index + 1);
        article.appendChild(badge);

        const h4 = document.createElement("h4");
        setInlineText(h4, card.title || "");
        article.appendChild(h4);

        const p = document.createElement("p");
        setInlineText(p, card.text || "");
        article.appendChild(p);

        domainsGrid.appendChild(article);
      });

      domainsBlock.appendChild(domainsGrid);
      wrapper.appendChild(domainsBlock);

      const impactFrame = document.createElement("div");
      impactFrame.classList.add("about-impact-frame");

      if (sec.impact?.title) {
        const h3 = document.createElement("h3");
        setInlineText(h3, sec.impact.title);
        impactFrame.appendChild(h3);
      }

      const impactGrid = document.createElement("div");
      impactGrid.classList.add("about-impact-grid");

      (sec.impact?.items || []).forEach((text, index) => {
        const card = document.createElement("div");
        card.classList.add("about-impact-card");

        const icon = document.createElement("div");
        icon.classList.add("about-impact-icon");
        icon.textContent = String(index + 1);
        card.appendChild(icon);

        const p = document.createElement("p");
        setInlineText(p, text);
        card.appendChild(p);

        impactGrid.appendChild(card);
      });

      impactFrame.appendChild(impactGrid);
      wrapper.appendChild(impactFrame);

      div.appendChild(wrapper);
    }

    if (sec.type === "priority-list") {
      const wrapper = document.createElement("div");
      wrapper.classList.add("about-priorities");

      if (sec.lead) {
        const lead = document.createElement("p");
        lead.classList.add("about-lead");
        setInlineText(lead, sec.lead);
        wrapper.appendChild(lead);
      }

      const list = document.createElement("div");
      list.classList.add("about-priority-list");

      const items = Array.isArray(sec.items) ? sec.items : [];
      items.forEach(item => {
        const row = document.createElement("div");
        row.classList.add("about-priority");

        const content = document.createElement("div");
        content.classList.add("about-priority-content");

        if (typeof item === "string") {
          const p = document.createElement("p");
          setInlineText(p, item);
          content.appendChild(p);
        } else if (item && typeof item === "object") {
          if (item.title) {
            const h3 = document.createElement("h3");
            setInlineText(h3, item.title);
            content.appendChild(h3);
          }
          if (item.text) {
            const p = document.createElement("p");
            setInlineText(p, item.text);
            content.appendChild(p);
          }
        }

        row.appendChild(content);
        list.appendChild(row);
      });

      wrapper.appendChild(list);
      div.appendChild(wrapper);
    }

    container.appendChild(div);
  });
}
