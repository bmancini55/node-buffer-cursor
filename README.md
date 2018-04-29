# buffer-cursor

[![CircleCI](https://circleci.com/gh/bmancini55/node-buffer-cursor/tree/master.svg?style=shield)](https://circleci.com/gh/bmancini55/node-buffer-cursor/tree/master)
[![Coverage Status](https://coveralls.io/repos/github/bmancini55/node-buffer-cursor/badge.svg?branch=master)](https://coveralls.io/github/bmancini55/node-buffer-cursor?branch=master)

Simplify reading and writing to buffers by internally maintaining the position. This library exposes a wrapper for a buffer that uses similar read and write methods to those found in the Node buffer API.

Usage:
```bash
npm install buffer-cursor
```

```javascript
const BufferCursor = require('buffer-cursor');

let buffer = BufferCursor(Buffer.alloc(8));
buffer.writeUInt8(1);
buffer.writeUInt16BE(2);
buffer.writeUInt32BE(3);
buffer.writeBytes(Buffer.from([4]));
buffer.position = 0;
console.log(buffer.readUInt8());
console.log(buffer.readUInt16BE());
console.log(buffer.readUInt32BE());
console.log(buffer.readBytes());
```

## API
* `position: number` - the current buffer cursor position
* `eof: bool` - whether the current position is at the end of the buffer
* `buffer: Buffer` - the underlying buffer

* `readUInt8(): number` - reads 1 byte
* `readUInt16LE(): number` - reads 2 bytes as 16-bit little-endian unsigned integer
* `readUInt16BE(): number` - reads 2 bytes as 16-bit big-endian unsigned integer
* `readUInt32LE(): number` - reads 4 bytes as 32-bit little-endian unsigned integer
* `readUInt32BE(): number` - reads 4 bytes as 32-bit big-endian unsigned integer
* `readBytes([len]): Buffer` - reads the optionally specified number of bytes. If no length is supplied, it reads to the end of the buffer.

* `writeUInt8(number): undefined` - writes 1 byte
* `writeUInt16LE(number): undefined` - writes a number as a 16-bit little-endian unsigned integer
* `writeUInt16BE(number): undefined` - writes a number as a 16-bit big-endian unsigned integer
* `writeUInt32LE(number): undefined` - writes a number as a 32-bit little-endian unsigned integer
* `writeUInt32BE(number): undefined` - writes a number as a 32-bit big-endian unsigned integer
* `writeBytes(buffer): undefined` - writes the supplied buffer to the cursor buffer
