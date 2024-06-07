const { classicCard } = require("songcard");
const { AttachmentBuilder } = require("discord.js");

client.on("interactionCreate", async (interaction) => {
  const cardImage = await classicCard({
    imageBg: "https://i.scdn.co/image/ab67616d00001e028ad8f5243d6534e03b656c8b",
    imageText: "Die For You (with Ariana Grande) - Remix",
    trackStream: false,
    trackDuration: 220000,
    trackTotalDuration: 233000,
  });

  const attachment = new AttachmentBuilder(cardImage, {
    name: "card.png",
  });

  interaction.channel.send({
    files: [attachment],
  });
});

client.login("token");
