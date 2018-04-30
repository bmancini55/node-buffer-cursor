const sut = require('./index');
const BufferCursor = require('./buffer-cursor');

test('factory method', () => {
  expect(sut.from(Buffer.alloc(0))).toBeInstanceOf(BufferCursor);
});
