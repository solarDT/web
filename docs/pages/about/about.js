document.addEventListener("DOMContentLoaded", () => {
  loadAboutJSON();
});

function loadAboutJSON() {
  fetch("about.json")
    .then(res => res.json())
    .then(data => {
      document.getElementById("about-title").textContent = data.title;
      document.getElementById("about-subtitle").textContent = data.subtitle;

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

function buildSections(sections) {
  const container = document.getElementById("about-container");
  container.innerHTML = "";

  sections.forEach(sec => {
    const div = document.createElement("section");
    div.classList.add("about-section");
    div.id = sec.id;

    applyBackground(div, sec);
    div.style.color = sec.font_color;

    // Section title
    const h2 = document.createElement("h2");
    h2.textContent = sec.title;
    div.appendChild(h2);

    if (sec.type === "text") {
      const wrapper = document.createElement("div");
      wrapper.classList.add("about-text");

      sec.content.forEach(p => {
        const el = document.createElement("p");
        el.textContent = p;
        wrapper.appendChild(el);
      });

      div.appendChild(wrapper);
    }

    if (sec.type === "text-image") {
      const wrapper = document.createElement("div");
      wrapper.classList.add("about-mixed");

      const textDiv = document.createElement("div");
      textDiv.classList.add("about-text");

      sec.content.forEach(p => {
        const el = document.createElement("p");
        el.textContent = p;
        textDiv.appendChild(el);
      });

      const img = document.createElement("img");
      img.src = sec.image;
      img.alt = sec.title;

      wrapper.appendChild(textDiv);
      wrapper.appendChild(img);

      div.appendChild(wrapper);
    }

    if (sec.type === "domains-impact") {
      const wrapper = document.createElement("div");
      wrapper.classList.add("about-domains-impact");

      const domainsBlock = document.createElement("div");
      domainsBlock.classList.add("about-domains-block");

      if (sec.domains?.title) {
        const h3 = document.createElement("h3");
        h3.textContent = sec.domains.title;
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
        h4.textContent = card.title || "";
        article.appendChild(h4);

        const p = document.createElement("p");
        p.textContent = card.text || "";
        article.appendChild(p);

        domainsGrid.appendChild(article);
      });

      domainsBlock.appendChild(domainsGrid);
      wrapper.appendChild(domainsBlock);

      const impactFrame = document.createElement("div");
      impactFrame.classList.add("about-impact-frame");

      if (sec.impact?.title) {
        const h3 = document.createElement("h3");
        h3.textContent = sec.impact.title;
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
        p.textContent = text;
        card.appendChild(p);

        impactGrid.appendChild(card);
      });

      impactFrame.appendChild(impactGrid);
      wrapper.appendChild(impactFrame);

      div.appendChild(wrapper);
    }

    container.appendChild(div);
  });
}
