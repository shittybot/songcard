const { createCanvas, loadImage } = require("@napi-rs/canvas");
const { fontRegister } = require("../utils/fontRegister");
const Jimp = require("jimp");

async function simpleCard({ imageBg, imageText, fontPath }) {
  const canvasWidth = 600;
  const canvasHeight = 600;
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext("2d");

  if (fontPath) {
    await fontRegister(fontPath, "CustomFont");
  }

  const imageToAdd = await loadImage(imageBg);
  const imageToAdds = await Jimp.read(imageBg);

  const topColor = imageToAdds.getPixelColor(0, 0);
  const bottomColor = imageToAdds.getPixelColor(
    imageToAdds.bitmap.width - 1,
    imageToAdds.bitmap.height - 1
  );
  const { r: r1, g: g1, b: b1 } = Jimp.intToRGBA(topColor);
  const { r: r2, g: g2, b: b2 } = Jimp.intToRGBA(bottomColor);

  const brightFactorTop = 0.7;
  const brightFactorBottom = 0.7;

  const adjustedTop = `rgb(${Math.min(r1 * brightFactorTop, 255)}, ${Math.min(
    g1 * brightFactorTop,
    255
  )}, ${Math.min(b1 * brightFactorTop, 255)})`;
  const adjustedBottom = `rgb(${Math.max(
    r2 * brightFactorBottom,
    0
  )}, ${Math.max(g2 * brightFactorBottom, 0)}, ${Math.max(
    b2 * brightFactorBottom,
    0
  )})`;

  const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
  gradient.addColorStop(0, adjustedTop);
  gradient.addColorStop(0, adjustedBottom);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const imageSize = Math.min(canvasHeight - 200, canvasWidth - 200);
  const imageX = (canvasWidth - imageSize) / 2;
  const imageY = (canvasHeight - imageSize - 40) / 2;
  const borderRadius = 25;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(imageX + borderRadius, imageY);
  ctx.lineTo(imageX + imageSize - borderRadius, imageY);
  ctx.quadraticCurveTo(
    imageX + imageSize,
    imageY,
    imageX + imageSize,
    imageY + borderRadius
  );
  ctx.lineTo(imageX + imageSize, imageY + imageSize - borderRadius);
  ctx.quadraticCurveTo(
    imageX + imageSize,
    imageY + imageSize,
    imageX + imageSize - borderRadius,
    imageY + imageSize
  );
  ctx.lineTo(imageX + borderRadius, imageY + imageSize);
  ctx.quadraticCurveTo(
    imageX,
    imageY + imageSize,
    imageX,
    imageY + imageSize - borderRadius
  );
  ctx.lineTo(imageX, imageY + borderRadius);
  ctx.quadraticCurveTo(imageX, imageY, imageX + borderRadius, imageY);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(imageToAdd, imageX, imageY, imageSize, imageSize);
  ctx.restore();

  const textX = canvasWidth / 2;
  const textY = imageY + imageSize + 60;

  const maxWidth = 100;
  const text = imageText;

  const textWidth = ctx.measureText(text).width;

  if (textWidth > maxWidth) {
    const ellipsisWidth = ctx.measureText("...").width;
    const availableWidth = maxWidth - ellipsisWidth;
    let truncatedText = text;
    while (ctx.measureText(truncatedText).width > availableWidth) {
      truncatedText = truncatedText.slice(0, -1);
    }
    truncatedText += "...";
    ctx.fillStyle = "#fff";

    if (fontPath) {
      ctx.font = "35px 'CustomFont'";
    } else {
      ctx.font = "35px Arial";
    }

    ctx.textAlign = "center";
    ctx.fillStyle = "#fff";
    ctx.fillText(truncatedText, textX, textY);
  } else {
    ctx.fillStyle = "#fff";

    if (fontPath) {
      ctx.font = "35px 'CustomFont'";
    } else {
      ctx.font = "35px Arial";
    }

    ctx.textAlign = "center";
    ctx.fillText(text, textX, textY);
  }

  return canvas.toBuffer("image/png");
}

module.exports = { simpleCard };
