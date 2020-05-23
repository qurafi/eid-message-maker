import { scheme, exportCanvas, updateTheme, draw } from "./canvas";
import { COLOR_SCHEMES } from "./config";
import { FONTS } from "./assets";

const ui = {
  imgs: {},
};

function initUI() {
  const elems = document.querySelectorAll("[id]");
  for (let i = 0; i < elems.length; i++) {
    const e = elems[i];
    ui[e.id] = e;
  }

  ui.logo.onchange = onLogoChange;

  // TODO
  // ui.custom_color.onclick = toggleCustomThemeUI;
  ui.downloadCanvas.onclick = exportCanvas;

  let span_cb = document.querySelectorAll(
    `input[type="checkbox"] + span, input[type="radio"] + span`
  );
  for (const c of span_cb) c.addEventListener("click", toggleCheckboxes);

  ui.sidebar.onscroll = () =>
    ui.nav.classList.toggle("shadow", ui.sidebar.scrollTop >= 5);

  initNavigation();

  initFontList();

  initInputs();
  initColors();
}

function initNavigation() {
  let li = ui.nav.querySelectorAll("li"),
    active = ui.nav.querySelector("li.active"),
    activeTab = document.querySelector(".tab.active");

  for (let i = 0; i < li.length; i++) {
    li[i].addEventListener("click", (e) => {
      if (e.target !== active) {
        // switch between tabs
        let tab = document.querySelectorAll(".tab")[i];
        if (tab) {
          e.target.classList.add("active");
          active.classList.remove("active");
          active = e.target;

          tab.classList.add("active");
          activeTab.classList.remove("active");
          activeTab = tab;
        }
      }
    });
  }
}

function initFontList() {
  let fonts_list_select = document.querySelectorAll(".fonts_list");
  for (const f of FONTS) {
    let op = new Option();
    op.textContent = f;

    for (const s of fonts_list_select) s.appendChild(op.cloneNode(true));
  }
}

function initInputs() {
  let inputs = document.querySelectorAll(
    "input:not([type='color']), textarea, select"
  );

  for (const input of inputs) {
    if (input.type == "checkbox" || input.type == "radio") {
      input.addEventListener("change", (e) => draw(ui.ctx));
    } else {
      input.addEventListener("input", (e) => draw(ui.ctx));
    }
  }
}

function toggleCheckboxes(e) {
  let c = e.target.previousElementSibling;
  if (c && c.type == "radio" && c.checked) return;
  c.checked = !c.checked;
  draw(ui.ctx);
}

function toggleCustomThemeUI() {
  let opened = ui.custom_theme.style.display == "block";

  this.classList.toggle("opened", !opened);
  ui.custom_theme.style.display = opened ? "" : "block";

  ui.color1.value = scheme[0][0];
  ui.color2.value = scheme[0][1];
}

function addColor(c1, c2) {
  let div = document.createElement("div");
  div.innerHTML = "<span></span><span></span>";

  div.firstChild.style.background = c1;
  div.lastChild.style.background = c2;

  return div;
}

function initColors() {
  for (const c of COLOR_SCHEMES) {
    let div = addColor(...c[0]);
    ui.colors.insertBefore(div, ui.colors.firstElementChild);
    div.onclick = (e) => updateTheme(c);
  }
}

function onLogoChange() {
  const file = ui.logo.files[0];
  const reader = new FileReader();

  reader.onload = function () {
    let img = new Image();
    img.src = reader.result;
    ui.imgs.logo = img;

    img.onload = () => draw(ui.ctx);
  };

  if (file) {
    reader.readAsDataURL(file);
  }
}

export { ui, initUI };
