"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MapPin, ShieldAlert, Star } from "lucide-react";
import { AppShell } from "../../../components/layout/app-shell";
import { BookingModal } from "../../../components/booking-modal";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { LoadingState } from "../../../components/ui/loading-state";
import { SectionCard } from "../../../components/ui/section-card";
import { useAuth } from "../../../context/auth-context";
import { request } from "../../../lib/api";
import { formatCurrency } from "../../../lib/utils";

export default function ProviderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user, updateUser } = useAuth();
  const [data, setData] = useState({ profile: null, reviews: [] });
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [reportReason, setReportReason] = useState("safety");
  const [reportMessage, setReportMessage] = useState("");
  const [status, setStatus] = useState({ error: "", success: "" });

  useEffect(() => {
    request("get", `/profiles/providers/${params.id}`)
      .then((response) => {
        setData(response);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params.id]);

  const submitReport = async () => {
    try {
      await request("post", "/reports", {
        reportedUserId: data.profile.user,
        reason: reportReason,
        description: reportMessage
      });
      setStatus({ error: "", success: "Report submitted to the admin team." });
      setReportMessage("");
    } catch (error) {
      setStatus({
        error: error.response?.data?.message || "Unable to submit report.",
        success: ""
      });
    }
  };

  const blockUser = async () => {
    try {
      const response = await request("post", `/auth/block/${data.profile.user}`);
      updateUser(response.user);
      setStatus({ error: "", success: "User blocked successfully." });
    } catch (error) {
      setStatus({
        error: error.response?.data?.message || "Unable to block user.",
        success: ""
      });
    }
  };

  if (loading) {
    return (
      <AppShell>
        <LoadingState label="Loading profile..." />
      </AppShell>
    );
  }

  if (!data.profile) {
    return (
      <AppShell>
        <SectionCard>Profile not found.</SectionCard>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <SectionCard className="overflow-hidden p-0">
          <div className="h-80 bg-gradient-to-br from-blush via-white to-mist">
            {data.profile.photoUrl ? (
              <img
                src={data.profile.photoUrl}
                alt={data.profile.displayName}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-8xl font-semibold text-rosewood/25">
                {data.profile.displayName?.[0]}
              </div>
            )}
          </div>

          <div className="space-y-5 p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-4xl font-semibold">{data.profile.displayName}</h1>
                  <Badge>{data.profile.age} yrs</Badge>
                </div>
                <p className="mt-2 text-lg text-black/60">{data.profile.headline}</p>
              </div>
              <div className="rounded-[28px] bg-sand px-5 py-4">
                <p className="text-xs uppercase tracking-[0.24em] text-rosewood">Price</p>
                <p className="mt-2 text-2xl font-semibold">{formatCurrency(data.profile.pricePerHour)}/hr</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-5 text-sm text-black/65">
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-coral" />
                {data.profile.location}
              </span>
              <span className="inline-flex items-center gap-2">
                <Star className="h-4 w-4 fill-coral text-coral" />
                {data.profile.ratingAverage?.toFixed?.(1) || data.profile.ratingAverage || "New"} (
                {data.profile.reviewCount || 0})
              </span>
            </div>

            <p className="text-sm leading-7 text-black/70">{data.profile.bio}</p>

            <div className="flex flex-wrap gap-2">
              {data.profile.interests?.map((interest) => (
                <Badge key={interest} className="bg-blush/70 text-ink">
                  {interest}
                </Badge>
              ))}
            </div>

            <div className="rounded-[28px] bg-white/70 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rosewood">Availability</p>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {data.profile.availability?.map((slot, index) => (
                  <div key={`${slot.day}-${index}`} className="rounded-2xl bg-sand px-4 py-3 text-sm">
                    <p className="font-semibold">{slot.day}</p>
                    <p className="mt-1 text-black/60">
                      {slot.startTime} - {slot.endTime}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {user?.role === "client" ? (
                <Button onClick={() => setShowBooking(true)}>Book session</Button>
              ) : (
                <Button
                  onClick={() => {
                    if (!user) {
                      router.push("/login");
                    }
                  }}
                >
                  {user ? "Bookings are client-only" : "Log in to book"}
                </Button>
              )}
              {user ? (
                <Button variant="secondary" onClick={blockUser}>
                  Block user
                </Button>
              ) : null}
            </div>
          </div>
        </SectionCard>

        <div className="space-y-6">
          <SectionCard>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-coral/12 p-3 text-coral">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rosewood">
                  Safety action
                </p>
                <h2 className="text-xl font-semibold">Report this profile</h2>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <select
                className="w-full rounded-2xl border border-black/10 bg-white/80 px-4 py-3 text-sm"
                value={reportReason}
                onChange={(event) => setReportReason(event.target.value)}
              >
                <option value="safety">Safety concern</option>
                <option value="harassment">Harassment</option>
                <option value="fake-profile">Fake profile</option>
                <option value="spam">Spam</option>
                <option value="other">Other</option>
              </select>
              <textarea
                className="min-h-28 w-full rounded-2xl border border-black/10 bg-white/80 px-4 py-3 text-sm outline-none transition focus:border-coral focus:ring-2 focus:ring-coral/20"
                value={reportMessage}
                onChange={(event) => setReportMessage(event.target.value)}
                placeholder="Add details for the moderation team."
              />
              {status.error ? <p className="text-sm text-rosewood">{status.error}</p> : null}
              {status.success ? <p className="text-sm text-green-700">{status.success}</p> : null}
              <Button variant="outline" onClick={submitReport} disabled={!user}>
                {user ? "Submit report" : "Log in to report"}
              </Button>
            </div>
          </SectionCard>

          <SectionCard>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rosewood">Recent reviews</p>
            <div className="mt-4 space-y-4">
              {data.reviews?.length ? (
                data.reviews.map((review) => (
                  <div key={review._id} className="rounded-[24px] bg-white/80 p-4">
                    <p className="text-sm font-semibold">{review.client?.email}</p>
                    <p className="mt-1 text-sm text-black/60">{review.rating} / 5</p>
                    <p className="mt-2 text-sm leading-6 text-black/70">{review.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-black/60">No reviews yet.</p>
              )}
            </div>
          </SectionCard>
        </div>
      </div>

      {showBooking ? <BookingModal profile={data.profile} onClose={() => setShowBooking(false)} /> : null}
    </AppShell>
  );
}
