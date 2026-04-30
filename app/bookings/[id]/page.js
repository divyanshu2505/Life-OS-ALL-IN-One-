"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AppShell } from "../../../components/layout/app-shell";
import { ReviewForm } from "../../../components/review-form";
import { Button } from "../../../components/ui/button";
import { LoadingState } from "../../../components/ui/loading-state";
import { SectionCard } from "../../../components/ui/section-card";
import { useAuth } from "../../../context/auth-context";
import { request } from "../../../lib/api";
import { formatCurrency, formatDateTime } from "../../../lib/utils";

export default function BookingDetailsPage() {
  const params = useParams();
  const { user, loading } = useAuth();
  const [booking, setBooking] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [status, setStatus] = useState({ loading: false, error: "", success: "" });

  const loadBooking = () => {
    request("get", "/bookings/mine")
      .then((response) => {
        const match = response.bookings.find((item) => item._id === params.id);
        setBooking(match || null);
      })
      .finally(() => {
        setPageLoading(false);
      });
  };

  useEffect(() => {
    if (!user) {
      setPageLoading(false);
      return;
    }

    loadBooking();
  }, [params.id, user]);

  const updateStatus = async (nextStatus) => {
    setStatus({ loading: true, error: "", success: "" });

    try {
      await request("patch", `/bookings/${params.id}/status`, { status: nextStatus });
      setStatus({ loading: false, error: "", success: `Booking marked as ${nextStatus}.` });
      loadBooking();
    } catch (error) {
      setStatus({
        loading: false,
        error: error.response?.data?.message || "Unable to update booking status.",
        success: ""
      });
    }
  };

  if (loading || pageLoading) {
    return (
      <AppShell>
        <LoadingState label="Loading booking..." />
      </AppShell>
    );
  }

  if (!booking) {
    return (
      <AppShell>
        <SectionCard>Booking not found.</SectionCard>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <SectionCard className="space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rosewood">Booking details</p>
            <h1 className="mt-2 text-4xl font-semibold">{booking.providerProfile?.displayName}</h1>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[28px] bg-sand p-5">
              <p className="text-sm text-black/55">Scheduled for</p>
              <p className="mt-2 text-lg font-semibold">{formatDateTime(booking.startTime)}</p>
            </div>
            <div className="rounded-[28px] bg-sand p-5">
              <p className="text-sm text-black/55">Price</p>
              <p className="mt-2 text-lg font-semibold">{formatCurrency(booking.totalPrice)}</p>
            </div>
            <div className="rounded-[28px] bg-sand p-5">
              <p className="text-sm text-black/55">Payment</p>
              <p className="mt-2 text-lg font-semibold">{booking.paymentStatus}</p>
            </div>
            <div className="rounded-[28px] bg-sand p-5">
              <p className="text-sm text-black/55">Status</p>
              <p className="mt-2 text-lg font-semibold">{booking.status}</p>
            </div>
          </div>

          <div className="rounded-[28px] bg-white/75 p-5">
            <p className="text-sm font-semibold">Notes</p>
            <p className="mt-2 text-sm leading-6 text-black/65">{booking.notes || "No notes added."}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            {booking.chatEnabled ? (
              <Link href={`/bookings/${booking._id}/chat`}>
                <Button>Open chat</Button>
              </Link>
            ) : null}
            {user?.role === "provider" && booking.status === "confirmed" ? (
              <Button onClick={() => updateStatus("completed")} disabled={status.loading}>
                Mark completed
              </Button>
            ) : null}
            {user?.role === "client" && booking.status === "confirmed" ? (
              <Button variant="outline" onClick={() => updateStatus("cancelled")} disabled={status.loading}>
                Cancel booking
              </Button>
            ) : null}
          </div>

          {status.error ? <p className="text-sm text-rosewood">{status.error}</p> : null}
          {status.success ? <p className="text-sm text-green-700">{status.success}</p> : null}
        </SectionCard>

        <div className="space-y-6">
          {user?.role === "client" && booking.status === "completed" ? (
            <ReviewForm bookingId={booking._id} onSubmitted={loadBooking} />
          ) : null}

          <SectionCard>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rosewood">Reminder</p>
            <p className="mt-3 text-sm leading-6 text-black/65">
              Keep conversations inside platform rules. Sessions must remain companionship-focused and legal at all times.
            </p>
          </SectionCard>
        </div>
      </div>
    </AppShell>
  );
}
