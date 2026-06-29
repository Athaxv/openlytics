import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type AuthFormCardProps = {
  children: ReactNode;
  className?: string;
};

export function AuthFormCard({ children, className }: AuthFormCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/80 bg-card/60 p-6 shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function AuthFormError({ message }: { message: string }) {
  return (
    <p
      className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-400"
      role="alert"
    >
      {message}
    </p>
  );
}

export function AuthFormDivider() {
  return (
    <div className="relative py-2">
      <div className="absolute inset-0 flex items-center" aria-hidden>
        <span className="w-full border-t border-border" />
      </div>
      <div className="relative flex justify-center text-xs uppercase tracking-wide">
        <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
      </div>
    </div>
  );
}
