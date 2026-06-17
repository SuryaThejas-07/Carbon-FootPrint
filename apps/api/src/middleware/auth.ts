import type { NextFunction, Request, Response } from 'express';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, applicationDefault, getApps } from 'firebase-admin/app';
import { prisma } from '@carbonwise/database';

export type AuthenticatedUser = {
  id: string;
  firebaseUid: string;
  email: string | null;
  displayName: string | null;
};

declare global {
  namespace Express {
    interface Request {
      currentUser?: AuthenticatedUser;
    }
  }
}

function ensureFirebaseApp() {
  if (getApps().length > 0) return;

  const projectId = process.env.FIREBASE_PROJECT_ID ?? process.env.GOOGLE_CLOUD_PROJECT;
  if (!projectId) return;

  initializeApp({
    credential: applicationDefault(),
    projectId,
  });
}

async function resolveUser(decoded: { uid: string; email?: string; name?: string }): Promise<AuthenticatedUser> {
  const user = await prisma.user.upsert({
    where: { firebaseUid: decoded.uid },
    update: {
      email: decoded.email ?? undefined,
      displayName: decoded.name ?? undefined,
    },
    create: {
      firebaseUid: decoded.uid,
      email: decoded.email,
      displayName: decoded.name,
    },
  });

  return {
    id: user.id,
    firebaseUid: user.firebaseUid,
    email: user.email,
    displayName: user.displayName,
  };
}

export async function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    next();
    return;
  }

  try {
    ensureFirebaseApp();
    if (getApps().length === 0) {
      next();
      return;
    }

    const token = header.slice('Bearer '.length);
    const decoded = await getAuth().verifyIdToken(token);
    req.currentUser = await resolveUser(decoded);
  } catch {
    // Anonymous access remains available for demo endpoints.
  }

  next();
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.currentUser) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  next();
}
