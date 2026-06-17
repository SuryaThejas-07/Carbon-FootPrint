'use client';

import { useAuth } from '@/lib/auth-context';

export function AuthBar() {
  const { user, configured, loading, signIn, signOut } = useAuth();

  if (!configured) {
    return (
      <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-xs text-amber-100">
        Firebase auth optional
      </span>
    );
  }

  if (loading) {
    return <span className="text-sm text-slate-300">Checking session…</span>;
  }

  if (!user) {
    return (
      <button
        type="button"
        onClick={() => signIn()}
        className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10"
      >
        Sign in with Google
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-slate-300">{user.displayName ?? user.email}</span>
      <button
        type="button"
        onClick={() => signOut()}
        className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10"
      >
        Sign out
      </button>
    </div>
  );
}
