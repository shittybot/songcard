<div align="center">
  <h1>songcard</h1>
  <p>A simple package to create song card when play songs in discord.</p>
  <p>
  <a href="https://www.npmjs.com/package/songcard"><img src="https://img.shields.io/npm/v/songcard?maxAge=3600" alt="NPM version" /></a>
  <p>
  <p>
    <a href="https://www.npmjs.com/package/songcard"><img src="https://nodei.co/npm/songcard.png?downloads=true&stars=true" alt="NPM Banner"></a>
  </p>

  <p>This package was originally used only for my personal needs to generate a song card when users play songs using my Discord bot, but then I decided to make this package open source and let everyone use it.</p>
  </div>
  <br>

  ## Install
```sh
npm install songcard
# or
yarn add songcard
```

## Example
```js
const createCard = require("songcard"); // Import
const { AttachmentBuilder } = require("discord.js");

client.on("interactionCreate", async (message) => {
    
    const cardImage = await createCard(
        imageBg =  "https://images-ext-1.discordapp.net/external/uw_-bWFyeXnWb11wGThe2CAbTYdrxzFqMJ2trxDIYVE/https/i.scdn.co/image/ab67616d0000b2738ad8f5243d6534e03b656c8b?width=468&height=468",
        imageText = "Die For You (with Ariana Grande) - Remix",
        trackStream = false,
        trackDuration = 220000,
        trackTotalDuration = 233000,
    );

    const attachment = new AttachmentBuilder(cardImage, {
        name: "card.png",
    });

    interaction.channel.send({
        files: [attachment],
    });
});

client.login("token");
```

## Usage

| Option                 | Type                   | Description                                                                                                                                          |
|------------------------|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------|
| imageBg                | String                  | Image that will be display to the songcard. <br><br> Example: https://images-ext-1.discordapp.net/external/uw_-bWFyeXnWb11wGThe2CAbTYdrxzFqMJ2trxDIYVE/https/i.scdn.co/image/ab67616d0000b2738ad8f5243d6534e03b656c8b?width=468&height=468 <br>File format: PNG/JPEG                      |
| imageText              | String                  | Text that will be display to the songcard.                                                                                                        |
| trackStream            | Boolean                 | Whether to set the trackDuration and trackTotalDuration to `LIVE`<br><br>Example: if trackStream is `true` the trackDuration and totalTrackDuration will show as `LIVE` else it will show number. |
| trackDuration          | Integer                 | Show current duration of the songs. If no value provide it will show `0:00`.                                                                                                      |
| trackTotalDuration     | Integer                 | Show the songs duration.                                                                                                    |

<br>
<br>

![](https://cdn.discordapp.com/attachments/897715616155328542/1146301148706390036/image.png)

<br>

![](https://cdn.discordapp.com/attachments/959777491818528788/1146131591131832330/card.png)



