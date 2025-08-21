import { serverTimestamp, type Database } from 'firebase/database';
import { path, getOnce, removeAt, pushTo, toMillis, byChild, getList } from './rtdb';

export type Announcement = {
  id: string;
  title: string;
  shortDesc: string;
  longDesc: string;
  emergency: boolean;
  createdAt: object | number;
  createdBy: string;
}

const base = () => path("announcements");

function mapAnnouncement(val: any, key: string): Announcement {
  return {
    id: key,
    title: val.title ?? "",
    shortDesc: val.shortDesc ?? "",
    longDesc: val.longDesc ?? "",
    emergency: val.emergency ?? false,
    createdAt: toMillis(val.createdAt),
    createdBy: val.createdBy ?? "",
  };
}

export async function createAnnouncement(
  db: Database, input: Omit<Announcement, "id" | "createdAt">
) {
  const id = await pushTo(db, base(), {
    ...input,
    createdAt: serverTimestamp(),
  });
  return id;
}

export async function deleteAnnouncement(db: Database, id: string) {
  await removeAt(db, path(base(), id));
}

export async function getAnnouncement(db: Database, id: string) {
  return getOnce<Announcement>(db, path(base(), id));
}

export async function getAllAnnouncements(db: Database): Promise<Announcement[]> {
  const q = byChild(db, base(), "createdAt", { dir: "asc" });
  return getList<Announcement>(q, mapAnnouncement);
}

export async function getRecentAnnouncement(db: Database, limit = 50): Promise<Announcement[]> {
  const q = byChild(db, base(), "createdAt", { dir: "desc", limit });
  const list = await getList<Announcement>(q, mapAnnouncement);
  return list.reverse();
}
