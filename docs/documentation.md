# Documentation

This file documents all terminal flags and arguments that can be passed into Stalkpixel.

## Help
```sh
node . -h
```
```
Options:
  --version, -v      Show version number                               [boolean]
  --stalk, -s        Stalks the following list of players                [array]
  --json, -j         Stalks players in the given JSON files              [array]
  --key, -k          Externally provides an API key                     [string]
  --online-only, -o  Only displays statuses of players that are online [boolean]
  --no-msg           Do not print the start and finishing messages     [boolean]
  --no-dump          Do not print JSON dumps for online players        [boolean]
  --help, -h         Show help                                         [boolean]
```

Passing --help or -h will display a help menu on all options that can be passed.

## Version
```sh
node . -v
```
```
1.0.0
```

Passing --version or -v will display the version of the application.

## Specify a List of Players
```sh
node . --stalk BattleMage_ Computer__Genius
```
```
This API function can be disabled in game, so some offline players may actually be online

BattleMage_ is Online
  In a Bed Wars lobby
  JSON dump: {"online":true,"gameType":"BEDWARS","mode":"LOBBY"}

Computer__Genius is Not Online

Finished fetching statuses
```

The --stalk or -s flag tells the application to call the APIs with the specified list of players rather than with those found in targets.json.

## Specify JSON Files
```sh
node . --json file1.json dir1/file2.json
```

The --json or -j flag tells the application to call the APIs with players found in the specified JSON files. These files must follow the same structure as targets.json to be valid.

## API Key as Argument
```sh
node . --key API_KEY
```

The --key or -k flag is an alternative method of providing your API key. It overrides the key found in secrets.json.

## Only Display Online Players
```sh
node . --online-only
```
```
This API function can be disabled in game, so some offline players may actually be online

BattleMage_ is Online
  In a Bed Wars lobby
  JSON dump: {"online":true,"gameType":"BEDWARS","mode":"LOBBY"}

Finished fetching statuses
```

The --online-only or -o flag tells the application to not display error messages and messages that say that a player is offline. In other words, it only displays online players.

## Don't Display Messages
```sh
node . --no-msg --stalk BattleMage_ Computer__Genius
```
```
BattleMage_ is Online
  In a Bed Wars lobby
  JSON dump: {"online":true,"gameType":"BEDWARS","mode":"LOBBY"}

Computer__Genius is Not Online
```

The --no-msg flag tells the application to not display the starting and finishing messages.

## Don't Display JSON Dumps
```sh
node . --no-dump --stalk BattleMage_ Computer__Genius
```
```
This API function can be disabled in game, so some offline players may actually be online

BattleMage_ is Online
  In a Bed Wars lobby

Computer__Genius is Not Online

Finished fetching statuses
```

The --no-dump flag tells the application to not show the JSON dump for online players.

## Cache UUID for Reuse
```sh
node . --stalk BattleMage_ Computer__Genius --cache
```

The --cache flag tells the application to save its fetched player UUIDs (from the Mojang API). It stores them in src/data/cache.json as a JSON object. If any players of the same name are queried in the future, Stalkpixel will forego the Mojang API call.

However, this can get the wrong result if the player changed their name. If you are getting weird errors, it may be because of this and you may want to clear the cache or recache their name.

The cache flag saves its data after execution is done, so quitting prematurely will cause it to lose all new data.

## Clear Cached Data
```sh
node . --uncache BattleMage_
```

The --uncache flag tells the application to uncache the following array of names from the cache. 

The uncache flag saves its data after execution is done, so quitting prematurely will cause it to lose all new data.
