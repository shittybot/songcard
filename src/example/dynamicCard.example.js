const { dynamicCard } = require("songcard");
const { AttachmentBuilder } = require("discord.js");

client.on("interactionCreate", async (interaction) => {
  const cardImage = await dynamicCard({
    thumbnailURL:
      "https://i.scdn.co/image/ab67616d00001e0240d7efd2594a2b6bda60ea18", // Require
    songTitle: "What is Love", // Require
    songArtist: "TWICE", // Optional. Default is null.
    trackRequester: "@lewdhutao", // Optional. Default is null.
    fontPath: path.join(__dirname, "..", "fonts", "ArialUnicodeMS.ttf"), // Optional. Default fonts is set to Arial.
  });

  const attachment = new AttachmentBuilder(cardImage, {
    name: "card.png",
  });

  interaction.channel.send({
    files: [attachment],
  });
});

client.login("token");
