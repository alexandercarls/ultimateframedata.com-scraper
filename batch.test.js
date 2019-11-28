const { batch } = require('./batch');

test('should have one full batch and a remainder', () => {
  const result = batch([1, 2, 3], 3);
  expect(result).toEqual([[1, 2, 3]]);
});

test('should have two full batches and a remainder', () => {
  const result = batch([1, 2, 3, 4, 5, 6, 7], 3);
  expect(result).toEqual([[1, 2, 3], [4, 5, 6], [7]]);
});

test('should have no full batch only the remainder', () => {
  const result = batch([1, 2], 3);
  expect(result).toEqual([[1, 2]]);
});

test('should return the whole array if batchsize is 0', () => {
  const result = batch([1, 2], 0);
  expect(result).toEqual([[1, 2]]);
});

test('should return an empty array when passed an empty values array', () => {
  const result = batch([], 1);
  expect(result).toEqual([]);
});

test('should throw if values is not an array', () => {
  expect(() => batch({ not: 'an array' }, 1)).toThrow(TypeError);
});

test('should throw if batch size is less than 0', () => {
  expect(() => batch([1, 2, 3], -1)).toThrow(RangeError);
});
