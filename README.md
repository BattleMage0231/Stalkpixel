<!-- 
This README was created based on a template found at https://github.com/othneildrew/Best-README-Template
Full credit for this template goes to othneildrew and contributors.
-->

<br />
<p align="center">
  <h1 align="center">Stalkpixel</h3>
  <p align="center">
    A lightweight NodeJS application to stalk Hypixel players
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
  - [Specify JSON Files](#specify-json-files)
  - [API Key as Argument](#api-key-as-argument)
- [Contributing](#contributing)



<!-- ABOUT THE PROJECT -->
## About The Project

![product-screenshot](assets/Capture.PNG)

Stalkpixel is a lightweight NodeJS application that can determine whether and where a player is on the Hypixel Network. It can be used to stalk YouTubers, staff members, or your friends.

<!-- GETTING STARTED -->
## Getting Started

Follow these simple steps to download and install Stalkpixel.

### Prerequisites

To use this application, you must have npm and NodeJS installed.

### Installation
 
1. Clone or download the repository
```sh
git clone https://github.com/BattleMage0231/Stalkpixel.git
```
2. Navigate into the main directory
```sh
cd stalkpixel
```
3. Install NPM packages
```sh
npm install
```



<!-- USAGE EXAMPLES -->
## Usage

Before you use the application, you must first edit the apikey property in secrets.json to include your API key. You can follow [these instructions](https://github.com/HypixelDev/PublicAPI/blob/master/README.md#obtaining-an-api-key) to get your API key.
```json
{
    "apikey": "<YOUR_KEY_HERE>"
}
```

To run the application, navigate into the main directory and run
```sh
node .
```

By default, the application calls the APIs with all players specified in targets.json. To call it with a different list of players, you can change that list or see instructions below.

### Specify a List of Players
```sh
node . --stalk PLAYER1 PLAYER2 PLAYER3 PLAYER4
```

The --stalk flag tells the application to call the APIs with the specified list of players rather than with those found in targets.json.

### Specify JSON Files
```sh
node . --json file1.json dir1/file2.json
```

The --json flag tells the application to call the APIs with players found in the specified JSON files. These files must follow the same structure as targets.json to be valid.

### API Key as Argument
```sh
node . --key API_KEY
```

The --key flag is an alternative method of providing your API key. It overrides the key found in secrets.json.



## Contributing

This project is not fully mature and is in need of many more features. As such, contributions in the form of PRs would be greatly appreciated. Specifically, following are things that need to be added or improved:
1. Parsing identifiers returned by the Hypixel API as readible names
2. Adding more command line arguments
