# SharpBot
SharpBot is an ever-expanding selfbot for Discord.js v11 with mostly utilitarion commands, but also a few fun commands.

> If you're worried about getting banned or otherwised punished by Discord for using a selfbot, or you just haven't read the rules yet, see [here](/RULES.md)

#### Table of contents
- [Requirements](#requirements)
- [Installing](#installing)
- [Updating](#updating)
- [Running](#running)
- [Getting your user-token](#getting-your-user-token)
- [Credits](#credits)
- [Join Me](#join-me)

## Usage
### Requirements
- `git`
- [`node`](https://nodejs.org/en/download/current/)
- [`yarn`](https://yarnpkg.com/docs/install)

> ### Important
If you have NPM but not yarn, please install it. Yarn is faster and more reliable, *and the project depends on it.*

### Installing

```bash
git clone https://github.com/Rayzr522/SharpBot.git
cd SharpBot
yarn
```

- Rename `config.json.example` in the `src` folder to `config.json`
- Edit `config.json` and enter your [user-token](#getting-your-user-token)

### Updating
Minor updates can be acquired by running `//exec git pull` in Discord to run the `git pull` command on your computer. Some updates, however, change too much to be updated like that, and instead you must do the following commands in your terminal/command prompt:

```bash
# Go to the SharpBot folder
cd path/to/SharpBot
# Pull in any changes
git pull
# Install new dependencies
yarn
```

### Running
Assuming you have set up the config file with the user-token, just do `yarn start` to run the bot.

### Getting your user-token
1. Hit `CTRL+SHIFT+I` (`CMD+ALT+I` on macOS) to bring up the Developers Console
> If you already see the `Application` tab, you can skip step 2
2. At the top, click on the arrow pointing to the right
3. Click `Application`
4. Go to `Local Storage` under the `Storage` section
5. Click on `https://discordapp.com`
6. At the bottom of the list, the last key should be `token`
7. Copy the value on the right side (omitting the quotes)

> Just a note, instead of `yarn` you could do `npm install`, but I use yarn because it is much faster and a lot more stable. I would HIGHLY suggest you use it.

## Credits
The bot was originally a modified version of [eslachance's djs-selfbot-v9]([here](https://github.com/eslachance/djs-selfbot-v9), but over time I've completely rewritten it. The commands are a compilation of my own work as well as snippets found online.

## Join Me
If you need help with my bot, have a feature to request or just want to chat, you can join my Discord server! If you don't have Discord, don't worry. It only takes a few moments to sign up.

[![Discord Badge](https://github.com/Rayzr522/ProjectResources/raw/master/RayzrDev/badge-small.png)](https://discord.io/rayzrdevofficial)