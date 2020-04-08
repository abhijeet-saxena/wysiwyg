import svgMap from "./svg-map.js";

const editor = document.querySelector(".editor");
const toolbar = document.querySelector(".toolbar");

const alignContent = (command) => {
  document
    .querySelectorAll(".align")
    .forEach((button) => button.classList.remove("active"));

  document.querySelector(`[data-command=${command}]`).classList.add("active");
};

editor.addEventListener(
  "mouseup",
  () => {
    Object.keys(svgMap).forEach((svg) => {
      const button = document.querySelector(`[data-command="${svg}"]`);
      if (document.queryCommandState(svg)) button.classList.add("active");
      else button.classList.remove("active");
    });
  },
  false
);

toolbar.addEventListener(
  "click",
  (event) => {
    const {
      target,
      target: {
        dataset: { command, type },
      },
    } = event;
    let param = null;

    if (target.tagName !== "BUTTON") return;

    if (!target.classList.contains("active")) {
      target.style.animation = "clicked 200ms ease-in-out";
      target.onanimationend = () => (target.style.animation = "");
    }

    if (type === "align") alignContent(command);
    else if (type !== "once") target.classList.toggle("active");

    document.execCommand(command, null, param);
  },
  false
);

window.onload = () => {
  Object.keys(svgMap).forEach((svg) => (toolbar.innerHTML += svgMap[svg]));

  document.execCommand("justifyLeft", null, null);
  alignContent("justifyLeft");
};
