"use client";

import { useSearchParams } from "next/navigation";
import { TrackPanel } from "@/components/track/TrackPanel";

export function TrackPageClient() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  return <TrackPanel variant="page" initialQuery={initialQuery} />;
}
