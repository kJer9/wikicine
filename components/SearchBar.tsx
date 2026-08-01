"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar({ className = "" }: { className?: string }) {
  const router = useRouter();
  const [value, setValue] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    router.push(`/search?q=${encodeURIComponent(value.trim())}`);
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Chercher un film, un réalisateur…"
        className="w-full rounded-full border border-rail bg-surface px-4 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-corail"
        aria-label="Rechercher sur WikiCiné"
      />
    </form>
  );
}
