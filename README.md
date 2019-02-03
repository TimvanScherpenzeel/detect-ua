# Detect user-agent

![](http://img.badgesize.io/TimvanScherpenzeel/detect-ua/master/build/detect-ua.min.js.svg?compression=gzip&maxAge=60)
[![npm version](https://badge.fury.io/js/detect-ua.svg)](https://badge.fury.io/js/detect-ua)
[![dependencies](https://david-dm.org/timvanscherpenzeel/detect-ua.svg)](https://david-dm.org/timvanscherpenzeel/detect-ua)
[![devDependencies](https://david-dm.org/timvanscherpenzeel/detect-ua/dev-status.svg)](https://david-dm.org/timvanscherpenzeel/detect-ua#info=devDependencies)

A small user-agent detection library (< 1kB).

Is able to differentiate between mobile, tablet and desktop devices and finds your browser name and version.

## Installation

Make sure you have [Node.js](http://nodejs.org/) installed.

```sh
 $ npm install detect-ua
```

## Usage

```js
import { DetectUA } from 'detect-ua';

const agent = new DetectUA();

console.log(agent.browser); // -> { name: Safari, version: 11.0 }
console.log(agent.isMobile); // -> true
console.log(agent.isTablet); // -> false
console.log(agent.isDesktop); // -> false
```

## Development

```sh
$ yarn start

$ yarn lint

$ yarn test

$ yarn build
```

## Licence

My work is released under the [MIT license](https://raw.githubusercontent.com/TimvanScherpenzeel/detect-ua/master/LICENSE).
