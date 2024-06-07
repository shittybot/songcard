const fs = require("fs");
const { classicCard } = require("../themes/classicCard");

async function testClassicCard() {
  const imageBg =
    "https://i.scdn.co/image/ab67616d00001e02730cc8eb459c92944233e891";
  const imageText = "恋愛サーキュレーション";
  const trackStream = false;
  const trackDuration = 138000;
  const trackTotalDuration = 338000;

  try {
    const buffer = await classicCard({
      imageBg,
      imageText,
      trackStream,
      trackDuration,
      trackTotalDuration,
    });
    fs.writeFileSync("classicCard.png", buffer);
    console.log("Canvas generated successfully.");
  } catch (error) {
    console.error("Error generating canvas:", error);
  }
}

testClassicCard();
