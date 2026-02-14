import { HTTPError } from 'ky';
import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { loginByEmail } from '../api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

const COMPANY_NAME = 'Demo AI';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage('Email is required');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await loginByEmail(trimmedEmail);
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('authUser', JSON.stringify(response.user));

      const role = response.user.role.name.trim().toLowerCase();
      if (role === 'admin') {
        navigate('/dashboard', { replace: true });
        return;
      }

      if (role === 'user') {
        navigate('/approval', { replace: true });
        return;
      }

      setErrorMessage('Role is not supported');
    } catch (error) {
      if (error instanceof HTTPError && error.response.status === 404) {
        setErrorMessage('User Not Found');
      } else {
        setErrorMessage('Unable to login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-muted/40 px-4 py-10">
      <div className="mx-auto flex min-h-[80vh] w-full max-w-md items-center">
        <section className="w-full rounded-xl border bg-card p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">Refactory</p>
          <h1 className="mt-1 text-2xl font-semibold text-foreground">{COMPANY_NAME}</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in using your registered email.</p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <Input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={isLoading}
              aria-label="Email"
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          {errorMessage ? (
            <p className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {errorMessage}
            </p>
          ) : null}
        </section>
      </div>
    </main>
  );
}
