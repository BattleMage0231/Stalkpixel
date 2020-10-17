# Documentation

This file documents all terminal flags and arguments that can be passed into Stalkpixel.

## Help
```sh
stalkpixel -h
```
```
Options:
  --version, -v      Show version number                               [boolean]
  --config           Opens the configuration file in your text editor  [boolean]
  --stalk, -s        Stalks the following list of players                [array]
  --key, -k          Externally provides an API key                     [string]
  --online-only, -o  Only displays statuses of players that are online [boolean]
  --no-dump          Do not print JSON dumps for online players        [boolean]
  --cache            Caches player UUIDs for less future API calls     [boolean]
  --uncache          Uncaches the following list of names                [array]
  --follow, -f       Continuously query a player every 10 seconds       [string]
  --help, -h         Show help                                         [boolean]
```

Passing --help or -h will display a help menu on all options that can be passed.

## Version
```sh
stalkpixel -v
```
```
1.0.3
```

Passing --version or -v will display the version of the application.

## Config
```sh
stalkpixel --config
```
```
Opened the config file in your default editor.
```

The --config flag opens the configuration file for Stalkpixel in your default text editor. By modifying this file, you can change the default API key and the list of targets.

In the future, the config file will also have many other options.

## Specify a List of Players
```sh
stalkpixel --stalk BattleMage_ Computer__Genius
```
```
This API function can be disabled in game, so some offline players may actually be online

BattleMage_ is Online
  In a Bed Wars lobby
  JSON dump: {"online":true,"gameType":"BEDWARS","mode":"LOBBY"}

Computer__Genius is Offline

Finished fetching statuses
```

The --stalk or -s flag tells the application to call the APIs with the specified list of players rather than with those found in config.json.

## API Key as Argument
```sh
stalkpixel --key API_KEY
```

The --key or -k flag is an alternative method of providing your API key. It overrides the key found in config.json.

## Only Display Online Players
```sh
stalkpixel --online-only
```
```
This API function can be disabled in game, so some offline players may actually be online

BattleMage_ is Online
  In a Bed Wars lobby
  JSON dump: {"online":true,"gameType":"BEDWARS","mode":"LOBBY"}

Finished fetching statuses
```

The --online-only or -o flag tells the application to not display error messages and messages that say that a player is offline. In other words, it only displays online players.

The --no-msg flag tells the application to not display the starting and finishing messages.

## Ignore JSON Dumps
```sh
stalkpixel --no-dump --stalk BattleMage_ Computer__Genius
```
```
This API function can be disabled in game, so some offline players may actually be online

BattleMage_ is Online
  In a Bed Wars lobby

Computer__Genius is Offline

Finished fetching statuses
```

The --no-dump flag tells the application to not display the JSON dump for online players.

## Cache UUID
```sh
stalkpixel --stalk BattleMage_ Computer__Genius --cache
```

The --cache flag tells the application to save its fetched player UUIDs (from the Mojang API). It stores them in stalkpixel/src/data/cache.json as a JSON object. If any players of the same name are queried in the future, Stalkpixel will forego the Mojang API call.

However, this can get the wrong answer if the player changed their name. If you are getting weird errors, it may be because of this and you may want to clear the cache or recache their name.

The cache flag saves its data after execution is done, so quitting prematurely will cause it to lose all new data.

## Clear Cached Data
```sh
stalkpixel --uncache BattleMage_
```

The --uncache flag tells the application to uncache the following array of usernames from the cache.

The uncache flag saves its data after execution is done, so quitting prematurely will cause it to lose all new data.

The --addtargets flag appends the following list of players to the default stalk list.

## Continuously Follow a Player
```sh
stalkpixel --follow PLAYER1
```

The --follow or -f flags tells the application to continously stalk a player once every 5 seconds. During this, you can hold CTRL-C or its equivalent to exit.
