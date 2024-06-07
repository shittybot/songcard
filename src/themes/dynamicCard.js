const { createCanvas, loadImage, GlobalFonts } = require("@napi-rs/canvas");
const path = require("path");

async function dynamicCard({
  thumbnailURL, // required
  songTitle, // required
  songArtist, // optional
  streamProvider, // optional
  trackRequester, // optional
}) {
  const cardWidth = 800;
  const cardHeight = 250;
  const backgroundColor = "#2B2D31";

  const canvas = createCanvas(cardWidth, cardHeight);
  const ctx = canvas.getContext("2d");

  const fontPath = path.join(__dirname, "..", "fonts", "ArialUnicodeMS.ttf");
  GlobalFonts.registerFromPath(fontPath, "ArialUnicodeMS");

  function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    if (typeof stroke === "undefined") {
      stroke = true;
    }
    if (typeof radius === "undefined") {
      radius = 5;
    }
    if (typeof radius === "number") {
      radius = { tl: radius, tr: radius, br: radius, bl: radius };
    } else {
      var defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
      for (var side in defaultRadius) {
        radius[side] = radius[side] || defaultRadius[side];
      }
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(
      x + width,
      y + height,
      x + width - radius.br,
      y + height
    );
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    if (fill) {
      ctx.fill();
    }
    if (stroke) {
      ctx.stroke();
    }
  }

  ctx.fillStyle = backgroundColor;
  roundRect(ctx, 0, 0, cardWidth, cardHeight, 20, true, false);

  const thumbnailImage = await loadImage(thumbnailURL);

  const padding = 20;
  const thumbnailSize = cardHeight - 2 * padding;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(cardWidth - thumbnailSize - padding + 20, padding);
  ctx.arcTo(
    cardWidth - padding,
    padding,
    cardWidth - padding,
    padding + 20,
    20
  );
  ctx.arcTo(
    cardWidth - padding,
    cardHeight - padding,
    cardWidth - padding - 20,
    cardHeight - padding,
    20
  );
  ctx.arcTo(
    cardWidth - thumbnailSize - padding,
    cardHeight - padding,
    cardWidth - thumbnailSize - padding,
    cardHeight - padding - 20,
    20
  );
  ctx.arcTo(
    cardWidth - thumbnailSize - padding,
    padding,
    cardWidth - thumbnailSize - padding + 20,
    padding,
    20
  );
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(
    thumbnailImage,
    cardWidth - thumbnailSize - padding,
    padding,
    thumbnailSize,
    thumbnailSize
  );
  ctx.restore();

  const streamProviderIcons = {
    spotify: path.join(__dirname, "..", "assets", "spotify.png"),
    youtube: path.join(__dirname, "..", "assets", "youtube.png"),
    soundcloud: path.join(__dirname, "..", "assets", "soundcloud.png"),
  };

  if (streamProvider && streamProviderIcons[streamProvider.toLowerCase()]) {
    const providerIcon = await loadImage(
      streamProviderIcons[streamProvider.toLowerCase()]
    );
    const iconSize = 30;
    const iconPadding = 10;
    ctx.save();
    ctx.beginPath();
    ctx.arc(
      cardWidth - padding - iconPadding - iconSize / 2,
      cardHeight - padding - iconPadding - iconSize / 2,
      iconSize / 2,
      0,
      Math.PI * 2
    );
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(
      providerIcon,
      cardWidth - padding - iconPadding - iconSize,
      cardHeight - padding - iconPadding - iconSize,
      iconSize,
      iconSize
    );
    ctx.restore();
  }

  ctx.fillStyle = "white";
  ctx.font = "bold 35px 'ArialUnicodeMS'";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  const maxWidth = cardWidth - thumbnailSize - padding * 2;
  let truncatedTitle = songTitle;

  while (ctx.measureText(truncatedTitle).width > maxWidth) {
    truncatedTitle = truncatedTitle.slice(0, -1);
  }

  if (truncatedTitle.length < songTitle.length) {
    truncatedTitle = truncatedTitle.slice(0, -3) + "...";
  }

  ctx.fillText(truncatedTitle, padding + 10, padding + 20);

  ctx.fillStyle = "#A79D9D";
  ctx.font = "25px 'ArialUnicodeMS'";

  ctx.fillText(songArtist, padding + 10, padding + 70);

  ctx.font = "20px 'ArialUnicodeMS'";
  ctx.fillText(
    `Requested by: ${trackRequester}`,
    padding + 10,
    cardHeight - padding - 30
  );

  const buffer = canvas.toBuffer("image/png");

  return buffer;
}

module.exports = { dynamicCard };
