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

    container.appendChild(div);
  });
}
