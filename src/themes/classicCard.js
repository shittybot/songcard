const { createCanvas, loadImage, GlobalFonts } = require("@napi-rs/canvas");
const Jimp = require("jimp");
const path = require("path");

async function classicCard({
  imageBg,
  imageText,
  trackStream,
  trackDuration,
  trackTotalDuration,
}) {
  const canvasWidth = 1200;
  const canvasHeight = 400;
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext("2d");
  const prettyMilliseconds = (await import("pretty-ms")).default;

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

  const totalTrackDuration = trackTotalDuration;
  const currentTrackDuration = trackDuration;

  const progressWidth = 700;
  const progressHeight = 8;
  const progressX = 420;
  const progressY = 280;
  const borderRadius1 = 10;

  const progressPercentage = (currentTrackDuration / totalTrackDuration) * 100;

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

  let duration;

  if (!trackDuration) {
    duration = "0:00";
  }
  if (trackDuration) {
    duration = prettyMilliseconds(trackDuration, {
      colonNotation: true,
      secondsDecimalDigits: 0,
    });
  }

  let totalDuration;

  if (!trackTotalDuration) {
    totalDuration = "0:00";
  }
  if (trackTotalDuration) {
    totalDuration = prettyMilliseconds(trackTotalDuration, {
      colonNotation: true,
      secondsDecimalDigits: 0,
    });
  }

  ctx.fillStyle = "#fff";
  ctx.font = "30px 'ArialUnicodeMS'";
  const text1X = 420;
  const text1Y = 330;
  ctx.fillText(trackStream ? `LIVE` : duration, text1X, text1Y);

  ctx.fillStyle = "#fff";
  ctx.font = "30px 'ArialUnicodeMS'";
  const text2X = 1060;
  const text2Y = 330;
  ctx.fillText(trackStream ? `LIVE` : totalDuration, text2X, text2Y);

  const imageSize = Math.min(canvasHeight - 80, canvasWidth - 80);
  const imageX = 40;
  const imageY = 40;
  const borderRadius = 25;

  ctx.drawImage(
    canvas,
    0,
    0,
    canvasWidth,
    canvasHeight,
    0,
    0,
    canvasWidth,
    canvasHeight
  );

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

  const textX = imageX + imageSize + 60;
  const textY = imageY - -60;

  const maxWidth = 540;
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
    ctx.font = "bold 40px 'ArialUnicodeMS'";
    ctx.fillText(truncatedText, textX, textY);
  } else {
    ctx.fillStyle = "#fff";
    ctx.font = "bold 40px 'ArialUnicodeMS'";
    ctx.fillText(text, textX, textY);
  }
  return canvas.toBuffer("image/png");
}

module.exports = { classicCard };
