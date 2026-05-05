import type { Config, FoodTruckConfigItem } from '@/lib/config';

export interface ResolvedFoodTruck extends FoodTruckConfigItem {
  id: string;
}

export interface ParsedMenuRow {
  item: string;
  price: string;
  numericPrice: number;
}

function slugify(name: string): string {
  const s = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return s || 'food-truck';
}

/** True if value is a plain object map (Firestore / RTDB style), not an array. */
function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function getFoodTrucksNode(config: Config): unknown {
  const c = config as Record<string, unknown>;
  const hyphen = c['food-trucks'];
  const snake = c['food_trucks'];
  return hyphen ?? snake;
}

/** Parse item → price pairs into sorted rows (highest price first). */
function entriesToMenuRows(
  raw: Record<string, string | number> | undefined
): ParsedMenuRow[] {
  if (!raw || typeof raw !== 'object') return [];
  return Object.entries(raw)
    .map(([item, rawPrice]) => {
      const n =
        typeof rawPrice === 'number' ? rawPrice : parseFloat(String(rawPrice));
      const numericPrice = Number.isFinite(n) ? n : 0;
      return {
        item,
        price: numericPrice.toFixed(2),
        numericPrice,
      };
    })
    .sort((a, b) => b.numericPrice - a.numericPrice);
}

/**
 * `food-trucks` in config-2026 may be either:
 * - A **map**: `{ "5411-empanadas": { name, image, "food-truck-menu": {...} }, ... }`
 * - An **array**: `[ { id?, name, image }, ... ]` (menus from top-level `food_truck_menus`).
 */
export function getFoodTrucksFromConfig(
  config: Config | null
): ResolvedFoodTruck[] {
  if (!config) return [];
  const node = getFoodTrucksNode(config);

  if (Array.isArray(node)) {
    const list = node as FoodTruckConfigItem[];
    if (!list.length) return [];
    const usedBaseIds = new Map<string, number>();
    return list.map((row, index) => {
      const rawId =
        typeof row.id === 'string' && row.id.trim() ? row.id.trim() : null;
      const base = rawId ?? (slugify(row.name || '') || `food-truck-${index}`);
      const n = usedBaseIds.get(base) ?? 0;
      usedBaseIds.set(base, n + 1);
      const id = n === 0 ? base : `${base}-${n}`;
      return {
        id,
        name: row.name ?? '',
        image: row.image ?? '',
      };
    });
  }

  if (isRecord(node)) {
    const out: ResolvedFoodTruck[] = [];
    for (const [truckKey, payload] of Object.entries(node)) {
      if (!isRecord(payload)) continue;
      const name = typeof payload.name === 'string' ? payload.name : '';
      const image = typeof payload.image === 'string' ? payload.image : '';
      const id =
        typeof payload.id === 'string' && payload.id.trim()
          ? payload.id.trim()
          : truckKey;

      out.push({ id, name, image });
    }
    return out;
  }

  return [];
}

/** Top-level `truckId → { menuItem → price }` (underscore / legacy keys). */
export function getFoodTruckMenusRoot(
  config: Config | null
): Record<string, Record<string, string | number>> | undefined {
  if (!config) return undefined;
  const c = config as Record<string, unknown>;
  const hyphen = c['food-truck-menu'];
  const snake = c['food_truck_menu'];
  const legacy = c['food_truck_menus'];

  const root =
    hyphen && isRecord(hyphen)
      ? hyphen
      : snake && isRecord(snake)
        ? snake
        : legacy && isRecord(legacy)
          ? legacy
          : undefined;
  return root as Record<string, Record<string, string | number>> | undefined;
}

function nestedMenuPayload(
  config: Config | null,
  truckId: string
): Record<string, string | number> | undefined {
  if (!config) return undefined;
  const node = getFoodTrucksNode(config);
  if (!isRecord(node)) return undefined;

  let payload =
    (node[truckId] && isRecord(node[truckId])
      ? (node[truckId] as Record<string, unknown>)
      : undefined) ?? undefined;

  if (!payload) {
    for (const [, v] of Object.entries(node)) {
      if (!isRecord(v)) continue;
      const idInner = typeof v.id === 'string' ? v.id.trim() : '';
      if (idInner === truckId) {
        payload = v;
        break;
      }
    }
  }

  if (!payload) return undefined;

  const menu =
    payload['food-truck-menu'] ?? payload['food_truck_menu'] ?? undefined;

  if (menu && typeof menu === 'object' && !Array.isArray(menu))
    return menu as Record<string, string | number>;
  return undefined;
}

export function parseMenuForTruck(
  config: Config | null,
  truckId: string
): ParsedMenuRow[] {
  const nested = nestedMenuPayload(config, truckId);
  if (nested && Object.keys(nested).length > 0) {
    return entriesToMenuRows(nested);
  }

  const menus = getFoodTruckMenusRoot(config);
  if (!menus) return [];
  const raw = menus[truckId];
  if (!raw || typeof raw !== 'object') return [];
  return entriesToMenuRows(raw as Record<string, string | number>);
}

export function resolveFoodTruckById(
  config: Config | null,
  id: string
): ResolvedFoodTruck | undefined {
  return getFoodTrucksFromConfig(config).find((t) => t.id === id);
}
