"use client";

import { Spinner } from "@/components/Spinner";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/70 z-50 backdrop-blur-sm">
      <Spinner />
    </div>
  );
}
