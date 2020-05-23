import {radialGradiant, drawText, SVGtoImage} from "./utils"
import {COLOR_SCHEMES} from "./config"
import {ui} from "./ui"


let scheme = COLOR_SCHEMES[0] // selected color scheme
console.log(scheme)
let font_title = "Noto Kufi";
let title_bold = "bold";
let font_message = "Noto Naskh";
let message_bold = "";

function initCanvas() {
  ui.ctx = ui.canvas.getContext("2d");
  ui.canvas_wrapper.appendChild(ui.canvas)

  fitCanvas()
  window.onresize = fitCanvas;
  
  setTimeout(draw, 100, ui.ctx) // fix some font issues
}

function fitToCanvas(width, height) {
  let cwrapper_rect = ui.canvas_wrapper.getBoundingClientRect();
  let ratio = Math.min(cwrapper_rect.width / width, cwrapper_rect.height/ height);
  
  return { width: width * ratio, height: height * ratio };
}


function fitCanvas() {
  let canvas_rect = ui.canvas.getBoundingClientRect();
  let cwrapper_rect = ui.canvas_wrapper.getBoundingClientRect();
  let {width, height} = fitToCanvas(1920, 1080)
  
  ui.canvas.width = Math.max(width, 1920);
  ui.canvas.height = Math.max(height, 1080);
  
  draw(ui.ctx)
}

async function updateSVGColor() {
  for (const id in ui.svgs) {
    const svg = ui.svgs[id];
    svg.querySelector("path").setAttribute("fill", scheme[0][1]+(scheme[1] || "05"));
    ui.imgs[id] = await SVGtoImage(svg);
  }
}

async function updateTheme(c = scheme) {
  scheme = c;
  await updateSVGColor();
  draw(ui.ctx);
}



const rfs = (f, w) => f/1280*w;

const aspect = (mw, mh, w, h) => {
  let r = Math.min(mw / w, mh / h);
  return [w*r, h*r]
}


function draw(ctx, bg_aspect, ar) {
  
  let {width, height} = ctx.canvas;

  let color = scheme[0];
  if (!color[2]) color[2] = color[0];

  font_title = ui.title_font.value;
  title_bold = ui.title_fontbold.checked ? "bold" : "";
  font_message = ui.message_font.value;
  message_bold = ui.message_fontbold.checked ? "bold" : "";

  
  ctx.fillStyle = color[0];
  ctx.fillRect(0, 0, width, height)

  ctx.fillStyle = radialGradiant(ctx, width/2, height/2, color[1]+"1a", "transparent");
  ctx.fillRect(0, 0, width, height);

  if (ui.bgpatt.value == "arpatt") {
    ctx.drawImage(ui.imgs.arpatt, 0, 0, ...(bg_aspect || [width, height]));
  } else {
    let img = ui.imgs[ui.bgpatt.value];
    let [w, h] = aspect(80, 80, img.width, img.height);
    let m = 6
    for (let i = 0; i < width/(w+m); i++) {
      for (let j = 0; j < height/h; j++) {
        ctx.drawImage(img, i*(w+m), j*(h+m), w, h)
      }
    }
  }
  

  let [w, h] = aspect(width*.7, height*.6, 2160, 1080)
  let x1 = (width - w) / 2, y1 = (height - h) / 2;
  let temp = ui.stemplate.value;
  ui.vpos.style.display = (scheme[2] || temp == 2)? "none" : "";
  if (temp == 2) {
    w = width*.45;
    h = height;
    x1 = 0;
    y1 = 0;
  }
  
  if (scheme[2] || temp == 2) {
    ctx.fillStyle = color[3] || (color[1]+"cc")
    ctx.fillRect(x1, y1, w, h)
  }


  ctx.font = title_bold+" "+rfs((scheme[2] && temp != 2) ? 30 : 50, width)+"px "+font_title
  ctx.fillStyle = color[2];
  
  ctx.textAlign = "center";

  let vchecked = document.querySelector(`[name="logovpos"]:checked`);
  let vpos = vchecked && vchecked.id.replace("logo", "");
  let logom = ui.imgs.logo && scheme[2] && vpos == "top" ? 64 : 0;
  logom = logom/1080*height

  ctx.fillText("كل عام وأنتم بخير", x1+w/2, height*.36 + logom)
  ctx.font = message_bold+" "+rfs((scheme[2] || temp == 2) ? 22 : 30, width)+"px "+font_message
  let lines = drawText(ctx, ui.message_text.value,
    x1+w/2, height*.46 + (scheme[2] ? 0 : 15) + logom, w-(scheme[2] ? (temp == 1 ? 200 : 150) : (temp == 2 ? 150 : 0))-(message_bold ? 50 : 0))

  let margin = Math.min(lines.length*25, 175)/1920*width;
  if (ui.imgs.logo) {
    let [lw, lh] = aspect(128, 128, ui.imgs.logo.width, ui.imgs.logo.height)

    let x = 0, y = 0;
    if (scheme[2] || temp == 2) {
      x = x1+(w-lw)/2
      y = (temp == 2 ? 64 : y1) + (vpos == "bottom" ? h/2+margin : 30);
    } else {
      let hchecked = document.querySelector(`[name="logohpos"]:checked`)
      let hpos = hchecked && hchecked.id.replace("logo", "");
      x = hpos == "right" ? width-lw-30 : hpos == "center" ? (width-lw)/2 : 0;
      y = vpos == "bottom" ? height-lh-30 : 0;
    }

    ctx.drawImage(ui.imgs.logo, 15+x, 15+y, lw, lh);

  } else {
    let x = x1+w/2
    let y = height/2 + margin;
    ctx.font = title_bold+" "+rfs((scheme[2] && temp != 2) ? 25 : 30, width)+"px "+font_title
    ctx.fillText(ui.name.value, 15+x, 50+y+(scheme[2] ? 0 : 60))
  }

}

function exportCanvas(e) {
  let exportCanvas = document.createElement("canvas")
  
  let {width, height} = ui.canvas;

  let ratio = ui.aspect_ratio.value;
  let res = ui.resolution.value;
  exportCanvas.width = height*ratio*res;
  exportCanvas.height = height*res; 
  
  draw(exportCanvas.getContext("2d"), [width*res, height*res], ratio)
  
  e.target.href = exportCanvas.toDataURL("image/png");
  e.target.download = Date.now().toString(16) + ".png";
}

export {
  initCanvas,
  draw,
  updateTheme,
  exportCanvas,
  updateSVGColor,
  scheme
}