function subarraySort(array) {
  const len = array.length;
  let l = 0;
  let h = len - 1;

  while (l < h && array[l + 1] >= array[l]) {
    ++l;
  }

  if (l === h) {
    return [-1, -1];
  }

  while (h > 0 && array[h - 1] <= array[h]) {
    --h;
  }

  let min = array[l];
  let max = array[h];

  for (let i = l; i <= h; ++i) {
    if (array[i] < min) {
      min = array[i];
    }
    if (array[i] > max) {
      max = array[i];
    }
  }

  while (l > 0 && array[l - 1] > min) {
    --l;
  }

  while (h < len && array[h] < max) {
    ++h;
  }

  return [l, h - 1];
}

exports.subarraySort = subarraySort;

