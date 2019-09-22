const { createReadStream } = require('fs')
const MultiStream = require('multistream')

const StreamBSON = require('..')

let i = 0

new MultiStream([createReadStream(`${__dirname}/data`), createReadStream(`${__dirname}/data`)])
  .pipe(new StreamBSON({ archive: true }))
  .on('data', () => {
    ++i
  })
  .on('finish', () => {
    if (i === 492) {
      process.exit(0)
    } else {
      console.error(i)
      process.exit(1)
    }
  })
  .on('error', err => {
    console.error(err)
    process.exit(1)
  })
