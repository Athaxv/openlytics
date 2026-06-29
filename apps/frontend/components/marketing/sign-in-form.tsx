"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AuthFormCard,
  AuthFormDivider,
  AuthFormError,
} from "@/components/marketing/auth-form-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { googleAuthHref } from "@/lib/marketing/content";

export function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
    <div className="space-y-6">
      <AuthFormCard>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error ? <AuthFormError message={error} /> : null}

          <div className="space-y-2">
            <label htmlFor="sign-in-email" className="text-sm font-medium text-foreground">
              Email
            </label>
            <Input
              id="sign-in-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="sign-in-password" className="text-sm font-medium text-foreground">
              Password
            </label>
            <Input
              id="sign-in-password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Your password"
              className="h-10"
            />
          </div>

          <Button type="submit" disabled={loading} className="h-10 w-full">
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </AuthFormCard>

      <AuthFormDivider />

      <Button variant="outline" className="h-10 w-full" render={<Link href={googleAuthHref} />}>
        Continue with Google
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
