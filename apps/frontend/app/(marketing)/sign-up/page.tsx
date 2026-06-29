import { MarketingAuthLayout } from "@/components/marketing/marketing-auth-layout";
import { SignUpForm } from "@/components/marketing/sign-up-form";

export default function SignUpPage() {
  return (
    <MarketingAuthLayout
      title="Create account"
      description="Start tracking your coding practice with Openlytics."
      eyebrow="Get started"
    >
      <SignUpForm />
    </MarketingAuthLayout>
  );
}
