export type AnnPerms = { create?: boolean; edit?: boolean; delete?: boolean };
export type Perms = { announcements?: AnnPerms };

export function canCreate(perms?: Perms) { return perms?.announcements?.create === true; }
export function canEdit(perms?: Perms)   { return perms?.announcements?.edit === true;   }
export function canDelete(perms?: Perms) { return perms?.announcements?.delete === true; }

