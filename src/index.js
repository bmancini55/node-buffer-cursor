const BufferCursor = require('./buffer-cursor');

module.exports = {
  from: buffer => new BufferCursor(buffer),
};
