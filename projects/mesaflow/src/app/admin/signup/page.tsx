"use client";

import { SignupForm } from "@/components/auth/signup-form";
import { AuthLayout } from "@/components/ui/auth-layout";

export default function AdminSignupPage() {
  return (
    <AuthLayout title="Crie sua conta" subtitle="Configure seu estabelecimento em poucos minutos">
      <SignupForm />
    </AuthLayout>
  );
}
