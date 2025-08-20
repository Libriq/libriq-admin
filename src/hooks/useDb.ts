import { useMemo } from "react";
import { getDatabase } from "firebase/database";
import { getFb } from "../lib/firebase.client";

export function useDB() {
  const { app } = getFb();
  return useMemo(() => getDatabase(app), [app]);
}
