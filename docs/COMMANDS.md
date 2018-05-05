
## 8ball 
Asks the magic 8-ball a question
#### Usage 
` 8ball <question> `<br><br>

## Anim 
"Animates" a series of emojis
#### Usage 
` anim [-d <delay>] <emoji> [emoji2] [...] `<br><br>

## Avatar 
Gives you the avatar of a user
#### Usage 
` avatar <user> `<br><br>

## Bill 
Be like Bill!
#### Usage 
` bill `<br><br>

## Binary 
Convert your input to/from binary
#### Usage 
` binary <encodeText|decodeText|decToBin|binToDec> <input> `<br><br>

## Calculate 
Calculates any math equation
#### Usage 
` calculate <equation> `<br><br>

## Cat 
Sends a random cat image
#### Usage 
` cat `<br><br>

## Clap 
Clapifies your text
#### Usage 
` clap <text> `<br><br>

## Color 
Shows information and a preview of a hex color
#### Usage 
` color <hex> `<br><br>

## Destruct 
creates a self-destructing message
#### Usage 
` destruct [-d delay in ms]  [-s <embed|inline|code|plain>] <message> `
#### Command options 
* ` -d <delay in ms> ` — Sets the time (in ms) for the message to be deleted. (Default: 5 seconds)

* ` -s <embed|inline|code|plain> ` — Sets the message style (default: plain)

<br><br>

## Dictionary 
Looks a word up in the dictionary.
#### Usage 
` dictionary <word> `<br><br>

## Dog 
Sends a random dog image
#### Usage 
` dog `<br><br>

## Embed 
Sends a message via embeds
#### Usage 
` embed [text] `
##### Usage examples 
* ` embed Hello world! `

* ` embed -c #ff0000 Red is my favorite color :heart: `

* ` embed -r -t "Welcome to my server!" I hope you enjoy your time here. `


#### Command options 
* ` -f ` — Shows the footer

* ` -ft <text> ` — Sets the footer text (use quotes for multiple words)

* ` -d ` — Enables the timestamp (date) in the footer

* ` -t <text> ` — Sets the embed title (use quotes for multiple words)

* ` -r ` — Uses your role color for the embed color

* ` -c <color> ` — Sets a hex color for the embed in the format of `#RRGGBB`

* ` -i <url> ` — Sets an image for the embed

* ` -a <name> ` — Sets the author of the embed

* ` -th <url> ` — Sets a thumbnail for the embed

<br><br>

## Emoji 
Shows information about an emoji
#### Usage 
` emoji <emoji> `<br><br>

## Eval 
Evaluates arbitrary JavaScript
#### Usage 
` eval <code> `
#### Command options 
* ` -l <lang> ` — Sets the output code-block syntax language

* ` -i ` — Inline extra-long output in addition to uploading to hastebin

* ` -q ` — Does not print any output

<br><br>

## Exec 
Executes a command in the console
#### Usage 
` exec <command> `
#### Command options 
* ` -s ` — Runs in silent mode, not showing any console output

* ` -l <lang> ` — Sets the language of the outputted code block

* ` -r ` — Sends the output raw, without any code blocks

* ` -d ` — Deletes the command message

* ` -f ` — Interperts the response as a file URL/path to send

* ` -fn <name> ` — Sets the name for the sent file

* ` -w ` — Wait for the program to finish before sending the output

<br><br>

## Fanceh 
Renders text in big emoji letters
#### Usage 
` fanceh <text> `<br><br>

## Figlet 
Renders fancy ASCII text
#### Usage 
` figlet <text> `
#### Command options 
* ` -f <font> ` — Sets the font to use

* ` -l ` — Lists all available fonts

<br><br>

## Fliptext 
Flips your text!
#### Usage 
` fliptext <text> `<br><br>

## Flush 
Deletes a certain number of messages sent by bots
#### Usage 
` flush [amount] `<br><br>

## Gif 
Searches Giphy for GIFs
#### Usage 
` gif <query> `<br><br>

## Gist 
Uploads some text to a GitHub Gist
#### Usage 
` gist <text> `
#### Command options 
* ` -r ` — Returns the URL for a raw version of your upload

<br><br>

## Github 
Links to a GitHub repository
#### Usage 
` github <user/repo> `<br><br>

## Google 
Searches Google using magic
#### Usage 
` google <search> `<br><br>

## Guilds 
Lists all guilds that you're a member of
#### Usage 
` guilds `<br><br>

## Haste 
Uploads some text to Hastebin
#### Usage 
` haste <text> `
#### Command options 
* ` -r ` — Returns the URL for a raw version of your upload

<br><br>

## Help 
Shows you help for all commands or just a single command
#### Usage 
` help all|[command]|[category <name>] `<br><br>

## Image 
Sends an image from a URL
#### Usage 
` image <url> `<br><br>

## Imagedumper 
Grabs all images from the specified amount of messages (max 100)
#### Usage 
` imagedumper <amount> `<br><br>

## Initial 
Transforms the text you input into Initial Caps
#### Usage 
` initial <text> `<br><br>

## Jumbo 
Enlarges emojis!
#### Usage 
` jumbo <emoji> `<br><br>

## Leet 
Talk like true gamers
#### Usage 
` leet <text> `
#### Command options 
* ` -e ` — Use extended l33t $p3@k

* ` -t ` — Translate from leet speak into English

<br><br>

## Lmgtfy 
Links to LMGTFY with the given search text
#### Usage 
` lmgtfy [search text] `
#### Command options 
* ` -i ` — Enables Internet Explainer

<br><br>

