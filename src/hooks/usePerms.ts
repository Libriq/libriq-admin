import { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import type { Perms } from "../auth/permissions";
import { getFb } from "../lib/firebase.client";

export function usePerms(uid?: string) {
  const { app } = getFb();
  const db = getDatabase(app);
  const [perms, setPerms] = useState<Perms | undefined>();

  useEffect(() => {
    if (!uid) return;
    const r = ref(db, `acl/${uid}/perms`);
    const off = onValue(r, (snap) => setPerms((snap.val() as Perms) ?? {}));
    return off;
  }, [db, uid]);

  return perms;
}

