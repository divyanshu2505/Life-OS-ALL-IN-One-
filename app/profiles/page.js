"use client";

import { useEffect, useState } from "react";
import { AppShell } from "../../components/layout/app-shell";
import { EmptyState } from "../../components/ui/empty-state";
import { FilterBar } from "../../components/filter-bar";
import { LoadingState } from "../../components/ui/loading-state";
import { ProviderCard } from "../../components/provider-card";
import { request } from "../../lib/api";

const initialFilters = {
  search: "",
  minPrice: "",
  maxPrice: "",
  rating: "",
  interest: ""
};

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const query = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        query.append(key, value);
      }
    });

    setLoading(true);
    request("get", `/profiles/providers?${query.toString()}`)
      .then((response) => {
        setProfiles(response.profiles);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [filters]);

  return (
    <AppShell>
      <section className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rosewood">Browse companions</p>
        <h1 className="text-4xl font-semibold">Find someone who matches the vibe you want</h1>
        <p className="max-w-3xl text-sm leading-6 text-black/65">
          Filter by price, rating, and interests, then book a safe companionship session with clear boundaries.
        </p>
      </section>

      <FilterBar
        filters={filters}
        onChange={(key, value) => setFilters((current) => ({ ...current, [key]: value }))}
        onReset={() => setFilters(initialFilters)}
      />

      {loading ? (
        <LoadingState label="Loading profiles..." />
      ) : profiles.length ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {profiles.map((profile) => (
            <ProviderCard key={profile._id} profile={profile} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No profiles match these filters"
          description="Try widening your budget or removing one of the interest filters."
        />
      )}
    </AppShell>
  );
}
