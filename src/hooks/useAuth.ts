import { useEffect, useState } from "react";
import { getFb } from "../lib/firebase.client";
import { onAuthStateChanged, type User } from "firebase/auth";

export function useAuth() {
  const { auth } = getFb();
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => onAuthStateChanged(auth, setUser), [auth]);

  return { user, loading: user === undefined };
}
