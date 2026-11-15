export type CrowdFigure = {
  id: number;
  x: number;
  y: number;
  scale: number;
  row: number;
  phase: number;
  hair: number;
  beard: number;
  glasses: boolean;
  headwear: number;
  expression: number;
  clothing: number;
};

function seededRandom(seed: number) {
  let state = seed >>> 0;

  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function createCrowdFigures(count = 120, rows = 5): CrowdFigure[] {
  const random = seededRandom(8162026);
  const columns = Math.ceil(count / rows);

  return Array.from({ length: count }, (_, id) => {
    const row = Math.floor(id / columns);
    const column = id % columns;
    const spacing = 1000 / columns;
    const figureRandom = seededRandom(8162026 + id * 13);

    return {
      id,
      x: (column + 0.5) * spacing + (random() - 0.5) * spacing * 0.22,
      y: 208 + row * 97 + (random() - 0.5) * 23,
      scale: 0.48 + row * 0.115 + random() * 0.025,
      row,
      phase: figureRandom() * 6,
      hair: Math.floor(figureRandom() * 8),
      beard: Math.floor(figureRandom() * 5),
      glasses: figureRandom() > 0.77,
      headwear: Math.floor(figureRandom() * 6),
      expression: Math.floor(figureRandom() * 8),
      clothing: Math.floor(figureRandom() * 8),
    };
  });
}
