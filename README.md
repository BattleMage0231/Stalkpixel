<!-- 
This README was created based on a template found at https://github.com/othneildrew/Best-README-Template
Full credit for this template goes to othneildrew and contributors.
-->

<br />
<p align="center">
  <h1 align="center">Stalkpixel</h3>
  <p align="center">
    A lightweight Node.js application to stalk Hypixel players
    <br />
  </p>
</p>



<!-- TABLE OF CONTENTS -->
## Table of Contents

- [Table of Contents](#table-of-contents)
- [About The Project](#about-the-project)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
  - [Specify a List of Players](#specify-a-list-of-players)
  - [Continuously Follow a Player](#continuously-follow-a-player)
  - [API Key as Argument](#api-key-as-argument)
- [Acknowledgements](#acknowledgements)



<!-- ABOUT THE PROJECT -->
## About The Project

![product-screenshot](assets/Capture.PNG)

Stalkpixel is a lightweight Node.js CLI application that can determine whether and where a player is on the Hypixel Network. It utilizes the Mojang and Hypixel public APIs to get this information. Then, it uses data files from the Slothpixel API to parse this data. Stalkpixel can be used to stalk YouTubers, staff members, your friends, or any random player.

<!-- GETTING STARTED -->
## Getting Started

This guide assumes that you have some experience with the terminal.

### Prerequisites

To use this application, you must have npm and Node.js installed.

### Installation
 
Run the following command to install Stalkpixel.
```sh
npm install -g stalkpixel
```
You can also clone or download this repository, and then install dependencies manually.
```sh
git clone https://github.com/BattleMage0231/Stalkpixel.git
cd stalkpixel
npm install
node . --stalk BattleMage_ # to run
```



<!-- USAGE EXAMPLES -->
## Usage

Before you use the application, you must first run the following command to set your API key. You can follow [these instructions](https://github.com/HypixelDev/PublicAPI/blob/master/README.md#obtaining-an-api-key) to get your API key. Please be aware that your API key is stored in plaintext form in stalkpixel/config/config.json. This means that anybody with access to your device with knowledge of this application may be able to find your API key.
```sh
stalkpixel --setapikey <YOUR_KEY_HERE>
```

To run the application, run
```sh
stalkpixel
```

By default, the application calls the APIs with all players specified in config.json. To call it with a different list of players, you can change that list using terminal flags specified in the documentation or see instructions below.

### Specify a List of Players
```sh
stalkpixel --stalk PLAYER1 PLAYER2 PLAYER3 PLAYER4
```

The --stalk flag tells the application to call the APIs with the specified list of players rather than with those found in config.json.

### Continuously Follow a Player
```sh
stalkpixel --follow PLAYER1
```

The --follow flag tells the application to continously stalk a player once every 5 seconds.

### API Key as Argument
```sh
stalkpixel --key API_KEY
```

The --key flag is an alternative method of providing your API key. It overrides the key found in config.json.


<!-- ACKNOWLEDGEMENTS -->
## Acknowledgements
* [Mojang API](https://wiki.vg/Mojang_API)
* [Hypixel API](https://github.com/HypixelDev/PublicAPI)
* [Slothpixel Core](https://github.com/slothpixel/core)
* [Slothpixel Constants](https://github.com/slothpixel/hypixelconstants)
* [README Template](https://github.com/othneildrew/Best-README-Template)