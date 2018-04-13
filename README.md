#### Table of contents
- [Requirements](#requirements)
- [Installing](#installing)
- [Updating](#updating)
- [Running](#running)
- [Getting your user-token](#getting-your-user-token)
- [Getting your bot-token](#getting-your-bot-token)
- [Credits](#credits)
- [Join Me](#join-me)

## Usage
### Installing (Outside of Glitch)
#### Linux & macOS quick-installer
For those of you running Linux/Unix, this nifty little command should do everything for you:

```bash
bash -c "$(curl -fsSL https://rawgit.com/RayzrDev/SharpBot-installer/master/install.sh)"
```
Now run `yarn start` to start the bot. 

**Note:** The first time you start the bot you will enter the setup wizard. It takes just a few seconds to enter the needed information, and it sets up the bot for you.

### Updating
Minor updates can be acquired by running `//exec git pull` in Discord to run the `git pull` command on the bot, if it has been updated since. Some updates, however, change too much to be updated like that, and instead you must do the following commands in your terminal/command prompt:
```bash
# Pull in any changes
git pull
# Install new dependencies
yarn install
```

### Running
```bash
# Start the bot up
yarn start
```

### Reconfigure the Bot
```bash
yarn run config
```
### Getting your user-token (SelfBot)
0. Open the Discord application
1. Hit `CTRL+SHIFT+I` (`CMD+ALT+I` on macOS) to bring up the Developers Console
> If you already see the `Application` tab, you can skip step 2
2. At the top, click on the arrow pointing to the right
3. Click `Application`
4. Go to `Local Storage` under the `Storage` section
5. Click on `https://discordapp.com`
6. At the bottom of the list, the last key should be `token`
7. Copy the value on the right side (omitting the quotes)

### Getting your bot-token (Dedicated)
0. Read this quick howto get a botToken from a discord app [here:] (https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token)
## Credits
Credits to RayzrDev for rebase, anything that is working correctly is prolly his code.
https://github.com/eslachance/evie.selfbot
The bot was originally a modified version of [eslachance's djs-selfbot-v9](https://github.com/eslachance/djs-selfbot-v9), but over time I've completely rewritten it. The commands are a compilation of my own work as well as snippets found online.
