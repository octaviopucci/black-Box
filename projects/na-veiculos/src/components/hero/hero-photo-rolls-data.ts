import { availableVehicles } from "@/data/vehicles";
import { asset } from "@/lib/assets";

function unique<T>(items: T[]) {
  return [...new Set(items)];
}

function pickColumn(poolA: string[], poolB: string[], fallback: string[], count: number) {
  const picked: string[] = [];
  let ai = 0;
  let bi = 0;

  const takeA = () => {
    while (ai < poolA.length) {
      const item = poolA[ai++]!;
      if (!picked.includes(item) && picked.at(-1) !== item) return item;
    }
    return null;
  };

  const takeB = () => {
    while (bi < poolB.length) {
      const item = poolB[bi++]!;
      if (!picked.includes(item) && picked.at(-1) !== item) return item;
    }
    return null;
  };

  const takeFallback = () => {
    for (const item of fallback) {
      if (!picked.includes(item) && picked.at(-1) !== item) return item;
    }
    return null;
  };

  while (picked.length < count) {
    const prev = picked.at(-1);
    const fromA = prev === undefined || poolA.includes(prev) ? takeB() : takeA();
    let next = fromA ?? (poolA.includes(prev ?? "") ? takeA() : takeB());
    next ??= takeFallback();
    if (!next) break;
    picked.push(next);
  }

  return picked;
}

function fixLoop(items: string[]) {
  if (items.length < 2) return items;
  if (items[0] === items.at(-1)) {
    for (let i = 1; i < items.length - 1; i += 1) {
      if (items[i] !== items[0] && items[i] !== items.at(-2)) {
        const last = items.length - 1;
        const swap = items[i]!;
        items[i] = items[last]!;
        items[last] = swap;
        break;
      }
    }
  }
  return items;
}

function duplicateLoop(items: string[]) {
  if (items.length <= 1) return items;
  return [...items, ...items];
}

export function buildHeroPhotoColumns() {
  const all = unique(availableVehicles.map((v) => asset(v.image)));
  const half = Math.ceil(all.length / 2);
  const poolA = all.slice(0, half);
  const poolB = all.slice(half);

  const left = fixLoop(pickColumn(poolA, poolB, all, 7));
  const right = fixLoop(pickColumn([...poolA].reverse(), [...poolB].reverse(), [...all].reverse(), 7));

  return [duplicateLoop(left), duplicateLoop(right)] as const;
}
