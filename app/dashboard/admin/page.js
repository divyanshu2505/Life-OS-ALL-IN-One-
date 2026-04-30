"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppShell } from "../../../components/layout/app-shell";
import { useAuth } from "../../../context/auth-context";
import { request } from "../../../lib/api";
import { formatDateTime } from "../../../lib/utils";
import { Button } from "../../../components/ui/button";
import { EmptyState } from "../../../components/ui/empty-state";
import { LoadingState } from "../../../components/ui/loading-state";
import { SectionCard } from "../../../components/ui/section-card";

export default function AdminDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAll = () => {
    setLoading(true);

    Promise.all([
      request("get", "/admin/overview"),
      request("get", "/admin/users"),
      request("get", "/admin/reports")
    ])
      .then(([overviewResponse, usersResponse, reportsResponse]) => {
        setOverview(overviewResponse);
        setUsers(usersResponse.users);
        setReports(reportsResponse.reports);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (user?.role === "admin") {
      loadAll();
    } else {
      setLoading(false);
    }
  }, [user]);

  const moderateProfile = async (profileId, status) => {
    await request("patch", `/admin/providers/${profileId}/status`, { status });
    loadAll();
  };

  if (authLoading || loading) {
    return (
      <AppShell>
        <LoadingState label="Loading admin dashboard..." />
      </AppShell>
    );
  }

  if (!user) {
    return (
      <AppShell>
        <EmptyState
          title="Please log in"
          description="Admin moderation tools require authentication."
          action={
            <Link href="/login">
              <Button>Log in</Button>
            </Link>
          }
        />
      </AppShell>
    );
  }

  if (user.role !== "admin") {
    return (
      <AppShell>
        <EmptyState
          title="Admin access only"
          description="This workspace is reserved for moderation and oversight."
        />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="grid gap-4 md:grid-cols-4">
        <SectionCard>
          <p className="text-sm text-black/55">Users</p>
          <p className="mt-2 text-3xl font-semibold">{overview?.stats?.usersCount || 0}</p>
        </SectionCard>
        <SectionCard>
          <p className="text-sm text-black/55">Pending providers</p>
          <p className="mt-2 text-3xl font-semibold">{overview?.stats?.providersPending || 0}</p>
        </SectionCard>
        <SectionCard>
          <p className="text-sm text-black/55">Bookings</p>
          <p className="mt-2 text-3xl font-semibold">{overview?.stats?.bookingsCount || 0}</p>
        </SectionCard>
        <SectionCard>
          <p className="text-sm text-black/55">Open reports</p>
          <p className="mt-2 text-3xl font-semibold">{overview?.stats?.openReportsCount || 0}</p>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <SectionCard>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rosewood">
            Pending profiles
          </p>
          <div className="mt-4 space-y-3">
            {overview?.pendingProfiles?.length ? (
              overview.pendingProfiles.map((profile) => (
                <div key={profile._id} className="rounded-[24px] bg-white/80 p-4">
                  <p className="font-semibold">{profile.displayName}</p>
                  <p className="mt-1 text-sm text-black/60">{profile.location}</p>
                  <p className="mt-2 text-sm leading-6 text-black/70">{profile.bio}</p>
                  <div className="mt-4 flex gap-3">
                    <Button onClick={() => moderateProfile(profile._id, "approved")}>Approve</Button>
                    <Button variant="danger" onClick={() => moderateProfile(profile._id, "rejected")}>
                      Reject
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-black/60">No pending profiles right now.</p>
            )}
          </div>
        </SectionCard>

        <SectionCard>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rosewood">
            Recent bookings
          </p>
          <div className="mt-4 space-y-3">
            {overview?.recentBookings?.length ? (
              overview.recentBookings.map((booking) => (
                <div key={booking._id} className="rounded-[24px] bg-white/80 p-4">
                  <p className="font-semibold">{booking.providerProfile?.displayName}</p>
                  <p className="mt-1 text-sm text-black/60">{formatDateTime(booking.startTime)}</p>
                  <p className="mt-1 text-sm text-black/60">
                    Client: {booking.client?.email} - Status: {booking.status}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-black/60">No booking activity yet.</p>
            )}
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <SectionCard>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rosewood">Users</p>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-black/50">
                <tr>
                  <th className="pb-3 pr-4 font-medium">Email</th>
                  <th className="pb-3 pr-4 font-medium">Role</th>
                  <th className="pb-3 pr-4 font-medium">Profile</th>
                  <th className="pb-3 pr-4 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((entry) => (
                  <tr key={entry._id} className="border-t border-black/5">
                    <td className="py-3 pr-4">{entry.email}</td>
                    <td className="py-3 pr-4 capitalize">{entry.role}</td>
                    <td className="py-3 pr-4">{entry.profile?.displayName || "Incomplete"}</td>
                    <td className="py-3 pr-4">{formatDateTime(entry.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rosewood">Reports</p>
          <div className="mt-4 space-y-3">
            {reports.length ? (
              reports.map((report) => (
                <div key={report._id} className="rounded-[24px] bg-white/80 p-4">
                  <p className="font-semibold">{report.reason}</p>
                  <p className="mt-1 text-sm text-black/60">Reporter: {report.reporter?.email}</p>
                  <p className="mt-1 text-sm text-black/60">
                    Reported user: {report.reportedUser?.email}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-black/70">
                    {report.description || "No details added."}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-black/60">No reports submitted.</p>
            )}
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
}
