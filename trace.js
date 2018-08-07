const { createReadStream, writeFileSync } = require('fs')
const StreamBSON = require('./index.js')

const Trace = q => {
  const ks = Array.isArray(q) ? q : q.split('/')
  const r = {}
  return {
    get value() {
      return r
    },
    push(x) {
      const k = ks.map(k => x[k]).join('/')
      r[k] = r[k] || 0
      ++r[k]
    }
  }
}

let trace = null
let i = 0

createReadStream(process.argv[2])
  .pipe(new StreamBSON({ archive: true }))
  .on('data', doc => {
    ++i
    trace = trace || Trace(process.env.q || Object.keys(doc).filter(k => !k.startsWith('_')))
    trace.push(doc)
  })
  .on('finish', () => {
    console.log(`${i} records processed`)
    console.log(`writing trace in ${process.argv[2]}.json`)
    const r = {}
    Object.keys(trace.value).sort().forEach(k => {
      if (trace.value[k] >= (process.env.n ? parseInt(process.env.n) : 1)) {
        r[k] = trace.value[k]
      }
    })
    writeFileSync(`${process.argv[2]}.json`, JSON.stringify(r, null, 2))
  })
  .on('error', err => {
    console.log(err)
  })
