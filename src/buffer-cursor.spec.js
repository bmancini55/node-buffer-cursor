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
});

describe('position', () => {
  let buffer;
  beforeAll(() => {
    buffer = new BufferCursor(Buffer.from([1, 2, 0, 0, 3, 4, 0, 0, 0, 0, 0, 0, 5, 6, 0, 0, 0, 7]));
  });
  test('should start at 0', () => {
    expect(buffer.position).toBe(0);
  });
  test('should advance by 1 with readUInt8', () => {
    buffer.readUInt8();
    expect(buffer.position).toBe(1);
  });
  test('should advance by 2 with readUInt16LE', () => {
    buffer.readUInt16LE();
    expect(buffer.position).toBe(3);
  });
  test('should advance by 2 with readUInt16BE', () => {
    buffer.readUInt16BE();
    expect(buffer.position).toBe(5);
  });
  test('should advance by 4 with readUInt32LE', () => {
    buffer.readUInt32LE();
    expect(buffer.position).toBe(9);
  });
  test('should advance by 4 with readUInt32BE', () => {
    buffer.readUInt32BE();
    expect(buffer.position).toBe(13);
  });
  test('should advance by read amount with readBytes', () => {
    buffer.readBytes(1);
    expect(buffer.position).toBe(14);
  });
  test('should advance by rest with readBytes without len', () => {
    buffer.readBytes();
    expect(buffer.position).toBe(18);
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
