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

export default function SignupPage() {
  const router = useRouter();
  const { saveSession } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "client",
    isAdultConfirmed: false
  });
  const [status, setStatus] = useState({ loading: false, error: "" });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, error: "" });

    try {
      const response = await request("post", "/auth/signup", form);
      saveSession(response);
      router.push("/onboarding");
    } catch (error) {
      setStatus({
        loading: false,
        error: error.response?.data?.message || "Signup failed. Please try again."
      });
    }
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl">
        <SectionCard>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rosewood">Get started</p>
          <h1 className="mt-3 text-3xl font-semibold">Create your account</h1>
          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium">Email</span>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, email: event.target.value }))
                  }
                  required
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium">Password</span>
                <Input
                  type="password"
                  value={form.password}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, password: event.target.value }))
                  }
                  required
                />
              </label>
            </div>

            <div className="space-y-2">
              <span className="text-sm font-medium">Choose your role</span>
              <div className="grid gap-4 md:grid-cols-2">
                <button
                  type="button"
                  className={`rounded-[28px] border p-5 text-left transition ${
                    form.role === "client"
                      ? "border-transparent bg-ink text-white"
                      : "border-black/10 bg-white/80"
                  }`}
                  onClick={() => setForm((current) => ({ ...current, role: "client" }))}
                >
                  <p className="font-semibold">Female User (Client)</p>
                  <p className="mt-2 text-sm opacity-80">Browse profiles, book sessions, chat after confirmation, and leave reviews.</p>
                </button>
                <button
                  type="button"
                  className={`rounded-[28px] border p-5 text-left transition ${
                    form.role === "provider"
                      ? "border-transparent bg-rosewood text-white"
                      : "border-black/10 bg-white/80"
                  }`}
                  onClick={() => setForm((current) => ({ ...current, role: "provider" }))}
                >
                  <p className="font-semibold">Male User (Service Provider)</p>
                  <p className="mt-2 text-sm opacity-80">Create a moderated profile, set availability, and accept companionship bookings.</p>
                </button>
              </div>
            </div>

            <label className="flex items-start gap-3 rounded-[24px] bg-sand p-4 text-sm">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-black/20"
                checked={form.isAdultConfirmed}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    isAdultConfirmed: event.target.checked
                  }))
                }
              />
              <span>I confirm that I am 18 years or older and I understand this platform is for companionship and social interaction only.</span>
            </label>

            {status.error ? <p className="text-sm text-rosewood">{status.error}</p> : null}

            <Button type="submit" className="w-full" disabled={status.loading}>
              {status.loading ? "Creating account..." : "Continue"}
            </Button>
          </form>

          <p className="mt-6 text-sm text-black/60">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-rosewood">
              Log in
            </Link>
          </p>
        </SectionCard>
      </div>
    </AppShell>
  );
}
