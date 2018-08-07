const { createReadStream } = require('fs')
const StreamBSON = require('./index.js')

let i = 0

createReadStream(process.argv[2])
  .pipe(new StreamBSON({ archive: true }))
  .on('data', doc => {
    if (doc && doc._id) {
      ++i
    } else {
      console.log(e)
    }
  })
  .on('finish', () => {
    console.log(i)
  })
  .on('error', err => {
    console.log(err)
  })
