const { createCanvas, loadImage, GlobalFonts } = require("@napi-rs/canvas");
const Jimp = require("jimp");
const path = require("path");

async function simpleCard({ imageBg, imageText }) {
  const canvasWidth = 600;
  const canvasHeight = 600;
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext("2d");

  const fontPath = path.join(__dirname, "..", "fonts", "ArialUnicodeMS.ttf");
  GlobalFonts.registerFromPath(fontPath, "ArialUnicodeMS");

  const imageToAdd = await loadImage(imageBg);
  const imageToAdds = await Jimp.read(imageBg);

  const sampleColor = imageToAdds.getPixelColor(0, 0);
  const { r, g, b } = Jimp.intToRGBA(sampleColor);

  const brightnessFactor = 0.7;

  const adjustedR = Math.round(r * brightnessFactor);
  const adjustedG = Math.round(g * brightnessFactor);
  const adjustedB = Math.round(b * brightnessFactor);

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, `rgb(${adjustedR}, ${adjustedG}, ${adjustedB})`);
  gradient.addColorStop(1, `rgb(${adjustedR}, ${adjustedG}, ${adjustedB})`);

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
    ctx.font = "35px 'ArialUnicodeMS'";
    ctx.textAlign = "center";
    ctx.fillText(truncatedText, textX, textY);
  } else {
    ctx.fillStyle = "#fff";
    ctx.font = "35px 'ArialUnicodeMS'";
    ctx.textAlign = "center";
    ctx.fillText(text, textX, textY);
  }
  return canvas.toBuffer("image/png");
}

module.exports = { simpleCard };
