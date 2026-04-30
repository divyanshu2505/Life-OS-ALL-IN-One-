"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "../../components/layout/app-shell";
import { ProfileForm } from "../../components/profile-form";
import { LoadingState } from "../../components/ui/loading-state";
import { useAuth } from "../../context/auth-context";
import { getDashboardPath } from "../../lib/utils";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, router, user]);

  useEffect(() => {
    if (!loading && user?.profileCompleted) {
      router.push(getDashboardPath(user.role));
    }
  }, [loading, router, user]);

  if (loading || !user) {
    return (
      <AppShell>
        <LoadingState label="Preparing your onboarding..." />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rosewood">
            Profile setup
          </p>
          <h1 className="mt-2 text-4xl font-semibold">Complete your {user.role} profile</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-black/65">
            Providers stay in pending review until an admin approves the profile. Clients can start browsing
            once profile details are saved.
          </p>
        </div>
        <ProfileForm role={user.role} />
      </div>
    </AppShell>
  );
}
