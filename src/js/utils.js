function ctxWordWrap(ctx, text, max_width) {
  let output = "";
  let scache = "";
  let lastIsLong;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    scache += c;

    let mtext = ctx.measureText(scache);
    let width = Math.abs(
      mtext.actualBoundingBoxLeft + mtext.actualBoundingBoxRight
    );

    let isLong = width > max_width;
    let isLast = i == text.length - 1;

    if (lastIsLong || (isLong && c == " ") || isLast) {
      output += scache + (isLast ? "" : "\n");
      scache = "";
    }
  }

  return output.split("\n");
}

function SVGtoImage(svg) {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = "data:image/svg+xml," + encodeURIComponent(svg.outerHTML);
  });
}

function drawText(ctx, text, x, y, max_width, line_height) {
  let lines = ctxWordWrap(ctx, text, max_width);

  if (line_height === undefined) {
    let mtext = ctx.measureText(lines[0]);
    line_height =
      mtext.actualBoundingBoxDescent + mtext.actualBoundingBoxAscent + 4;
  }

  lines.forEach((v, i) => {
    ctx.fillText(v.trim(), x, y + i * line_height);
  });

  return lines;
}

function radialGradiant(ctx, x, y, c1, c2) {
  // it just works
  let { width, height } = ctx.canvas;
  let r1 = width / 6,
    r2 = height * 0.75;
  let gradiant = ctx.createRadialGradient(
    x,
    y,
    Math.min(r1, r2),
    x,
    y,
    Math.max(width * 0.7, height * 0.7)
  );
  gradiant.addColorStop(0, c1);
  gradiant.addColorStop(1, c2);
  return gradiant;
}

export { radialGradiant, drawText, SVGtoImage };
