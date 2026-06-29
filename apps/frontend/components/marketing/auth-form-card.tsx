import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type AuthFormShellProps = {
  children: ReactNode;
  className?: string;
};

export function AuthFormShell({ children, className }: AuthFormShellProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border/60 bg-card/30 shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}

type AuthFormFieldProps = {
  id: string;
  label: string;
  hint?: string;
  children: ReactNode;
};

export function AuthFormField({ id, label, hint, children }: AuthFormFieldProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-sm font-medium text-foreground">
          {label}
        </label>
        {hint ? <span className="text-xs text-muted-foreground">{hint}</span> : null}
      </div>
      {children}
    </div>
  );
}

export const authInputClassName =
  "h-10 rounded-xl border-border/60 bg-background/50 px-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-sm transition-[border-color,box-shadow] focus-visible:border-primary/40 focus-visible:ring-primary/20 sm:h-11 sm:px-4";

export const authPrimaryButtonClassName =
  "h-10 w-full rounded-full border border-primary/30 bg-primary text-sm shadow-[0_0_24px_color-mix(in_oklch,var(--primary)_35%,transparent)] transition-[box-shadow,background-color] hover:bg-primary/90 hover:shadow-[0_0_32px_color-mix(in_oklch,var(--primary)_45%,transparent)] sm:h-11";

export const authOutlineButtonClassName =
  "h-10 w-full rounded-full border-primary/25 bg-background/40 text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-sm transition-[border-color,background-color] hover:border-primary/40 hover:bg-background/60 sm:h-11";

export function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("size-4 shrink-0", className)} viewBox="0 0 24 24" aria-hidden>
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

type AuthGoogleButtonProps = {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
};

export function AuthGoogleButton({ onClick, disabled, loading }: AuthGoogleButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        authOutlineButtonClassName,
        "inline-flex items-center justify-center gap-2.5 text-sm font-medium text-foreground",
      )}
    >
      <GoogleIcon />
      {loading ? "Redirecting to Google..." : "Continue with Google"}
    </button>
  );
}

export function AuthFormError({ message }: { message: string }) {
  return (
    <p
      className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2.5 text-sm text-rose-400"
      role="alert"
    >
      {message}
    </p>
  );
}

export function AuthFormDivider({ label = "Or continue with email" }: { label?: string }) {
  return (
    <div className="relative py-1">
      <div className="absolute inset-0 flex items-center" aria-hidden>
        <span className="w-full border-t border-border/60" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-card/30 px-3 text-[0.6875rem] font-medium uppercase tracking-[0.15em] text-muted-foreground">
          {label}
        </span>
      </div>
    </div>
  );
}

type AuthFormFooterProps = {
  children: ReactNode;
};

export function AuthFormFooter({ children }: AuthFormFooterProps) {
  return (
    <p className="text-center text-sm text-muted-foreground">{children}</p>
  );
}

/** @deprecated Use AuthFormShell */
export function AuthFormCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <AuthFormShell className={className}>{children}</AuthFormShell>;
}
