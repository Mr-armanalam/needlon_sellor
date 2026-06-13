export type AuthSession = {
  id: string;
  userAgent: string | null;
  ipAddress: string | null;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  lastRotatedAt: string | null;
  isCurrent: boolean;
};

export type SessionInfo = {
  id: string;
  userAgent: string | null;
  ipAddress: string | null;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  lastRotatedAt: string | null;
  isCurrent: boolean;
};