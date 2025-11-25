type UserLike = {
  role: string;
};

// Simple role/permission scaffold; to be replaced with DB-backed checks later.
const rolePermissions: Record<string, string[]> = {
  SUPER_ADMIN: ["*"],
  ADMIN: ["auth:me"],
  USER: ["auth:me"],
};

export function hasPermission(user: UserLike, required: string[]) {
  const permissions = rolePermissions[user.role] ?? [];
  if (permissions.includes("*")) return true;
  return required.some((p) => permissions.includes(p));
}

export function requirePermission(permission: string) {
  return (_req: import("express").Request, _res: import("express").Response, next: import("express").NextFunction) => {
    // TODO: check JWT + user permissions when authGuard attaches user
    return next();
  };
}
