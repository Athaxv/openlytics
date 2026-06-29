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

export function SignUpForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
    <div className="space-y-6">
      <AuthFormCard>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error ? <AuthFormError message={error} /> : null}

          <div className="space-y-2">
            <label htmlFor="sign-up-name" className="text-sm font-medium text-foreground">
              Name
            </label>
            <Input
              id="sign-up-name"
              type="text"
              required
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="sign-up-email" className="text-sm font-medium text-foreground">
              Email
            </label>
            <Input
              id="sign-up-email"
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
            <label htmlFor="sign-up-password" className="text-sm font-medium text-foreground">
              Password
            </label>
            <Input
              id="sign-up-password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 8 characters"
              className="h-10"
            />
          </div>

          <Button type="submit" disabled={loading} className="h-10 w-full">
            {loading ? "Creating account..." : "Create account"}
          </Button>
        </form>
      </AuthFormCard>

      <AuthFormDivider />

      <Button variant="outline" className="h-10 w-full" render={<Link href={googleAuthHref} />}>
        Continue with Google
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
