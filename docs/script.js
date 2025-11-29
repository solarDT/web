document.addEventListener("DOMContentLoaded", () => {
  loadContentJSON();
  const navToggle = document.querySelector(".nav-toggle");
  const mainNav = document.getElementById("main-nav");
  const dropdownButtons = document.querySelectorAll(".nav-link-button");

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  // Dropdown toggle for mobile / small screens
  dropdownButtons.forEach((btn) => {
    const parent = btn.closest(".nav-item");
    const dropdown = parent?.querySelector(".nav-dropdown");

    if (!dropdown) return;

    btn.addEventListener("click", (e) => {
      // Only use click behavior when in mobile mode (nav stacked)
      const isMobile = window.matchMedia("(max-width: 900px)").matches;
      if (!isMobile) return;

      e.preventDefault();
      const isOpen = dropdown.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", String(isOpen));
    });
  });
});

// Load and apply content from JSON file to the  -----------------------------------------------
function loadContentJSON() {
  fetch("content.json")
    .then(res => res.json())
    .then(data => {
      applyHeader(data.site, data.branding);
      buildMenu(data.menu);
      applyHero(data.hero, data.branding);
      applyHighlights(data.highlights);
      applyPartners(data.partners);
      applyDepartments(data.departments);
      applyNewsEvents(data.news_events);
      applyFooter(data.footer);


    })
    .catch(err => console.error("JSON load error:", err));
}


function applyHeader(site, branding) {
  const logoImg = document.getElementById("logo-image");
  const logoMark = document.getElementById("logo-mark");

  // If logo_image is provided → show image
  if (site.logo_image && site.logo_image.trim() !== "") {
    logoImg.src = site.logo_image;
    logoImg.style.display = "block";
    logoMark.style.display = "none";
  } 
  // Otherwise fallback to text mark
  else {
    logoMark.textContent = site.logo_mark;
    logoMark.style.display = "flex";
    logoImg.style.display = "none";
  }

  document.getElementById("site-title").textContent = site.title;
  document.getElementById("site-subtitle").textContent = site.subtitle;

  document.getElementById("site-header").style.background = branding.ribbon_bg;
}


// function buildMenu(menuItems) {
//   const container = document.getElementById("menu-container");
//   container.innerHTML = "";

//   menuItems.forEach(item => {
//     const li = document.createElement("li");
//     li.classList.add("nav-item");

//     if (item.submenu && item.submenu.length > 0) {
//       li.classList.add("nav-has-dropdown");

//       const btn = document.createElement("button");
//       btn.classList.add("nav-link-button");
//       btn.textContent = item.label;

//       const dropdown = document.createElement("ul");
//       dropdown.classList.add("nav-dropdown");

//       item.submenu.forEach(sub => {
//         const s = document.createElement("li");
//         const a = document.createElement("a");
//         a.href = sub.link;
//         a.textContent = sub.label;
//         s.appendChild(a);
//         dropdown.appendChild(s);
//       });

//       li.appendChild(btn);
//       li.appendChild(dropdown);

//     } else {
//       const a = document.createElement("a");
//       a.href = item.link || "#";
//       a.textContent = item.label;
//       li.appendChild(a);
//     }

//     container.appendChild(li);
//   });
// }

