import arpatt from "../../imgs/arpatt.svg";
import candy from "../../imgs/candy.svg";
import lights from "../../imgs/lights.svg";

const IMGS = [arpatt, candy, lights];

export const FONTS = ["Noto Kufi", "Noto Naskh", "Cairo", "Amiri"];

const svgWrapper = document.createElement("div");
let imgs_loaded;

export async function loadAssets() {
  if (imgs_loaded) return;
  if (document.readyState != "complete")
    window.addEventListener("load", loadAssets);

  try {
    let imgs = IMGS.map(async (p) => {
      let response = await fetch(p);

      if (!response.ok) throw new Error(response.statusMessage);

      let svg = await response.text();
      svgWrapper.innerHTML += svg;

      let svgs = document.querySelectorAll("svg");
      let el = svgs[svgs.length - 1];
      el.id = p.split(".")[0].replace("/", "");
      imgs[el.id] = el;

      return el;
    });

    imgs_loaded = true;

    document.body.appendChild(svgWrapper);
    svgWrapper.style.display = "none";

    return Promise.all(imgs);
  } catch (e) {
    console.error(e.message || e);
  }
}
