const fs = require("fs");
const { classicCard } = require("../themes/classicCard");
const path = require("path");

async function testClassicCard() {
  const imageBg =
    "https://i.scdn.co/image/ab67616d0000b2738ad8f5243d6534e03b656c8b";
  const imageText = "Die For You (with Ariana Grande) - Remix";
  const songArtist = "The Weeknd";
  const trackStream = false;
  const trackDuration = 138000;
  const trackTotalDuration = 232857;
  const fontPath =  path.join(__dirname, "..", "fonts", "ArialUnicodeMS.ttf");

  try {
    const buffer = await classicCard({
      imageBg,
      imageText,
      //songArtist,
      trackStream,
      trackDuration,
      trackTotalDuration,
      fontPath
    });
    fs.writeFileSync("classicCard.png", buffer);
    console.log("Canvas generated successfully.");
  } catch (error) {
    console.error("Error generating canvas:", error);
  }
}

testClassicCard();
