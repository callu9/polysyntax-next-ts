'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useTranslation } from '@/i18n/useTranslation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { login } = useAuthStore();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      router.push('/');
    } catch {
      setError('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md border border-border bg-card p-6 sm:p-8">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary">Reader access</p>
        <h1 className="mb-8 text-3xl font-semibold tracking-tight">{t('common.login')}</h1>

        {error && (
          <div className="mb-6 border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t('auth.email')}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground"
              required
            />
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t('auth.password')}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary px-4 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-85 disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : t('common.login')}
          </button>
        </form>

        <p className="mt-6 border-t border-border pt-5 text-sm leading-6 text-muted-foreground">
          Demo: Use any email and password to login
        </p>
      </div>
    </main>
  );
}
