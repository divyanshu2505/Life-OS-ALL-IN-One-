"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppShell } from "../../components/layout/app-shell";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { SectionCard } from "../../components/ui/section-card";
import { useAuth } from "../../context/auth-context";
import { request } from "../../lib/api";
import { getDashboardPath } from "../../lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const { saveSession } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [status, setStatus] = useState({ loading: false, error: "" });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, error: "" });

    try {
      const response = await request("post", "/auth/login", form);
      saveSession(response);

      if (!response.user.profileCompleted) {
        router.push("/onboarding");
        return;
      }

      router.push(getDashboardPath(response.user.role));
    } catch (error) {
      setStatus({
        loading: false,
        error: error.response?.data?.message || "Login failed. Please try again."
      });
    }
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-lg">
        <SectionCard>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rosewood">Welcome back</p>
          <h1 className="mt-3 text-3xl font-semibold">Log in to your account</h1>
          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <label className="space-y-2 block">
              <span className="text-sm font-medium">Email</span>
              <Input
                type="email"
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                required
              />
            </label>
            <label className="space-y-2 block">
              <span className="text-sm font-medium">Password</span>
              <Input
                type="password"
                value={form.password}
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                required
              />
            </label>
            {status.error ? <p className="text-sm text-rosewood">{status.error}</p> : null}
            <Button type="submit" className="w-full" disabled={status.loading}>
              {status.loading ? "Logging in..." : "Log in"}
            </Button>
          </form>

          <p className="mt-6 text-sm text-black/60">
            Demo accounts become available after seeding the database. New here?{" "}
            <Link href="/signup" className="font-semibold text-rosewood">
              Create an account
            </Link>
          </p>
        </SectionCard>
      </div>
    </AppShell>
  );
}
