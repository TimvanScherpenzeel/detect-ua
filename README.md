# Detect user-agent

![](http://img.badgesize.io/TimvanScherpenzeel/detect-ua/master/dist/detect-ua.cjs.js.svg?compression=gzip&maxAge=60)
[![npm version](https://badge.fury.io/js/detect-ua.svg)](https://badge.fury.io/js/detect-ua)

A small user-agent detection library (1 kB).

Is able to differentiate between mobile, tablet and desktop devices and finds your browser name and version.

## Installation

Make sure you have [Node.js](http://nodejs.org/) installed.

```sh
 $ npm install detect-ua
```

## Usage

```js
import { DetectUA } from 'detect-ua';

const device = new DetectUA();

console.log(device.browser); // -> { name: "Chrome", version: "80.0" }
console.log(device.isMobile); // -> false
console.log(device.isTablet); // -> false
console.log(device.isDesktop); // -> true
console.log(device.isMacOS); // { version: "10" }
console.log(device.isWindows); // -> false
console.log(device.isAndroid); // -> false
console.log(device.isiOS); // -> false
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
