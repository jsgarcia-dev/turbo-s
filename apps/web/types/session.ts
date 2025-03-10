export interface User {
  id: string;
  name: string | null;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  role: string | null;
}

export interface SessionData {
  id: string;
  expiresAt: Date;
  token: string;
  createdAt: Date;
  updatedAt: Date;
  ipAddress: string;
  userAgent: string;
  userId: string;
}

export interface SessionResponse {
  user: User;
  session: SessionData;
}
