async function loadProjectData() {
  try {
    const response = await fetch("project-data.json");
    const data = await response.json();

    populateHeader(data);
    populateHero(data);
    populateSections(data);
  } catch (error) {
    console.error("Error loading project-data.json:", error);
  }
}

function populateHeader(data) {
  const labNameEl = document.getElementById("lab-name");
  const labTaglineEl = document.getElementById("lab-tagline");
  const footerLabNameEl = document.getElementById("footer-lab-name");
  const footerNoteEl = document.getElementById("footer-note");

  if (labNameEl) labNameEl.textContent = data.lab.name;
  if (labTaglineEl) labTaglineEl.textContent = data.lab.tagline;
  if (footerLabNameEl) footerLabNameEl.textContent = data.lab.name;
  if (footerNoteEl && data.footerNote) footerNoteEl.textContent = data.footerNote;
}

function populateHero(data) {
  const projectTitleEl = document.getElementById("project-title");
  const projectTaglineEl = document.getElementById("project-tagline");
  const fundingAgencyEl = document.getElementById("funding-agency");
  const fundingAmountEl = document.getElementById("funding-amount");
  const projectDurationEl = document.getElementById("project-duration");
  const projectIdEl = document.getElementById("project-id");
  const highlightsListEl = document.getElementById("highlights-list");

  if (projectTitleEl) projectTitleEl.textContent = data.project.title;
  if (projectTaglineEl) projectTaglineEl.textContent = data.project.tagline;
  if (fundingAgencyEl) fundingAgencyEl.textContent = data.funding.agency;
  if (fundingAmountEl) fundingAmountEl.textContent = data.funding.amountDisplay;
  if (projectDurationEl) projectDurationEl.textContent = data.project.durationDisplay;
  if (projectIdEl) projectIdEl.textContent = data.project.id;

  if (highlightsListEl && Array.isArray(data.project.highlights)) {
    highlightsListEl.innerHTML = "";
    data.project.highlights.forEach((h) => {
      const li = document.createElement("li");
      li.textContent = h;
      highlightsListEl.appendChild(li);
    });
  }
}

function populateSections(data) {
  // Overview and Motivation
  const overviewTextEl = document.getElementById("overview-text");
  const motivationTextEl = document.getElementById("motivation-text");

  if (overviewTextEl) overviewTextEl.textContent = data.sections.overview;
  if (motivationTextEl) motivationTextEl.textContent = data.sections.motivation;

  // Objectives
  const objectivesListEl = document.getElementById("objectives-list");
  if (objectivesListEl && Array.isArray(data.sections.objectives)) {
    objectivesListEl.innerHTML = "";
    data.sections.objectives.forEach((obj) => {
      const li = document.createElement("li");
      li.textContent = obj;
      objectivesListEl.appendChild(li);
    });
  }

  // Methodology steps
  const methodologyStepsEl = document.getElementById("methodology-steps");
  if (methodologyStepsEl && Array.isArray(data.sections.methodology)) {
    methodologyStepsEl.innerHTML = "";
    data.sections.methodology.forEach((step) => {
      const div = document.createElement("div");
      div.className = "step-item";

      const title = document.createElement("div");
      title.className = "step-title";
      title.textContent = step.title;

      const body = document.createElement("div");
      body.className = "step-body";
      body.textContent = step.description;

      div.appendChild(title);
      div.appendChild(body);
      methodologyStepsEl.appendChild(div);
    });
  }

  // Impact
  const impactListEl = document.getElementById("impact-list");
  if (impactListEl && Array.isArray(data.sections.impact)) {
    impactListEl.innerHTML = "";
    data.sections.impact.forEach((point) => {
      const li = document.createElement("li");
      li.textContent = point;
      impactListEl.appendChild(li);
    });
  }

  // Team
  const teamGridEl = document.getElementById("team-grid");
  if (teamGridEl && Array.isArray(data.team)) {
    teamGridEl.innerHTML = "";
    data.team.forEach((member) => {
      const card = document.createElement("div");
      card.className = "team-card";

      const role = document.createElement("div");
      role.className = "team-role";
      role.textContent = member.role;

      const name = document.createElement("div");
      name.className = "team-name";
      name.textContent = member.name;

      const affiliation = document.createElement("div");
      affiliation.className = "team-affiliation";
      affiliation.textContent = member.affiliation;

      card.appendChild(role);
      card.appendChild(name);

      if (member.affiliation) {
        card.appendChild(affiliation);
      }

      if (member.email) {
        const email = document.createElement("div");
        email.className = "team-email";
        const link = document.createElement("a");
        link.href = `mailto:${member.email}`;
        link.textContent = member.email;
        email.appendChild(link);
        card.appendChild(email);
      }

      teamGridEl.appendChild(card);
    });
  }

  // Funding summary and notes
  const fundingSummaryEl = document.getElementById("funding-summary");
  const fundingNotesEl = document.getElementById("funding-notes");
  if (fundingSummaryEl) fundingSummaryEl.textContent = data.funding.summary;
  if (fundingNotesEl) fundingNotesEl.textContent = data.funding.notes;

  // Timeline
  const timelineListEl = document.getElementById("timeline-list");
  if (timelineListEl && Array.isArray(data.timeline)) {
    timelineListEl.innerHTML = "";
    data.timeline.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = `${item.label}: ${item.value}`;
      timelineListEl.appendChild(li);
    });
  }

  // Resources
  const resourcesListEl = document.getElementById("resources-list");
  if (resourcesListEl && Array.isArray(data.resources)) {
    resourcesListEl.innerHTML = "";
    data.resources.forEach((res) => {
      const li = document.createElement("li");
      const link = document.createElement("a");
      link.href = res.href;
      link.textContent = res.label;
      link.target = res.external ? "_blank" : "_self";
      li.appendChild(link);
      if (res.note) {
        const span = document.createElement("span");
        span.className = "muted";
        span.textContent = ` – ${res.note}`;
        li.appendChild(span);
      }
      resourcesListEl.appendChild(li);
    });
  }
}

document.addEventListener("DOMContentLoaded", loadProjectData);
