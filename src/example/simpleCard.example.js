const { simpleCard } = require("songcard");
const { AttachmentBuilder } = require("discord.js");

client.on("interactionCreate", async (interaction) => {
  const cardImage = await simpleCard({
    imageBg: "https://i.scdn.co/image/ab67616d00001e02684d81c9356531f2a456b1c1",
    imageText: "群青",
  });

  const attachment = new AttachmentBuilder(cardImage, {
    name: "card.png",
  });

  interaction.channel.send({
    files: [attachment],
  });
});

client.login("token");
