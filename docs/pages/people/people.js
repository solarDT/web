document.addEventListener("DOMContentLoaded", () => {
  fetch("people.json")
    .then(res => res.json())
    .then(data => {
      applyPeopleHero(data.hero);
      document.getElementById("people-title").textContent = data.title;
      document.getElementById("people-subtitle").textContent = data.subtitle;
      buildPeopleSections(data.sections);
    });
});

function buildPeopleSections(sections) {
  const container = document.getElementById("people-container");
  container.innerHTML = "";

  sections.forEach(sec => {
    const wrapper = document.createElement("section");
    wrapper.classList.add("people-section");
    wrapper.id = sec.id;

    applyBackground(wrapper, sec);

    const inner = document.createElement("div");
    inner.classList.add("section-inner");

    const title = document.createElement("h2");
    title.textContent = sec.title;
    title.style.color = sec.title_color || "#e5e7eb";
    title.style.fontSize = sec.title_size || "1.5rem";
    inner.appendChild(title);

    if (sec.type === "leader") renderLeaderSection(inner, sec);
    if (sec.type === "researchers") renderResearcherSection(inner, sec);
    if (sec.type === "group") renderGroupSection(inner, sec);

    wrapper.appendChild(inner);
    container.appendChild(wrapper);
  });
}

function applyBackground(el, sec) {
  if (sec.background_type === "color") {
    el.style.background = sec.background_value;
  }
  if (sec.background_type === "gradient") {
    el.style.background = sec.background_value;
  }
  if (sec.background_type === "image") {
    el.style.background = `url("${sec.background_image}") center/cover no-repeat`;
  }
}


/*******************************************
 HERO SECTION
********************************************/

function applyPeopleHero(hero) {
  const heroSection = document.getElementById("people-hero");
  const overlay = document.getElementById("people-hero-overlay");

  // Background type
  if (hero.background_type === "color") {
    heroSection.style.background = hero.background_value;
  }
  if (hero.background_type === "gradient") {
    heroSection.style.background = hero.background_value;
  }
  if (hero.background_type === "image") {
    heroSection.style.background =
      `url("${hero.background_image}") center/cover no-repeat`;
  }

  // Optional overlay
  overlay.style.background = hero.overlay ? hero.overlay_color : "transparent";
}


/*******************************************
 LEADERS (FULL WIDTH BLUR FRAME)
********************************************/
function renderLeaderSection(parent, sec) {
  (sec.items || []).forEach(item => {

    const frame = document.createElement("div");
    frame.classList.add("frame-full");

    // Apply dominant color background
    if (item.image) {
      getDominantColor(item.image, (color) => {
        const gradient = `linear-gradient(135deg, ${color}, rgba(0,0,0,0.55))`;
        frame.style.setProperty("--auto-bg", gradient);
      });
    }

    const content = document.createElement("div");
    content.classList.add("frame-content", "leader-block");
    if (item.image_side === "right") content.classList.add("right");

    const img = document.createElement("img");
    img.src = item.image;
    applyImageSizeAndShape(img, item, sec);

    const info = document.createElement("div");
    info.classList.add("leader-info");

    info.innerHTML = `
      <h3>${item.name}</h3>
      <p><strong>${item.role}</strong></p>
    `;

    (item.description || []).forEach(t => {
      const p = document.createElement("p");
      p.textContent = t;
      info.appendChild(p);
    });

    const links = document.createElement("div");
    links.classList.add("leader-links");
    (item.links || []).forEach(l => {
      const a = document.createElement("a");
      a.href = l.link;
      a.textContent = l.label;
      links.appendChild(a);
    });
    info.appendChild(links);

    if (item.image_side === "right") {
      content.appendChild(info);
      content.appendChild(img);
    } else {
      content.appendChild(img);
      content.appendChild(info);
    }

    frame.appendChild(content);
    parent.appendChild(frame);
  });
}


/*******************************************
 RESEARCHERS (FULL WIDTH BLUR FRAME)
********************************************/
function renderResearcherSection(parent, sec) {
  (sec.items || []).forEach(item => {

    const row = document.createElement("div");
    row.classList.add("researcher-row");

    // Dominant color background
    if (item.image) {
      getDominantColor(item.image, (color) => {
        const gradient = `linear-gradient(135deg, ${color}, rgba(0,0,0,0.55))`;
        row.style.setProperty("--auto-bg", gradient);
      });
    }

    const content = document.createElement("div");
    content.classList.add("researcher-content");

    const img = document.createElement("img");
    img.src = item.image;
    applyImageSizeAndShape(img, item, sec);

    const text = document.createElement("div");
    text.classList.add("researcher-text");

    const h3 = document.createElement("h3");
    h3.textContent = item.name;
    text.appendChild(h3);

    const role = document.createElement("p");
    role.innerHTML = `<strong>${item.title || ""}</strong>`;
    text.appendChild(role);

    const bio = document.createElement("p");
    bio.textContent = item.bio || "";
    text.appendChild(bio);

    if (item.link) {
      const a = document.createElement("a");
      a.href = item.link;
      a.textContent = "View Profile";
      a.style.color = "#22c3ff";
      text.appendChild(a);
    }

    content.appendChild(img);
    content.appendChild(text);

    row.appendChild(content);
    parent.appendChild(row);
  });
}



/*******************************************
 GROUP (LIGHT GRADIENT FRAME)
********************************************/
function renderGroupSection(parent, sec) {
  const frame = document.createElement("div");
  frame.classList.add("group-frame");

  const grid = document.createElement("div");
  grid.classList.add("group-grid");

  (sec.items || []).forEach(item => {
    const card = document.createElement("div");
    card.classList.add("group-card");

    const img = document.createElement("img");
    img.src = item.image;
    applyImageSizeAndShape(img, item, sec);
    card.appendChild(img);

    const name = document.createElement("div");
    name.classList.add("name");
    name.textContent = item.name;
    card.appendChild(name);

    const des = document.createElement("div");
    des.classList.add("designation");
    des.textContent = item.designation;
    card.appendChild(des);

    grid.appendChild(card);
  });

  frame.appendChild(grid);
  parent.appendChild(frame);
}

/*******************************************
 UNIVERSAL IMAGE SIZE + SHAPE
********************************************/
function applyImageSizeAndShape(img, item, sec) {
  const w = item.image_width || sec.image_width;
  if (w) img.style.width = w;

  const shape = (item.image_shape || sec.image_shape || "rounded").toLowerCase();
  img.classList.remove("shape-rounded", "shape-square", "shape-circle");

  if (shape === "circle") img.classList.add("shape-circle");
  else if (shape === "square") img.classList.add("shape-square");
  else img.classList.add("shape-rounded");
}

function getDominantColor(imageSrc, callback) {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = imageSrc;

  img.onload = function () {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 20;
    canvas.height = 20;

    ctx.drawImage(img, 0, 0, 20, 20);
    const data = ctx.getImageData(0, 0, 20, 20).data;

    let r=0, g=0, b=0;
    for (let i=0; i<data.length; i+=4) {
      r += data[i];
      g += data[i+1];
      b += data[i+2];
    }

    r = Math.round(r / (data.length/4));
    g = Math.round(g / (data.length/4));
    b = Math.round(b / (data.length/4));

    callback(`rgb(${r},${g},${b})`);
  };
}

