"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MessageCircleMore } from "lucide-react";
import { AppShell } from "../../components/layout/app-shell";
import { Button } from "../../components/ui/button";
import { EmptyState } from "../../components/ui/empty-state";
import { LoadingState } from "../../components/ui/loading-state";
import { SectionCard } from "../../components/ui/section-card";
import { useAuth } from "../../context/auth-context";
import { request } from "../../lib/api";
import { formatCurrency, formatDateTime } from "../../lib/utils";

export default function BookingsPage() {
  const { user, loading } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setPageLoading(false);
      return;
    }

    request("get", "/bookings/mine")
      .then((response) => {
        setBookings(response.bookings);
      })
      .finally(() => {
        setPageLoading(false);
      });
  }, [user]);

  if (loading || pageLoading) {
    return (
      <AppShell>
        <LoadingState label="Loading bookings..." />
      </AppShell>
    );
  }

  if (!user) {
    return (
      <AppShell>
        <EmptyState
          title="Log in to see your bookings"
          description="Bookings, chat, and reviews all live in your account."
          action={
            <Link href="/login">
              <Button>Log in</Button>
            </Link>
          }
        />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rosewood">Your bookings</p>
        <h1 className="text-4xl font-semibold">Sessions, payments, and chat access</h1>
      </div>

      {bookings.length ? (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <SectionCard key={booking._id}>
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rosewood">
                    {booking.status.replace("_", " ")}
                  </p>
                  <h2 className="text-2xl font-semibold">{booking.providerProfile?.displayName}</h2>
                  <p className="text-sm text-black/65">{formatDateTime(booking.startTime)}</p>
                  <p className="text-sm text-black/65">
                    {booking.durationHours} hour(s) • {formatCurrency(booking.totalPrice)}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link href={`/bookings/${booking._id}`}>
                    <Button variant="secondary">View details</Button>
                  </Link>
                  {booking.chatEnabled ? (
                    <Link href={`/bookings/${booking._id}/chat`}>
                      <Button className="gap-2">
                        <MessageCircleMore className="h-4 w-4" />
                        Open chat
                      </Button>
                    </Link>
                  ) : null}
                </div>
              </div>
            </SectionCard>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No bookings yet"
          description="Browse approved provider profiles and create your first companionship booking."
          action={
            <Link href="/profiles">
              <Button>Browse profiles</Button>
            </Link>
          }
        />
      )}
    </AppShell>
  );
}
