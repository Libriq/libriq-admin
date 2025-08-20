import { useEffect, useMemo, useState } from "react";
import { onValue, type Database, type Query } from "firebase/database";

export function useRTDBValue<T>(db: Database, makeQuery: () => Query) {
  const [data, setData] = useState<T | null>(null);
  const q = useMemo(makeQuery, [db, makeQuery]);
  useEffect(() => {
    const unsub = onValue(q, (snap) => setData((snap.val() as T) ?? null));
    return unsub;
  }, [q]);
  return data;
}
