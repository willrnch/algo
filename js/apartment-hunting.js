function apartmentHunting(blocks, reqs) {
  const dist = {};

  for (const req of reqs) {
    dist[req] = [];
  }

  for (let i = 0; i < blocks.length; ++i) {
    const block = blocks[i];
    for (const req of reqs) {
      if (block[req]) {
        dist[req].push(i);
      }
    }
  }

  const scores = [];
  let fav = null;
  let favScore = null;

  for (let i = 0; i < blocks.length; ++i) {
    let score = 0;

    for (const req of reqs) {
      let min = Math.abs(i - dist[req][0]);
      for (let j = 1; j < dist[req].length; ++j) {
        const it = Math.abs(i - dist[req][j]);
        if (it < min) {
          min = it;
        } else {
          break;
        }
      }
      score = Math.max(score, min);
    }
    if (fav === null || score < favScore) {
      fav = i;
      favScore = score
    }
  }

  return fav;
}

exports.apartmentHunting = apartmentHunting;

