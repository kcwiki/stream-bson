# `stream-bson`

[![Version](https://img.shields.io/npm/v/stream-bson.svg)](https://www.npmjs.com/package/stream-bson)
[![Build](https://img.shields.io/travis/kcwiki/stream-bson.svg)](https://travis-ci.org/kcwiki/stream-bson)
[![Dependencies](https://img.shields.io/david/kcwiki/stream-bson.svg)](https://david-dm.org/kcwiki/stream-bson)
[![Dev Dependencies](https://img.shields.io/david/dev/kcwiki/stream-bson.svg)](https://david-dm.org/kcwiki/stream-bson?type=dev)

[Streaming](https://nodejs.org/api/stream.html) [BSON](http://bsonspec.org/) parser with [rudimentary](#todo) MongoDB [archive](https://www.mongodb.com/blog/post/archiving-and-compression-in-mongodb-tools) support.

- [`bson`](https://www.npmjs.com/package/bson) is used for parsing, it is faster than [`bson-ext`](https://www.npmjs.com/package/bson-ext) according to some tests.

## Install

```sh
$ npm i stream-bson
# or
$ yarn add stream-bson
```

## Usage

```js
const { createReadStream } = require('fs')
const StreamBSON = require('stream-bson')

createReadStream('...')
  .pipe(new StreamBSON({ archive: true }))
  .on('data', doc => {})
  .on('finish', () => {})
  .on('error', err => {})
```

## Todo

- Proper exception handling / [multistream](https://www.npmjs.com/package/multistream) support.
- MongoDB [archives](https://github.com/mongodb/mongo-tools/blob/master/common/archive/archive.go) are not parsed properly. Assuming there is a BSON file in the archive, setting `archive` in `StreamBSON` options will skip the archive header (until `\x07_id`) and ignore the footer (via parsing error).
