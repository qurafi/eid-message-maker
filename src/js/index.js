{/* <link rel="stylesheet" href="style.css">
<script src="js/utils.js"></script>
<script src="js/config.js"></script>
<script src="js/assets.js"></script>
<script src="js/ui.js"></script>
<script src="js/canvas.js"></script> */}

import "regenerator-runtime/runtime"
import "../style.css";
import {initUI, ui, scheme} from "./ui";
import {loadAssets} from "./assets";
import {initCanvas, updateTheme} from "./canvas";
import {SVGtoImage} from "./utils";


async function init() {
  let overlay = document.getElementById("overlay");
  try {
    initUI();
    

    ui.svgs = (await loadAssets()).reduce((v, e) => ({...v, [e.id]:e}), {});
    
    for (const svg in ui.svgs) ui.imgs[svg] = await SVGtoImage(ui.svgs[svg]);

    console.log(ui.imgs)
    updateTheme()
    
    initCanvas();

    setTimeout(() => overlay.style.display = "none", 100);
  
  } catch(e) {
    
    overlay.firstElementChild.textContent = "حدث خطأ ما 😢";
    console.error(e);
  }
  
}

window.addEventListener("load", init)