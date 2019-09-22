const { Transform } = require('stream')
const BSON = require('bson')

const idPrefix = Buffer.from('\x07_id')

class StreamBSON extends Transform {
  constructor(options) {
    options = options || {}
    super(options)
    this._archive = options.archive
    this._archiveInitialized = options.archive ? false : true
    this._writableState.objectMode = false
    this._readableState.objectMode = true
    this._buffer = Buffer.from([])
  }
  _parse(cb) {
    if (!this._archiveInitialized) {
      const idPrefixIndex = this._buffer.indexOf(idPrefix)
      if (idPrefixIndex === -1) {
        cb()
        return
      } else {
        this._buffer = this._buffer.slice(idPrefixIndex - 4)
        this._archiveInitialized = true
      }
    }
    if (this._buffer.length < 4) {
      cb()
      return
    }
    const docSize = this._buffer.readInt32LE(0)
    if (this._buffer.length < docSize) {
      cb()
      return
    }
    const docBuffer = this._buffer.slice(0, docSize)
    if (docBuffer[docSize - 1] !== 0x00) {
      //
    }
    try {
      this.push(BSON.deserialize(docBuffer))
    } catch (err) {
      cb(this._archive ? undefined : err)
      return
    }
    this._buffer = this._buffer.slice(docSize)
    this._parse(cb)
  }
  _transform(chunk, _, cb) {
    this._buffer = Buffer.concat([this._buffer, chunk], this._buffer.length + chunk.length)
    this._parse(cb)
  }
}

module.exports = StreamBSON
