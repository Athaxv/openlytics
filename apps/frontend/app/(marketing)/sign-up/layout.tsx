import type { ReactNode } from "react";

export default function SignUpLayout({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-0 h-dvh w-full overflow-hidden overscroll-none">
      {children}
    </div>
  );
}
