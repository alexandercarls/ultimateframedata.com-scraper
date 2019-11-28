function batch(values, batchSize) {
  if (!Array.isArray(values)) {
    throw new TypeError('values must be an array.');
  }
  if (batchSize < 0) {
    throw new RangeError('batch size must be greater than -1.');
  }

  const batches = [];

  let i = 0;

  // Iterate all "full" batchgroups
  const lastBlockIndex = values.length - (values.length % batchSize);
  for (; i < lastBlockIndex; i += batchSize) {
    // For each batchgroup iteration, add the batch containing the values
    // up the next batch.
    const batch = [];
    for (let bi = 0; bi < batchSize; bi++) {
      batch.push(values[i + bi]);
    }
    // console.log(batch);
    batches.push(batch);
  }

  // Add last batchgroup
  const lastBatchGroup = [];
  for (; i < values.length; i++) {
    lastBatchGroup.push(values[i]);
  }
  if (lastBatchGroup.length) {
    batches.push(lastBatchGroup);
  }

  return batches;
}

module.exports = {
  batch,
};
