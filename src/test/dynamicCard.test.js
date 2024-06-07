const fs = require("fs");
const { dynamicCard } = require("../themes/dynamicCard");

async function testdynamicCard() {
  const thumbnailURL =
    "https://i.scdn.co/image/ab67616d00001e0240d7efd2594a2b6bda60ea18";
  const songTitle = "What is Love";
  const songArtist = "TWICE";
  const streamProvider = "spotify";
  const trackRequester = "@lewdhutao";

  try {
    const buffer = await dynamicCard({
      thumbnailURL,
      songTitle,
      songArtist,
      streamProvider,
      trackRequester,
    });
    fs.writeFileSync("dynamicCard.png", buffer);
    console.log("Canvas generated successfully.");
  } catch (error) {
    console.error("Error generating canvas:", error);
  }
}

testdynamicCard();
