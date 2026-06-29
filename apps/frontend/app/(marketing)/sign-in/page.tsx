import { MarketingAuthLayout } from "@/components/marketing/marketing-auth-layout";
import { SignInForm } from "@/components/marketing/sign-in-form";

export default function SignInPage() {
  return (
    <MarketingAuthLayout
      title="Sign in"
      description="Welcome back. Continue your DSA journey."
      eyebrow="Sign in"
    >
      <SignInForm />
    </MarketingAuthLayout>
  );
}
