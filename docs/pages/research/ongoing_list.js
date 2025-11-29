document.addEventListener("DOMContentLoaded", () => {
  fetch("ongoing_list.json")
    .then(r => r.json())
    .then(data => buildUI(data));
});

function buildUI(data) {
  const frame = document.getElementById("projects-frame");
  const list = document.getElementById("projects-list");

  // Apply frame style
  frame.style.width = data.style.frame_width;
  frame.style.height = data.style.frame_height;
  frame.style.background = data.style.gradient;

  // Build list
  list.innerHTML = "";
  data.items.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("project-item");

    // style from JSON
    div.style.color = item.color;
    div.style.fontSize = item.size;

    if (item.glow) div.classList.add("glow");

    div.textContent = item.label;

    div.addEventListener("click", () => {
      window.location.href = `pdf_viewer.html?file=${encodeURIComponent(item.pdf)}`;
    });

    list.appendChild(div);
  });
}
