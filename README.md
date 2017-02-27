# SharpBot
SharpBot is an ever-expanding selfbot for Discord.js v11 with mostly utilitarion commands, but also a few fun commands.

## Downloading
Make sure that the `git` command-line tools are installed on your computer, as well as [yarn](https://github.com/yarnpkg/yarn). If you have `npm` but not `yarn`, install it by going [here](https://yarnpkg.com/en/docs/install).

- `git clone https://github.com/Rayzr522/SharpBot.git`
- `cd SharpBot`
- `yarn`
- Rename `selfbot.sqlite.example` in the root folder to `selfbot.sqlite`
- Rename `config.json.example` in the `src` folder to `config.json`
- Edit `config.json` and enter your user-token

> You can get your user-token by going to Discord, hitting `CTRL+SHIFT+I` on Windows or `CMD+ALT+I` on a Mac, going into the console tab, and typing in `localStorage.token`
> If the developer panel does not open, make sure that `Settings > Appearance > Developer Mode` is turned on. 

> Just a note, instead of `yarn` you could do `npm install`, but I use yarn because it is much faster and a lot more stable. I would HIGHLY suggest you use it.

## Running
Assuming you have set up the config file with the user-token, just do `yarn start` to to run the bot.

> Again, if you have `npm` and not `yarn` then you can do `npm run start` instead. I cannot gaurantee this will work! `npm` is not very stable.

## Credits
I can't possibly credit all the various places I have learned from, but the original base for the selfbot came from [here](https://github.com/eslachance/djs-selfbot-v9). The tag-related commands, as well as `prune` and `purge` are basically the only remaining parts of the original code, and even **they** have been modified to some degree or another. The rest is all either my code, or snippets I have found online (but mostly just my code).

## Join Me
[![Discord Badge](https://github.com/Rayzr522/ProjectResources/raw/master/RayzrDev/badge-small.png)](https://discord.io/rayzrdevofficial)