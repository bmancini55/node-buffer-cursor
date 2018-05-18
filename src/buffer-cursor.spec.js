const BufferCursor = require('./buffer-cursor');

const readTests = [
  {
    method: 'readUInt8',
    instance: new BufferCursor(Buffer.from([1, 2, 3])),
  },
  {
    method: 'readUInt16LE',
    instance: new BufferCursor(Buffer.from([1, 0, 2, 0, 3, 0])),
  },
  {
    method: 'readUInt16BE',
    instance: new BufferCursor(Buffer.from([0, 1, 0, 2, 0, 3])),
  },
  {
    method: 'readUInt32LE',
    instance: new BufferCursor(Buffer.from([1, 0, 0, 0, 2, 0, 0, 0, 3, 0, 0, 0])),
  },
  {
    method: 'readUInt32BE',
    instance: new BufferCursor(Buffer.from([0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 3])),
  },
];

for (let readTest of readTests) {
  describe(readTest.method, () => {
    test('should read at start', () => {
      expect(readTest.instance[readTest.method]()).toBe(1);
    });
    test('should read in middle', () => {
      expect(readTest.instance[readTest.method]()).toBe(2);
    });
    test('should read at last', () => {
      expect(readTest.instance[readTest.method]()).toBe(3);
    });
    test('should throw when out of bounds', () => {
      expect(() => readTest.instance[readTest.method]()).toThrow('Index out of range');
    });
  });
}

describe('readBytes', () => {
  let buffer;
  beforeAll(() => {
    buffer = new BufferCursor(Buffer.from([0, 1, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 3]));
  });
  test('should read at start', () => {
    expect(buffer.readBytes(2)).toEqual(Buffer.from([0, 1]));
  });
  test('should read in middle', () => {
    expect(buffer.readBytes(4)).toEqual(Buffer.from([0, 0, 0, 2]));
  });
  test('should throw when read is out of bounds', () => {
    expect(() => buffer.readBytes(9)).toThrow('Index out of range');
  });
  test('should read to end', () => {
    expect(buffer.readBytes(8)).toEqual(Buffer.from([0, 0, 0, 0, 0, 0, 0, 3]));
  });
  test('should throw when at end', () => {
    expect(() => buffer.readBytes(1)).toThrow('Index out of range');
  });
  test('should read remaining bytes when at start', () => {
    buffer = new BufferCursor(Buffer.from([0, 0, 0, 1]));
    expect(buffer.readBytes()).toEqual(Buffer.from([0, 0, 0, 1]));
  });
  test('should read remaining bytes when in middle', () => {
    buffer = new BufferCursor(Buffer.from([0, 0, 0, 1]));
    buffer.readBytes(1);
    expect(buffer.readBytes()).toEqual(Buffer.from([0, 0, 1]));
  });
  test('should throw error when at end of buffer', () => {
    buffer = new BufferCursor(Buffer.from([1]));
    buffer.readBytes(1);
    expect(() => buffer.readBytes()).toThrow('Index out of range');
  });
  test('should return empty buffer is read length is 0', () => {
    buffer = new BufferCursor(Buffer.alloc(0));
    expect(buffer.readBytes(0)).toEqual(Buffer.alloc(0));
  });
});

