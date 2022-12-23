const X = 0;
const Y = 1;

const AStar = function (start, end, graph) {
  this.graph = graph;
  this.start = start;
  this.end = end;
  this.candidates = [];
};

AStar.prototype.up = (pos) => [pos[X], pos[Y] - 1];
AStar.prototype.down = (pos) => [pos[X], pos[Y] + 1];
AStar.prototype.left = (pos) => [pos[X] - 1, pos[Y]];
AStar.prototype.right = (pos) => [pos[X] + 1, pos[Y]];

AStar.prototype.isValid = function (pos) {
  if (pos[X] < 0 || pos[X] >= this.width) {
    return false;
  }
  if (pos[Y] < 0 || pos[Y] >= this.height) {
    return false;
  }
  if (this.graph[pos[Y]][pos[X]] === 1) {
    return false;
  }
  return true;
};

AStar.prototype.getH = function (pos) {
  const dest = this.end;
  return (Math.abs(dest[Y] - pos[Y]) + Math.abs(dest[X] - pos[X]));
};

AStar.prototype.getNextCandidate = function () {
  let minG = null;
  let min = null;
  const len = this.candidates.length;

  for (let i = 0; i < len; ++i) {
    const candidate = this.candidates[i];
    const info = this.memory[candidate[Y]][candidate[X]];
    if (min === null || minG > info.g) {
      min = i;
      minG = info.g;
    }
  }
  if (min !== null) {
    const candidate = this.candidates[min];
    this.candidates.splice(min, 1);
    return candidate;
  }
  return null;
};

AStar.prototype.getMemory = function (pos) {
  return this.memory[pos[Y]][pos[X]];
};

AStar.prototype.setMemory = function (pos, memory) {
  this.memory[pos[Y]][pos[X]] = memory;
};

AStar.prototype.getPathIt = function (pos) {
  let h = this.getH(pos);
  this.setMemory(pos, {
    g: 0,
    h,
    f: h,
  });

  this.candidates.push(pos);

  let candidate
  while (candidate = this.getNextCandidate()) {
    if (candidate[X] === this.end[X] && candidate[Y] === this.end[Y]) {
      break;
    }

    const candidateInfo = this.getMemory(candidate);
    if (candidateInfo.visited) {
      continue;
    }

    const newG = candidateInfo.g + 1;

    const neigbour = this.getNeigbour(candidate);
    for (const cell of neigbour) {
      const cellInfo = this.getMemory(cell);

      if (!cellInfo) {
        this.setMemory(cell, {
          g: newG,
          h: this.getH(cell),
          f: newG + h,
          from: candidate,
        });
        this.candidates.push(cell);
      } else {
        if (cellInfo.g > newG) {
          this.setMemory(cell, {
            ...cellInfo,
            g: newG,
            f: newG + cellInfo.h,
            from: candidate,
          });
        }
      }
    }
    candidateInfo.visited = true;
  }

  if (candidate) {
    if (candidate[X] === this.end[X] && candidate[Y] === this.end[Y]) {
      let it = candidate;
      const path = [];
      while (it) {
        path.push([it[1], it[0]]);
        const candidateInfo = this.getMemory(it);
        it = candidateInfo.from;
      }

      return path.reverse();
    }
  }
  return [];
};

AStar.prototype.getPath = function () {
  const height = this.graph.length;
  if (!height) {
    return [];
  }
  this.height = height;

  const width = this.graph[0].length;
  if (!width) {
    return [];
  }
  this.width = width;

  const memory = new Array(height);
  for (let i = 0; i < height; ++i) {
    memory[i] = new Array(width);
  }
  this.memory = memory;

  const start = this.start;
  const pos = [start[X], start[Y]];
  return this.getPathIt(pos);
};


AStar.prototype.getNeigbour = function (pos) {
  const neigbour = [];

  const up = this.up(pos);
  if (this.isValid(up)) {
    neigbour.push(up);
  }

  const down = this.down(pos);
  if (this.isValid(down)) {
    neigbour.push(down);
  }

  const left = this.left(pos);
  if (this.isValid(left)) {
    neigbour.push(left);
  }

  const right = this.right(pos);
  if (this.isValid(right)) {
    neigbour.push(right);
  }
  return neigbour;
};


function aStarAlgorithm(startRow, startCol, endRow, endCol, graph) {
  const end = [endCol, endRow];
  const start = [startCol, startRow];

  const aStar = new AStar(start, end, graph);
  return aStar.getPath();
}

exports.aStarAlgorithm = aStarAlgorithm;

