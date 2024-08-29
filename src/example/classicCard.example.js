const { classicCard } = require("songcard");
const { AttachmentBuilder } = require("discord.js");
const path = require("path");

client.on("interactionCreate", async (interaction) => {
  const cardImage = await classicCard({
    imageBg: "https://i.scdn.co/image/ab67616d00001e028ad8f5243d6534e03b656c8b", // Require
    imageText: "Die For You (with Ariana Grande) - Remix", // Require
    trackDuration: 220000, // Require
    trackTotalDuration: 233000, // Require
    trackStream: false, // Optional. Default is set to false.
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