const writeTests = [
  {
    method: 'writeUInt8',
    instance: new BufferCursor(Buffer.alloc(3)),
    assertions: [Buffer.from([1, 0, 0]), Buffer.from([1, 2, 0]), Buffer.from([1, 2, 3])],
  },
  {
    method: 'writeUInt16LE',
    instance: new BufferCursor(Buffer.alloc(6)),
    assertions: [
      Buffer.from([1, 0, 0, 0, 0, 0]),
      Buffer.from([1, 0, 2, 0, 0, 0]),
      Buffer.from([1, 0, 2, 0, 3, 0]),
    ],
  },
  {
    method: 'writeUInt16BE',
    instance: new BufferCursor(Buffer.alloc(6)),
    assertions: [
      Buffer.from([0, 1, 0, 0, 0, 0]),
      Buffer.from([0, 1, 0, 2, 0, 0]),
      Buffer.from([0, 1, 0, 2, 0, 3]),
    ],
  },
  {
    method: 'writeUInt32LE',
    instance: new BufferCursor(Buffer.alloc(12)),
    assertions: [
      Buffer.from([1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
      Buffer.from([1, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0]),
      Buffer.from([1, 0, 0, 0, 2, 0, 0, 0, 3, 0, 0, 0]),
    ],
  },
  {
    method: 'writeUInt32BE',
    instance: new BufferCursor(Buffer.alloc(12)),
    assertions: [
      Buffer.from([0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0]),
      Buffer.from([0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 0]),
      Buffer.from([0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 3]),
    ],
  },
];

for (let writeTest of writeTests) {
  describe(writeTest.method, () => {
    test('should write at start', () => {
      writeTest.instance[writeTest.method](1);
      expect(writeTest.instance.buffer).toEqual(writeTest.assertions[0]);
    });
    test('should write in middle', () => {
      writeTest.instance[writeTest.method](2);
      expect(writeTest.instance.buffer).toEqual(writeTest.assertions[1]);
    });
    test('should write at end', () => {
      writeTest.instance[writeTest.method](3);
      expect(writeTest.instance.buffer).toEqual(writeTest.assertions[2]);
    });
    test('should throw when out of bounds', () => {
      expect(() => writeTest.instance[writeTest.method]()).toThrow('Index out of range');
    });
  });
}

describe('writeBytes', () => {
  let buffer;
  beforeAll(() => {
    buffer = new BufferCursor(Buffer.alloc(8));
  });
  test('should write at start', () => {
    buffer.writeBytes(Buffer.from([1]));
    expect(buffer.buffer).toEqual(Buffer.from([1, 0, 0, 0, 0, 0, 0, 0]));
  });
  test('should write in middle', () => {
    buffer.writeBytes(Buffer.from([2, 2]));
    expect(buffer.buffer).toEqual(Buffer.from([1, 2, 2, 0, 0, 0, 0, 0]));
  });
  test('should throw if write buffer exceeds cursor', () => {
    expect(() => buffer.writeBytes(Buffer.from([6, 6, 6, 6, 6, 6]))).toThrow('Index out of range');
  });
  test('should write to end', () => {
    buffer.writeBytes(Buffer.from([5, 5, 5, 5, 5]));
    expect(buffer.buffer).toEqual(Buffer.from([1, 2, 2, 5, 5, 5, 5, 5]));
  });
  test('should not care about writing zero byte buffer', () => {
    buffer.writeBytes(Buffer.alloc(0));
    expect(buffer.buffer).toEqual(Buffer.from([1, 2, 2, 5, 5, 5, 5, 5]));
  });
});

describe('position', () => {
  let readbuf;
  let writebuf;
  beforeAll(() => {
    readbuf = new BufferCursor(Buffer.from([1, 2, 0, 0, 3, 4, 0, 0, 0, 0, 0, 0, 5, 6, 0, 0, 0, 7]));
    writebuf = new BufferCursor(Buffer.alloc(18));
  });
  test('should start at 0', () => {
    expect(readbuf.position).toBe(0);
  });
  test('should advance by 1 with readUInt8', () => {
    readbuf.readUInt8();
    expect(readbuf.position).toBe(1);
  });
  test('should advance by 2 with readUInt16LE', () => {
    readbuf.readUInt16LE();
    expect(readbuf.position).toBe(3);
  });
  test('should advance by 2 with readUInt16BE', () => {
    readbuf.readUInt16BE();
    expect(readbuf.position).toBe(5);
  });
  test('should advance by 4 with readUInt32LE', () => {
    readbuf.readUInt32LE();
    expect(readbuf.position).toBe(9);
  });
  test('should advance by 4 with readUInt32BE', () => {
    readbuf.readUInt32BE();
    expect(readbuf.position).toBe(13);
  });
  test('should advance by read amount with readBytes', () => {
    readbuf.readBytes(1);
    expect(readbuf.position).toBe(14);
  });
  test('should advance by rest with readBytes without len', () => {
    readbuf.readBytes();
    expect(readbuf.position).toBe(18);
  });
  test('should advance by 1 with writeUInt8', () => {
    writebuf.writeUInt8(1);
    expect(writebuf.position).toBe(1);
  });
  test('should advance by 2 with writeUInt16LE', () => {
    writebuf.writeUInt16LE(1);
    expect(writebuf.position).toBe(3);
  });
  test('should advance by 2 with writeUInt16BE', () => {
    writebuf.writeUInt16BE(1);
    expect(writebuf.position).toBe(5);
  });
  test('should advance by 4 with writeUInt32LE', () => {
    writebuf.writeUInt32LE(1);
    expect(writebuf.position).toBe(9);
  });
  test('should advance by 4 with writeUInt32BE', () => {
    writebuf.writeUInt32BE(1);
    expect(writebuf.position).toBe(13);
  });
  test('should advance by buffer length with writeBytes', () => {
    writebuf.writeBytes(Buffer.alloc(5));
    expect(writebuf.position).toBe(18);
  });
});

describe('eof', () => {
  let buffer;
  beforeAll(() => {
    buffer = new BufferCursor(Buffer.from([1, 2]));
  });
  test('should be false at start', () => {
    expect(buffer.eof).toBeFalsy();
  });
  test('should be false in middle', () => {
    buffer.readBytes(1);
    expect(buffer.eof).toBeFalsy();
  });
  test('should be true when all bytes read', () => {
    buffer.readBytes(1);
    expect(buffer.eof).toBeTruthy();
  });
});
