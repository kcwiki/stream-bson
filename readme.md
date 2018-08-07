[BSON](http://bsonspec.org/) [stream](https://nodejs.org/api/stream.html) with rudimentary [archive](https://www.mongodb.com/blog/post/archiving-and-compression-in-mongodb-tools) support.

# Install

```sh
$ npm i stream-bson
# or
$ yarn add stream-bson
```

# Usage

```js
const { createReadStream } = require('fs')
const StreamBSON = require('stream-bson')

createReadStream(process.argv[2])
  .pipe(new StreamBSON({ archive: true }))
  .on('data', doc => {
    // doc is a JS object
  })
  .on('finish', () => {
    // ...
  })
  .on('error', err => {
    // ...
  })
```

# Issues

[Archives](https://github.com/mongodb/mongo-tools/blob/master/common/archive/archive.go) are not parsed properly. Assuming there is only one BSON in the archive, setting `archive` in `StreamBSON` options will skip the archive header (until `\x07_id`) and ignore the footer (via parsing error).
