"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  authInputClassName,
  authPrimaryButtonClassName,
  AuthFormDivider,
  AuthFormError,
  AuthFormField,
  AuthFormFooter,
  AuthFormShell,
  AuthGoogleButton,
} from "@/components/marketing/auth-form-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

export function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleGoogleSignIn() {
    setError(null);
    setGoogleLoading(true);

    const { error: signInError } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });

    if (signInError) {
      setGoogleLoading(false);
      setError(signInError.message ?? "Google sign in failed. Try again.");
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const { error: signInError } = await authClient.signIn.email({
      email,
      password,
      callbackURL: "/dashboard",
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message ?? "Sign in failed. Check your credentials.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      <AuthFormShell>
        <div className="space-y-3.5 p-4 sm:space-y-4 sm:p-5">
          <AuthGoogleButton onClick={handleGoogleSignIn} loading={googleLoading} />

          <AuthFormDivider />

          <form onSubmit={handleSubmit} className="space-y-3">
            {error ? <AuthFormError message={error} /> : null}

            <AuthFormField id="sign-in-email" label="Email">
              <Input
                id="sign-in-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className={authInputClassName}
              />
            </AuthFormField>

            <AuthFormField id="sign-in-password" label="Password">
              <Input
                id="sign-in-password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Your password"
                className={authInputClassName}
              />
            </AuthFormField>

            <Button
              type="submit"
              disabled={loading}
              className={authPrimaryButtonClassName}
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </div>
      </AuthFormShell>

      <AuthFormFooter>
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="font-medium text-primary hover:underline">
          Sign up
        </Link>
      </AuthFormFooter>
    </div>
  );
}
