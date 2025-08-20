import {
  get, query, set, update, remove, push, ref, runTransaction, orderByChild, limitToFirst, limitToLast,
  type Database, type DataSnapshot, type Query,
  startAt,
  endAt
} from 'firebase/database';

export const path = (...parts: string[]) => parts.join("/");

export async function getOnce<T>(db: Database, p: string): Promise<T | null> {
  const snap = await get(ref(db, p));
  return (snap.exists() ? (snap.val() as T) : null);
}

export async function setAt<T>(db: Database, p: string, value: T) {
  await set(ref(db, p), value);
}

export async function updateAt(db: Database, p: string, patch: Record<string, any>) {
  await update(ref(db, p), patch);
}

export async function removeAt(db: Database, p: string) {
  await remove(ref(db, p));
}

export async function pushTo<T>(db: Database, p: string, value: T) {
  const r = ref(db, p);
  const newRef = await push(r, value);
  return newRef.key!;
}

export async function increment(db: Database, p: string, by = 1) {
  await runTransaction(ref(db, p), (n: number | null) => (n ?? 0) + by);
}

export type OrderValue = string | number | boolean | null;
const isOrderValue = (v: unknown): v is OrderValue =>
  v === null || typeof v === "string" || typeof v === "number" || typeof v === "boolean";

export function byChild(
  db: Database,
  basePath: string,
  childKey: string,
  opts?: {
    dir?: "asc" | "desc";
    limit?: number;
    startAtVal?: OrderValue;
    endAtVal?: OrderValue;
  }
): Query {
  let built = query(ref(db, basePath), orderByChild(childKey));

  if (isOrderValue(opts?.startAtVal)) built = query(built, startAt(opts!.startAtVal));
  if (isOrderValue(opts?.endAtVal))   built = query(built, endAt(opts!.endAtVal));

  if (opts?.limit && opts.dir === "desc") built = query(built, limitToLast(opts.limit));
  else if (opts?.limit)                   built = query(built, limitToFirst(opts.limit));

  return built;
}

export function snapToList<T>(
  snap: DataSnapshot,
  map?: (val: any, key: string) => T
): T[] {
  if (!snap.exists()) return [];
  const out: T[] = [];
  snap.forEach((child) => {
    const key = child.key as string;
    const val = child.val();
    out.push(map ? map(val, key) : ({ id: key, ...val } as T));
  });
  return out;
}

export async function getList<T>(query: Query, map?: (val: any, key: string) => T): Promise<T[]> {
  const snap = await get(query);
  return snapToList<T>(snap, map);
}

export function toMillis(v: unknown): number {
  if (typeof v === "number") return v;
  return 0;
}
