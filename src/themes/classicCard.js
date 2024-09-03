const { createCanvas, loadImage } = require("@napi-rs/canvas");
const { fontRegister } = require("../utils/fontRegister");
const Jimp = require("jimp");

async function classicCard({
  imageBg,
  imageText,
  songArtist,
  trackStream,
  trackDuration,
  trackTotalDuration,
  fontPath,
}) {
  const canvasWidth = 1200;
  const canvasHeight = 400;
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext("2d");
  const prettyMilliseconds = (await import("pretty-ms")).default;

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
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  const progressWidth = 700;
  const progressHeight = 8;
  const progressX = 420;
  const progressY = 280;
  const borderRadius1 = 10;
  const progressPercentage = (trackDuration / trackTotalDuration) * 100;

  const gradients = ctx.createLinearGradient(
    progressX,
    0,
    progressX + progressWidth,
    0
  );
  gradients.addColorStop(0, "white");
  gradients.addColorStop(progressPercentage / 100, "white");
  gradients.addColorStop(progressPercentage / 100 + 0.01, "gray");
  gradients.addColorStop(1, "gray");

  ctx.fillStyle = gradients;
  ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
  ctx.shadowBlur = 8;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 4;
  ctx.roundRect(
    progressX,
    progressY,
    progressWidth,
    progressHeight,
    borderRadius1
  );
  ctx.fill();

  const dotX = progressX + (progressWidth * progressPercentage) / 100;
  const dotY = progressY + progressHeight / 2;
  const dotRadius = 8;

  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(dotX, dotY, dotRadius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();

  const duration = trackDuration
    ? prettyMilliseconds(trackDuration, {
        colonNotation: true,
        secondsDecimalDigits: 0,
      })
    : "0:00";
  const totalDuration = trackTotalDuration
    ? prettyMilliseconds(trackTotalDuration, {
        colonNotation: true,
        secondsDecimalDigits: 0,
      })
    : "0:00";

  ctx.fillStyle = "#fff";
  ctx.font = fontPath ? "30px 'CustomFont'" : "30px Arial";
  ctx.fillText(trackStream ? `LIVE` : duration, 420, 330);
  ctx.fillText(trackStream ? `LIVE` : totalDuration, 1060, 330);

  const imageSize = Math.min(canvasHeight - 80, canvasWidth - 80);
  const imageX = 40;
  const imageY = 40;
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

  const textColor = "#fff";
  const artistColor = "#E6E6E6";

  const textX = imageX + imageSize + 60;
  const textY = imageY + 50;
  const artistY = textY + 50;
  const maxWidth = 540;

  const truncateText = (text, maxWidth) => {
    if (ctx.measureText(text).width > maxWidth) {
      const ellipsisWidth = ctx.measureText("...").width;
      const availableWidth = maxWidth - ellipsisWidth;
      let truncatedText = text;
      while (ctx.measureText(truncatedText).width > availableWidth) {
        truncatedText = truncatedText.slice(0, -1);
      }
      return `${truncatedText}...`;
    }
    return text;
  };

  ctx.fillStyle = textColor;
  ctx.font = fontPath ? "bold 45px 'CustomFont'" : "bold 50px Arial";
  ctx.fillText(truncateText(imageText, maxWidth), textX, textY);

  if (songArtist) {
    ctx.fillStyle = artistColor;
    ctx.font = fontPath ? "35px 'CustomFont'" : "30px Arial";
    ctx.fillText(truncateText(songArtist, maxWidth), textX, artistY);
  }

  return canvas.toBuffer("image/png");
}

module.exports = { classicCard };
