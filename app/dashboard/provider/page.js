"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppShell } from "../../../components/layout/app-shell";
import { ProfileForm } from "../../../components/profile-form";
import { Button } from "../../../components/ui/button";
import { EmptyState } from "../../../components/ui/empty-state";
import { LoadingState } from "../../../components/ui/loading-state";
import { SectionCard } from "../../../components/ui/section-card";
import { useAuth } from "../../../context/auth-context";
import { request } from "../../../lib/api";
import { formatDateTime } from "../../../lib/utils";

export default function ProviderDashboardPage() {
  const { user, loading } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [profile, setProfile] = useState(user?.profile || null);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setPageLoading(false);
      return;
    }

    Promise.all([request("get", "/bookings/mine"), request("get", "/profiles/me").catch(() => ({ profile: null }))])
      .then(([bookingsResponse, profileResponse]) => {
        setBookings(bookingsResponse.bookings);
        setProfile(profileResponse.profile);
      })
      .finally(() => setPageLoading(false));
  }, [user]);

  if (loading || pageLoading) {
    return (
      <AppShell>
        <LoadingState label="Loading provider dashboard..." />
      </AppShell>
    );
  }

  if (!user) {
    return (
      <AppShell>
        <EmptyState
          title="Please log in"
          description="Provider tools are available after authentication."
          action={
            <Link href="/login">
              <Button>Log in</Button>
            </Link>
          }
        />
      </AppShell>
    );
  }

  if (user.role !== "provider") {
    return (
      <AppShell>
        <EmptyState
          title="Provider access only"
          description="This dashboard is reserved for provider accounts."
          action={
            <Link href="/profiles">
              <Button>Browse profiles</Button>
            </Link>
          }
        />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <SectionCard className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rosewood">Provider dashboard</p>
          <h1 className="text-4xl font-semibold">{profile?.displayName || "Your provider profile"}</h1>
          <p className="text-sm leading-6 text-black/65">
            Track moderation status, manage your availability, and keep confirmed bookings moving smoothly.
          </p>
          <div className="rounded-[28px] bg-sand p-5">
            <p className="text-sm text-black/55">Profile status</p>
            <p className="mt-2 text-2xl font-semibold">{profile?.status || "Not created yet"}</p>
          </div>
          <div className="rounded-[28px] bg-sand p-5">
            <p className="text-sm text-black/55">Active bookings</p>
            <p className="mt-2 text-2xl font-semibold">{bookings.length}</p>
          </div>
        </SectionCard>

        <SectionCard>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rosewood">Upcoming bookings</p>
          <div className="mt-4 space-y-3">
            {bookings.length ? (
              bookings.map((booking) => (
                <div key={booking._id} className="flex flex-col gap-3 rounded-[24px] bg-white/80 p-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-semibold">{booking.client?.email}</p>
                    <p className="mt-1 text-sm text-black/60">{formatDateTime(booking.startTime)}</p>
                  </div>
                  <Link href={`/bookings/${booking._id}`}>
                    <Button variant="outline">View booking</Button>
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-sm text-black/60">No bookings assigned yet.</p>
            )}
          </div>
        </SectionCard>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rosewood">Edit profile</p>
          <h2 className="mt-2 text-3xl font-semibold">Keep your listing polished and current</h2>
        </div>
        <ProfileForm role="provider" initialProfile={profile} />
      </div>
    </AppShell>
  );
}