function buildMenu(menuItems) {
  const container = document.getElementById("menu-container");
  container.innerHTML = "";

  menuItems.forEach(item => {
    const li = document.createElement("li");
    li.classList.add("nav-item");

    if (item.submenu && item.submenu.length > 0) {
      li.classList.add("nav-has-dropdown");

      // If parent has link, use <a>, else use <button>
      let parentElement;

      if (item.link) {
        parentElement = document.createElement("a");
        parentElement.href = item.link;
        parentElement.classList.add("nav-link-button");
        parentElement.textContent = item.label;
      } else {
        parentElement = document.createElement("button");
        parentElement.classList.add("nav-link-button");
        parentElement.textContent = item.label;
      }

      const dropdown = document.createElement("ul");
      dropdown.classList.add("nav-dropdown");

      item.submenu.forEach(sub => {
        const s = document.createElement("li");
        const a = document.createElement("a");
        a.href = sub.link;
        a.textContent = sub.label;
        s.appendChild(a);
        dropdown.appendChild(s);
      });

      li.appendChild(parentElement);
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



function applyHero(hero, branding) {
  document.getElementById("hero-title").textContent = hero.title;
  document.getElementById("hero-description").textContent = hero.text;

  // Buttons
  const btnContainer = document.getElementById("hero-buttons");
  btnContainer.innerHTML = "";
  hero.buttons.forEach(btn => {
    const a = document.createElement("a");
    a.textContent = btn.label;
    a.href = btn.link;
    a.classList.add("btn", "btn-primary");
    btnContainer.appendChild(a);
  });

  // Numbers
  document.getElementById("numbers-title").textContent = hero.numbers_title;
  const ul = document.getElementById("numbers-list");
  ul.innerHTML = "";
  hero.numbers.forEach(n => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${n.value}</strong> ${n.label}`;
    ul.appendChild(li);
  });

  // Tagline
  document.getElementById("hero-tagline").textContent = hero.tagline;

  // Background
  const heroSection = document.getElementById("hero-section");
  if (branding.hero_background_type === "image") {
    heroSection.style.background = `url("${branding.hero_background_image}") center/cover no-repeat`;
  }

  if (branding.hero_background_type === "gradient") {
    heroSection.style.background = branding.hero_background_value;
  }
  if (branding.hero_background_type === "color") {
    heroSection.style.background = branding.hero_background_value;
  }
  
}


function applyHighlights(highlights) {

  // Title + subtitle
  document.getElementById("highlights-title").textContent = highlights.title;
  document.getElementById("highlights-subtitle").textContent = highlights.subtitle;

  // Background styling
  const section = document.getElementById("highlights-section");

  if (highlights.background_type === "color") {
    section.style.background = highlights.background_value;
  }

  if (highlights.background_type === "image") {
    section.style.background = `url("${highlights.background_image}") center/cover no-repeat`;
  }

  // Cards
  const grid = document.getElementById("highlights-cards");
  grid.innerHTML = "";

  highlights.cards.forEach(card => {
    const div = document.createElement("article");
    div.classList.add("card");

    div.innerHTML = `
      <h3>${card.title}</h3>
      <p>${card.text}</p>
      <a href="${card.link}" class="card-link">${card.link_label}</a>
    `;

    grid.appendChild(div);
  });
}


function applyPartners(partners) {
  // Title + Subtitle
  document.getElementById("partners-title").textContent = partners.title;
  document.getElementById("partners-subtitle").textContent = partners.subtitle;

  // Background
  const section = document.getElementById("partners-section");

  if (partners.background_type === "color") {
    section.style.background = partners.background_value;
  }

  if (partners.background_type === "image") {
    section.style.background = `url("${partners.background_image}") center/cover no-repeat`;
  }

  // Groups generation
  const container = document.getElementById("partners-groups");
  container.innerHTML = "";

  partners.groups.forEach(group => {
    const groupDiv = document.createElement("div");
    groupDiv.classList.add("affiliate-group");

    // Group title
    const h3 = document.createElement("h3");
    h3.textContent = group.group_title;
    groupDiv.appendChild(h3);

    // Grid container
    const grid = document.createElement("div");
    grid.classList.add("logo-grid");

    group.items.forEach(item => {
      const div = document.createElement("div");
      div.classList.add("logo-placeholder");

      // If a logo image is provided, show image
      if (item.logo) {
        div.innerHTML = `
          <img src="${item.logo}" alt="${item.name}" style="max-width:100%; height:auto;">
        `;
      } else {
        // Otherwise show text only
        div.textContent = item.name;
      }

      // If partner has a link
      if (item.link) {
        const a = document.createElement("a");
        a.href = item.link;
        a.target = "_blank";
        a.appendChild(div);
        grid.appendChild(a);
      } else {
        grid.appendChild(div);
      }
    });

    groupDiv.appendChild(grid);
    container.appendChild(groupDiv);
  });
}


function applyDepartments(departments) {
  const section = document.getElementById("departments-section");

  // Background
  if (departments.background_type === "color") {
    section.style.background = departments.background_value;
  }

  if (departments.background_type === "image") {
    section.style.background = `url("${departments.background_image}") center/cover no-repeat`;
  }

  // Pills
  const list = document.getElementById("departments-list");
  list.innerHTML = "";

  departments.items.forEach(item => {
    const a = document.createElement("a");
    a.classList.add("dept-pill");
    a.href = item.link || "#";
    a.textContent = item.name;
    list.appendChild(a);
  });
}


function applyNewsEvents(section) {
  const container = document.getElementById("news-events-section");

  // Background
  if (section.background_type === "color") {
    container.style.background = section.background_value;
  }
  if (section.background_type === "image") {
    container.style.background = `url("${section.background_image}") center/cover no-repeat`;
  }

  /* ------------------------
     GALLERY SECTION
  -------------------------*/
  const gallery = document.getElementById("news-gallery");
  gallery.innerHTML = "";

  section.gallery.forEach((item, index) => {
    const slide = document.createElement("div");
    slide.classList.add("gallery-slide");
    if (index === 0) slide.classList.add("active");

    slide.innerHTML = `
      <img src="${item.image}" alt="">
      <div class="gallery-caption">${item.caption}</div>
    `;

    gallery.appendChild(slide);
  });

  startGallerySlider();


  /* ------------------------
     NEWS SECTION
  -------------------------*/
  document.getElementById("news-title").textContent = section.news.section_title;

  const newsList = document.getElementById("news-list");
  newsList.innerHTML = "";

  section.news.items.forEach(n => {
    const card = document.createElement("article");
    card.classList.add("news-card");
    card.innerHTML = `
      <h4>${n.title}</h4>
      <p>${n.text}</p>
      <a href="${n.link}" class="card-link">Read more</a>
    `;
    newsList.appendChild(card);
  });

  document.getElementById("news-view-all").textContent = "View all news";
  document.getElementById("news-view-all").href = section.news.view_all_link;


  /* ------------------------
     EVENTS SECTION
  -------------------------*/
  document.getElementById("events-title").textContent = section.events.section_title;

  const eventsList = document.getElementById("events-list");
  eventsList.innerHTML = "";

  section.events.items.forEach(e => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span class="event-date">
        <span class="event-month">${e.month}</span>
        <span class="event-day">${e.day}</span>
      </span>
      <div class="event-info">
        <h4>${e.title}</h4>
        <p>${e.text}</p>
      </div>
    `;
    eventsList.appendChild(li);
  });

  document.getElementById("events-view-all").textContent = "View all events";
  document.getElementById("events-view-all").href = section.events.view_all_link;
}


function startGallerySlider() {
  const slides = document.querySelectorAll(".gallery-slide");
  let current = 0;

  setInterval(() => {
    slides[current].classList.remove("active");
    current = (current + 1) % slides.length;
    slides[current].classList.add("active");
  }, 4000);
}


function applyFooter(footer) {

  const section = document.getElementById("footer-section");

  // Background
  if (footer.background_type === "color") {
    section.style.background = footer.background_value;
  }
  if (footer.background_type === "image") {
    section.style.background = `url("${footer.background_image}") center/cover no-repeat`;
  }

  // GLOBAL TEXT STYLE
  section.style.color = footer.text_color || "#e5e7eb";
  section.style.fontSize = footer.font_size || "0.9rem";

  /* -------------------------
     LOGO
  -------------------------- */
  const logoImg = document.getElementById("footer-logo-image");
  const logoMark = document.getElementById("footer-logo-mark");
  const logoTitle = document.getElementById("footer-logo-title");
  const logoSubtitle = document.getElementById("footer-logo-subtitle");

  // If JSON has an image → show image
  if (footer.logo.image && footer.logo.image.trim() !== "") {
    logoImg.src = footer.logo.image;
    logoImg.style.display = "block";
    logoMark.style.display = "none";
  } 
  // Otherwise show mark text
  else {
    logoImg.style.display = "none";
    logoMark.style.display = "inline-block";
    logoMark.textContent = footer.logo.mark;
  }

  // Logo title/subtitle
  logoTitle.textContent = footer.logo.title;
  logoSubtitle.textContent = footer.logo.subtitle;

  // Logo styles
  logoTitle.style.color = footer.logo.text_color;
  logoTitle.style.fontSize = footer.logo.font_size;
  logoSubtitle.style.color = footer.logo.text_color;
  logoSubtitle.style.fontSize = "0.85rem";


  /* -------------------------
     ADDRESS
  -------------------------- */
  const addressDiv = document.getElementById("footer-address");
  addressDiv.innerHTML = "";

  addressDiv.style.color = footer.address_style.text_color;
  addressDiv.style.fontSize = footer.address_style.font_size;

  footer.address.forEach(line => {
    const p = document.createElement("p");
    p.textContent = line;
    addressDiv.appendChild(p);
  });

  /* -------------------------
     SOCIAL LINKS
  -------------------------- */
  const socialDiv = document.getElementById("footer-social");
  socialDiv.innerHTML = "";

  const icons = {
    facebook: "Facebook",
    instagram: "Instagram",
    linkedin: "LinkedIn",
    x: "X",
    youtube: "YouTube"
  };

  socialDiv.style.color = footer.social_style.text_color;
  socialDiv.style.fontSize = footer.social_style.font_size;

  Object.keys(footer.social).forEach(key => {
    if (footer.social[key]) {
      const a = document.createElement("a");
      a.href = footer.social[key];
      a.textContent = icons[key];
      a.style.color = footer.social_style.text_color;
      a.style.fontSize = footer.social_style.font_size;
      socialDiv.appendChild(a);
    }
  });


  /* -------------------------
     COLUMNS
  -------------------------- */
  const columnsDiv = document.getElementById("footer-columns");
  columnsDiv.innerHTML = "";

  footer.columns.forEach(col => {
    const colDiv = document.createElement("div");
    colDiv.classList.add("footer-column");

    const h3 = document.createElement("h3");
    h3.textContent = col.title;
    h3.style.color = col.title_style.text_color;
    h3.style.fontSize = col.title_style.font_size;
    colDiv.appendChild(h3);

    col.links.forEach(link => {
      const a = document.createElement("a");
      a.href = link.link;
      a.textContent = link.label;
      a.style.color = col.link_style.text_color;
      a.style.fontSize = col.link_style.font_size;
      colDiv.appendChild(a);
    });

    columnsDiv.appendChild(colDiv);
  });

  /* -------------------------
     BOTTOM SECTION
  -------------------------- */
  const bottom = document.getElementById("footer-bottom");
  bottom.innerHTML = footer.bottom.text;
  bottom.style.color = footer.bottom.text_color;
  bottom.style.fontSize = footer.bottom.font_size;

  footer.bottom.links.forEach(l => {
    const a = document.createElement("a");
    a.href = l.link;
    a.textContent = l.label;
    a.style.color = footer.bottom.link_color;
    bottom.appendChild(a);
  });
}



