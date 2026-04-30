"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppShell } from "../../../components/layout/app-shell";
import { Button } from "../../../components/ui/button";
import { EmptyState } from "../../../components/ui/empty-state";
import { LoadingState } from "../../../components/ui/loading-state";
import { SectionCard } from "../../../components/ui/section-card";
import { useAuth } from "../../../context/auth-context";
import { request } from "../../../lib/api";
import { formatDateTime } from "../../../lib/utils";

export default function ClientDashboardPage() {
  const { user, loading } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setPageLoading(false);
      return;
    }

    request("get", "/bookings/mine")
      .then((response) => setBookings(response.bookings))
      .finally(() => setPageLoading(false));
  }, [user]);

  if (loading || pageLoading) {
    return (
      <AppShell>
        <LoadingState label="Loading client dashboard..." />
      </AppShell>
    );
  }

  if (!user) {
    return (
      <AppShell>
        <EmptyState
          title="Please log in"
          description="Your dashboard becomes available after authentication."
          action={
            <Link href="/login">
              <Button>Log in</Button>
            </Link>
          }
        />
      </AppShell>
    );
  }

  const upcoming = bookings.filter((booking) => booking.status !== "cancelled");

  return (
    <AppShell>
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <SectionCard className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rosewood">Client dashboard</p>
          <h1 className="text-4xl font-semibold">Welcome back, {user.profile?.displayName || "there"}</h1>
          <p className="max-w-2xl text-sm leading-6 text-black/65">
            Browse approved profiles, manage bookings, and keep chats inside confirmed sessions.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/profiles">
              <Button>Browse profiles</Button>
            </Link>
            <Link href="/bookings">
              <Button variant="secondary">View all bookings</Button>
            </Link>
          </div>
        </SectionCard>

        <SectionCard>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rosewood">Snapshot</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="rounded-[24px] bg-sand p-4">
              <p className="text-sm text-black/55">Total bookings</p>
              <p className="mt-2 text-3xl font-semibold">{bookings.length}</p>
            </div>
            <div className="rounded-[24px] bg-sand p-4">
              <p className="text-sm text-black/55">Upcoming</p>
              <p className="mt-2 text-3xl font-semibold">
                {upcoming.filter((booking) => new Date(booking.startTime) > new Date()).length}
              </p>
            </div>
            <div className="rounded-[24px] bg-sand p-4">
              <p className="text-sm text-black/55">Chat unlocked</p>
              <p className="mt-2 text-3xl font-semibold">
                {bookings.filter((booking) => booking.chatEnabled).length}
              </p>
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rosewood">Upcoming sessions</p>
        <div className="mt-4 space-y-3">
          {upcoming.length ? (
            upcoming.slice(0, 5).map((booking) => (
              <div key={booking._id} className="flex flex-col gap-3 rounded-[24px] bg-white/80 p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold">{booking.providerProfile?.displayName}</p>
                  <p className="mt-1 text-sm text-black/60">{formatDateTime(booking.startTime)}</p>
                </div>
                <Link href={`/bookings/${booking._id}`}>
                  <Button variant="outline">View booking</Button>
                </Link>
              </div>
            ))
          ) : (
            <p className="text-sm text-black/60">No active bookings yet.</p>
          )}
        </div>
      </SectionCard>
    </AppShell>
  );
}