## Meme 
Helps you generate meme images with custom text
#### Usage 
` meme list | info <name> | [<name> | <line 1> | <line 2> | [style]] `
##### Usage examples 
* ` meme info sad-biden `

* ` meme facepalm | please, oh please | rtfm `

* ` meme sad-biden | sad joe biden | doesn't have discord | scowl `

<br><br>

## Mutual 
Finds users who are in a given server that you are in
#### Usage 
` mutual <server> `<br><br>

## Ping 
Pings the bot
#### Usage 
` ping [-o] `
#### Command options 
* ` -o ` — Shows the old ping message (animated)

<br><br>

## Playerinfo 
Shows information about a Minecraft player
#### Usage 
` playerinfo <username> `<br><br>

## Prefix 
Sets the bot prefix
#### Usage 
` prefix <new prefix> `<br><br>

## Prune 
Deletes a certain number of messages sent by you
#### Usage 
` prune [amount] `<br><br>

## Purge 
Deletes a certain number of messages
#### Usage 
` purge [amount] `<br><br>

## Quote 
Quotes the message with the given ID and channel ID.
#### Usage 
` quote <id> [#channel | channel ID] `<br><br>

## React 
Reacts to the last sent message (or another message) with a given text (cannot contain spaces)
#### Usage 
` react <text> [message ID] `<br><br>

## Restart 
Restarts the bot
#### Usage 
` restart `<br><br>

## Reverse 
Reverses the text you input
#### Usage 
` reverse <text> `<br><br>

## Roll 
rolls X dice with Y sides. Supports standard dice notation
#### Usage 
` roll XdY <reason> `<br><br>

## Say 
Says the message you put. Useful for shortcuts.
#### Usage 
` say <message> `
#### Command options 
* ` -c <channel|channel ID> ` — Specifies a specific channel to send the message in

<br><br>

## Search 
Searches a number of messages for some text
#### Usage 
` search <#> <text> `<br><br>

## Serverinfo 
Shows info of the server you are in
#### Usage 
` serverinfo `<br><br>

## Setgame 
Sets your game (shows for other people)
#### Usage 
` setgame <game> `
#### Command options 
* ` -s <url> ` — Sets your streaming URL to http://twitch.tv/<url>

* ` -w ` — Sets your game prefix to **Watching**

* ` -l ` — Sets your game prefix to **Listening to**

<br><br>

## Shoot 
Shoots yer friendz!
#### Usage 
` shoot <user> `<br><br>

## Shortcuts 
Controls or lists your shortcuts
#### Usage 
` shortcuts [add <name> <command>|edit <name> <command>|delete <name>|info <name>] `
##### Usage examples 
* ` shortcuts add love embed -c #ff0000 <3 `

* ` shortcuts edit drpg say #!mine;; say #!forage;; say #!chop;; say #!fish `

* ` shortcuts delete invite `

* ` shortcuts info love `

* ` shortcuts `

<br><br>

## Shorturl 
Shortens a URL
#### Usage 
` shorturl <url> `<br><br>

## Shutdown 
Fully shuts the bot down
#### Usage 
` shutdown `<br><br>

## Sigh 
Dramatic sigh text
#### Usage 
` sigh `<br><br>

## Space 
Spaces out text to look all dramatic n' stuff
#### Usage 
` space [amount] <text> `<br><br>

## Spotify 
Parses a spotify-uri and outputs its information.
#### Usage 
` spotify <url> `
##### Usage examples 
* ` spotify spotify:track:5DkCAVqn09WAPOPiphKOUD `

* ` spotify -preview spotify:track:5DkCAVqn09WAPOPiphKOUD `

* ` spotify https://open.spotify.com/track/5DkCAVqn09WAPOPiphKOUD `


#### Command options 
* ` -preview ` — Sends another message where discord places it's own embedded player

<br><br>

## Stats 
Shows you stats about SharpBot
#### Usage 
` stats `<br><br>

## Status 
Sets your status
#### Usage 
` status <online|idle|dnd|invisible> `<br><br>

## Tag 
Manages your tags
#### Usage 
` tag <name>|list|add <name> <content>|delete <name> `<br><br>

## Timezone 
converts between timezones, using DuckDuckGo searches
#### Usage 
` timezone <time> to <time> `<br><br>

## Tiny 
Converts your text to tiny letters!
#### Usage 
` tiny <text> `<br><br>

## Todo 
Manage a todo list. The command by itself will show the items in the current list.
#### Usage 
` todo | todo [options...] <index> | todo <text of item to add> `
#### Command options 
* ` -c  ` — Mark an item complete

* ` -i  ` — Mark an item incomplete

* ` -d ` — Delete an item

* ` -l ` — Show all lists

* ` -n  ` — Make a new list and set it as the current list

* ` -r  ` — Remove a list. If the list being removed is the list currently in use, automatically switches back to the Main list.

* ` -s  ` — Switch lists

<br><br>

## Translate 
Translates text from/to any language
#### Usage 
` translate <lang> <text> `
#### Command options 
* ` -e ` — Edits your message with the translation instead of showing an embed

* ` -f <language> ` — Sets the `from` language, this is `auto` by default

<br><br>

## Undelete 
Undeletes messages
#### Usage 
` undelete <mention of user> `<br><br>

## Urban 
Looks a word up in the urban dictionary.
#### Usage 
` urban <word> `<br><br>

## Userinfo 
Shows info about a user
#### Usage 
` userinfo <user> `<br><br>

## Users 
Lists all users on your current server
#### Usage 
` users [role] `<br><br>

## Weather 
Shows weather info for city
#### Usage 
` weather <city> `<br><br>

## Xkcd 
Fetches random or specific XKCD comics
#### Usage 
` xkcd [latest|<id>] `<br><br>
