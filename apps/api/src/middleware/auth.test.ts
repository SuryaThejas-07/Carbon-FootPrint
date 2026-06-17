import { describe, it, expect, vi, beforeEach } from 'vitest';
import { optionalAuth, requireAuth } from './auth';
import type { Request, Response } from 'express';
import { prisma } from '@carbonwise/database';

// Mock database package
vi.mock('@carbonwise/database', () => {
  return {
    prisma: {
      user: {
        upsert: vi.fn(),
      },
    },
  };
});

// Mock firebase-admin/app
vi.mock('firebase-admin/app', () => {
  return {
    getApps: vi.fn(() => []),
    initializeApp: vi.fn(),
    applicationDefault: vi.fn(),
  };
});

// Mock firebase-admin/auth
vi.mock('firebase-admin/auth', () => {
  const verifyIdTokenMock = vi.fn();
  return {
    getAuth: vi.fn(() => ({
      verifyIdToken: verifyIdTokenMock,
    })),
  };
});

import { getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

describe('Auth Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: any;

  beforeEach(() => {
    vi.clearAllMocks();
    req = {
      headers: {},
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    next = vi.fn();
  });

  describe('requireAuth', () => {
    it('should call next if req.currentUser is set', () => {
      req.currentUser = { id: 'u-1', firebaseUid: 'f-1', email: 'a@b.com', displayName: 'User' };
      requireAuth(req as Request, res as Response, next);
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should return 401 if req.currentUser is not set', () => {
      requireAuth(req as Request, res as Response, next);
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Authentication required' });
    });
  });

  describe('optionalAuth', () => {
    it('should call next if no auth header', async () => {
      await optionalAuth(req as Request, res as Response, next);
      expect(next).toHaveBeenCalled();
      expect(req.currentUser).toBeUndefined();
    });

    it('should call next if auth header is invalid', async () => {
      req.headers = { authorization: 'invalid-header' };
      await optionalAuth(req as Request, res as Response, next);
      expect(next).toHaveBeenCalled();
      expect(req.currentUser).toBeUndefined();
    });

    it('should call next and skip authentication if Firebase app is not initialized', async () => {
      req.headers = { authorization: 'Bearer token-123' };
      vi.mocked(getApps).mockReturnValue([]);
      
      await optionalAuth(req as Request, res as Response, next);
      expect(next).toHaveBeenCalled();
      expect(req.currentUser).toBeUndefined();
    });

    it('should resolve and set currentUser when token is verified successfully', async () => {
      req.headers = { authorization: 'Bearer token-123' };
      
      // Mock Firebase app initialized
      vi.mocked(getApps).mockReturnValue([{ name: 'default' } as any]);
      
      // Mock verifyIdToken to resolve
      const mockDecodedToken = { uid: 'firebase-uid-123', email: 'test@email.com', name: 'Test User' };
      const verifyIdTokenMock = vi.mocked(getAuth().verifyIdToken);
      verifyIdTokenMock.mockResolvedValue(mockDecodedToken as any);

      // Mock prisma upsert user
      const mockDbUser = { id: 'db-id-123', firebaseUid: 'firebase-uid-123', email: 'test@email.com', displayName: 'Test User' };
      vi.mocked(prisma.user.upsert).mockResolvedValue(mockDbUser as any);

      await optionalAuth(req as Request, res as Response, next);

      expect(verifyIdTokenMock).toHaveBeenCalledWith('token-123');
      expect(prisma.user.upsert).toHaveBeenCalled();
      expect(req.currentUser).toEqual({
        id: 'db-id-123',
        firebaseUid: 'firebase-uid-123',
        email: 'test@email.com',
        displayName: 'Test User',
      });
      expect(next).toHaveBeenCalled();
    });

    it('should call next without setting currentUser if token verification fails', async () => {
      req.headers = { authorization: 'Bearer token-123' };
      vi.mocked(getApps).mockReturnValue([{ name: 'default' } as any]);
      vi.mocked(getAuth().verifyIdToken).mockRejectedValue(new Error('Invalid token'));

      await optionalAuth(req as Request, res as Response, next);
      expect(next).toHaveBeenCalled();
      expect(req.currentUser).toBeUndefined();
    });
  });
});
