const fs = require("fs");
const { simpleCard } = require("../themes/simpleCard");
const path = require("path");

async function testSimpleCard() {
  const imageBg =
    "https://i.scdn.co/image/ab67616d00001e02684d81c9356531f2a456b1c1";
  const imageText = "群青";
  const fontPath = path.join(__dirname, "..", "fonts", "ArialUnicodeMS.ttf");

  try {
    const buffer = await simpleCard({
      imageBg,
      imageText,
      fontPath,
    });
    fs.writeFileSync("simpleCard.png", buffer);
    console.log("Canvas generated successfully.");
  } catch (error) {
    console.error("Error generating canvas:", error);
  }
}

testSimpleCard();
