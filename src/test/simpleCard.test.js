const fs = require("fs");
const { simpleCard } = require("../themes/simpleCard");

async function testSimpleCard() {
  const imageBg =
    "https://i.scdn.co/image/ab67616d00001e02684d81c9356531f2a456b1c1";
  const imageText = "群青";

  try {
    const buffer = await simpleCard({ imageBg, imageText });
    fs.writeFileSync("simpleCard.png", buffer);
    console.log("Canvas generated successfully.");
  } catch (error) {
    console.error("Error generating canvas:", error);
  }
}

testSimpleCard();
