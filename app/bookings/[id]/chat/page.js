"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppShell } from "../../../../components/layout/app-shell";
import { ChatPanel } from "../../../../components/chat-panel";
import { LoadingState } from "../../../../components/ui/loading-state";
import { useAuth } from "../../../../context/auth-context";

export default function BookingChatPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, router, user]);

  if (loading || !user) {
    return (
      <AppShell>
        <LoadingState label="Loading chat..." />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <ChatPanel bookingId={params.id} />
    </AppShell>
  );
}
