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

export function SignUpForm() {
  const router = useRouter();
  const [name, setName] = useState("");
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

    const { error: signUpError } = await authClient.signUp.email({
      name,
      email,
      password,
      callbackURL: "/dashboard",
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message ?? "Sign up failed. Try a different email.");
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

          <AuthFormDivider label="Or sign up with email" />

          <form onSubmit={handleSubmit} className="space-y-3">
            {error ? <AuthFormError message={error} /> : null}

            <AuthFormField id="sign-up-name" label="Name">
              <Input
                id="sign-up-name"
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                className={authInputClassName}
              />
            </AuthFormField>

            <AuthFormField id="sign-up-email" label="Email">
              <Input
                id="sign-up-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className={authInputClassName}
              />
            </AuthFormField>

            <AuthFormField id="sign-up-password" label="Password" hint="Min. 8 characters">
              <Input
                id="sign-up-password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Create a password"
                className={authInputClassName}
              />
            </AuthFormField>

            <Button
              type="submit"
              disabled={loading}
              className={authPrimaryButtonClassName}
            >
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </div>
      </AuthFormShell>

      <AuthFormFooter>
        Already have an account?{" "}
        <Link href="/sign-in" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </AuthFormFooter>
    </div>
  );
}
