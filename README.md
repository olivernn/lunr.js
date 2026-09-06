# Lunr.js

[![Join the chat at https://gitter.im/olivernn/lunr.js](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/olivernn/lunr.js?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![Build Status](https://travis-ci.org/olivernn/lunr.js.svg?branch=master)](https://travis-ci.org/olivernn/lunr.js)

A bit like Solr, but much smaller and not as bright.

## Example

A very simple search index can be created using the following:

```javascript
var idx = lunr(function () {
  this.field('title')
  this.field('body')

  this.add({
    "title": "Twelfth-Night",
    "body": "If music be the food of love, play on: Give me excess of it…",
    "author": "William Shakespeare",
    "id": "1"
  })
})
```

Then searching is as simple as:

```javascript
idx.search("love")
```

This returns a list of matching documents with a score of how closely they match the search query as well as any associated metadata about the match:

```javascript
[
  {
    "ref": "1",
    "score": 0.3535533905932737,
    "matchData": {
      "metadata": {
        "love": {
          "body": {}
        }
      }
    }
  }
]
```

[API documentation](https://lunrjs.com/docs/index.html) is available, as well as a [full working example](https://olivernn.github.io/moonwalkers/).

## Description

Lunr.js is a small, full-text search library for use in the browser.  It indexes JSON documents and provides a simple search interface for retrieving documents that best match text queries.

## Why

For web applications with all their data already sitting in the client, it makes sense to be able to search that data on the client too.  It saves adding extra, compacted services on the server.  A local search index will be quicker, there is no network overhead, and will remain available and usable even without a network connection.

## Installation

Simply include the lunr.js source file in the page that you want to use it.  Lunr.js is supported in all modern browsers.

Alternatively an npm package is also available `npm install lunr`.

Browsers that do not support ES5 will require a JavaScript shim for Lunr to work. You can either use [Augment.js](https://github.com/olivernn/augment.js), [ES5-Shim](https://github.com/kriskowal/es5-shim) or any library that patches old browsers to provide an ES5 compatible JavaScript environment.

## Features

* Full text search support for 14 languages
* Boost terms at query time or boost entire documents at index time
* Scope searches to specific fields
* Fuzzy term matching with wildcards or edit distance

## Contributing

See the [`CONTRIBUTING.md` file](CONTRIBUTING.md).


## 🌐 Web Resources & Verified Articles Directory
- [MERGE THE COINS USSR](https://trochoimienphi24h.github.io/merge-the-coins-ussr.html)
- [WORDS FROM WORDS](https://jogosweb-brasil24.netlify.app/words-from-words.html)
- [FARM VS ZOMBIES](https://luchshie-igry-rus.pages.dev/farm-vs-zombies.html)
- [PERFECT ASMR CLEANING](https://mir-igr-onlayn.pages.dev/perfect-asmr-cleaning.html)
- [MASTER ADDICTION SOLITAIRE](https://unblocked-action-arena.netlify.app/master-addiction-solitaire.html)
- [MERGE FELLAS ONLINE](https://turbodrift-zone.web.app/merge-fellas-online.html)
- [PUMPKIN PATCH](https://sieuthigame-viet.pages.dev/pumpkin-patch.html)
- [FLOAT FOR BRAINROTS](https://unblocked-galaxy-hub.pages.dev/float-for-brainrots.html)
- [CONSOLE IDLE](https://zona-igr-besplatno.web.app/console-idle.html)
- [KITSUNE](https://bf-market-guide.netlify.app/calculator/kitsune)
- [KITTY SCRAMBLE](https://muryo-geim-nara.web.app/kitty-scramble.html)
- [GROW WARSIO](https://speed-racing-hub.netlify.app/grow-warsio.html)
- [SWEET TRIPLE MAHJONG](https://congdonggame-vietnam.web.app/sweet-triple-mahjong.html)
- [UNICORN FIND THE DIFFERENCES](https://koreagame-webhub.github.io/unicorn-find-the-differences.html)
- [BUDDHA](https://bloxfruit-values-gg.pages.dev/values/buddha)
- [2048 MATCH BALLS](https://portaldejogos-br.github.io/2048-match-balls.html)
- [DONNES SPINNING WORLD](https://unblocked-action-arena.netlify.app/donnes-spinning-world.html)
- [BLOCOPS](https://unblocked-action-arena.netlify.app/blocops.html)
- [HEAD JUMP](https://jingpin-youxiwang.pages.dev/head-jump.html)
- [CITY BUILDER](https://youxi-china24.netlify.app/city-builder.html)
- [CONNECT PUZZLE IMAGE](https://maniadejogos-brasil.pages.dev/connect-puzzle-image.html)
- [MY FARM](https://muryo-geim-nara.web.app/my-farm.html)
- [BALL BUNKER SNEAKY STACKS](https://juegosweb-desbloqueados.vercel.app/ball-bunker-sneaky-stacks.html)
- [SURVIVAL RACING EXTREME ROAD](https://arcadevault-games.github.io/survival-racing-extreme-road.html)
- [POPCORN STACK](https://youxiweb-hub.netlify.app/popcorn-stack.html)
- [KITSUNE](https://bf-winloss-calc.netlify.app/values/kitsune)
- [BUBBLE SHOOTER PRO 4](https://speed-racing-arcade.pages.dev/bubble-shooter-pro-4.html)
- [MOTO ROAD RASH 3D 2](https://trochoimienphi24h.github.io/moto-road-rash-3d-2.html)
- [HAPPY MONSTERS 2](https://congdonggame-vietnam.web.app/happy-monsters-2.html)
- [ASTRO KITTY RUSH](https://luchshie-igry-rus.pages.dev/astro-kitty-rush.html)
- [SUPER CLONER 3D](https://turbodrift-zone.web.app/super-cloner-3d.html)
- [CRAZY TUNNEL](https://vuagamemienphi24h.pages.dev/crazy-tunnel.html)
- [GOD OF LIGHT](https://juegosmundial-hoy.pages.dev/god-of-light.html)
- [2048 SNAKEIO](https://hindigame-arena.vercel.app/2048-snakeio.html)
- [TOYTOPIA](https://speed-racing-hub.netlify.app/toytopia.html)
- [SLIDE THEM AWAY](https://portaldejogos-br.github.io/slide-them-away.html)
- [HIDE MOODENG HIPPO](https://veb-igry-moskva.web.app/hide-moodeng-hippo.html)
- [SUPERMARKET SORT GROCERY GAME](https://unblocked-galaxy.github.io/supermarket-sort-grocery-game.html)
- [ROPE COLOR SORT 3D](https://zona-igr-besplatno.web.app/rope-color-sort-3d.html)
- [VEX X3M 3](https://tokyo-arcade-web.pages.dev/vex-x3m-3.html)
