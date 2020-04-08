import svgMap from "./svg-map.js";

const editor = document.querySelector(".editor");
const toolbar = document.querySelector(".toolbar");

toolbar.addEventListener(
  "click",
  (event) => {
    document.execCommand(event.target.dataset.func);
  },
  false
);

Object.keys(svgMap).forEach((svg) => (toolbar.innerHTML += svgMap[svg]));
