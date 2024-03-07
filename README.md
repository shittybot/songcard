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
<br>

## Usage

| Option                 | Type                   | Description                                                                                                                                          |
|------------------------|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------|
| imageBg                | String                  | Image that will be display to the songcard. <br><br> Example: https://images-ext-1.discordapp.net/external/uw_-bWFyeXnWb11wGThe2CAbTYdrxzFqMJ2trxDIYVE/https/i.scdn.co/image/ab67616d0000b2738ad8f5243d6534e03b656c8b?width=468&height=468 <br>File format: PNG/JPEG                      |
| imageText              | String                  | Text that will be display to the songcard.                                                                                                        |
| trackStream            | Boolean                 | Whether to set the trackDuration and trackTotalDuration to `LIVE`<br><br>Example: if trackStream is `true` the trackDuration and totalTrackDuration will show as `LIVE` else it will show number. |
| trackDuration          | Integer                 | Show current duration of the songs. If no value provide it will show `0:00`.                                                                                                      |
| trackTotalDuration     | Integer                 | Show the songs duration.                                                                                                    |

<br>

# Themes

## 1. Classic


![](https://cdn.discordapp.com/attachments/959777491818528788/1215117638498258994/card.png?ex=65fb957c&is=65e9207c&hm=c9ac7d6611677d0279395a0da55a34efd6b29addd245577b4a0d47cbbabbc6cd&)

### Example

```js
const { classicCard } = require("songcard");
const { AttachmentBuilder } = require("discord.js");

client.on("interactionCreate", async (message) => {
    
    const cardImage = await classicCard({
        imageBg: "https://images-ext-1.discordapp.net/external/uw_-bWFyeXnWb11wGThe2CAbTYdrxzFqMJ2trxDIYVE/https/i.scdn.co/image/ab67616d0000b2738ad8f5243d6534e03b656c8b?width=468&height=468",
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
```
<br>

## 2. Simple

![](https://media.discordapp.net/attachments/959777491818528788/1215115258000183396/card.png?ex=65fb9345&is=65e91e45&hm=6b67d2ccbe049a6d6d859607f3d948635ea7f10bb6e5e35316c4e02697ee52be&=&format=webp&quality=lossless&width=300&height=300)

### Example

```js
const { simpleCard } = require("songcard");
const { AttachmentBuilder } = require("discord.js");

client.on("interactionCreate", async (message) => {
    
    const cardImage = await simpleCard({
      imageBg:
        "https://i.scdn.co/image/ab67616d0000b27328862817fc34472677afb214",
      imageText: "Yesterday",
    });

    const attachment = new AttachmentBuilder(cardImage, {
        name: "card.png",
    });

    interaction.channel.send({
        files: [attachment],
    });
});

client.login("token");
```


