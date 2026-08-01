"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function RoleSelect({ userId, currentRole }: { userId: string; currentRole: string }) {
  const supabase = createClient();
  const router = useRouter();

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    await supabase.from("profiles").update({ role: e.target.value }).eq("id", userId);
    router.refresh();
  }

  return (
    <select
      defaultValue={currentRole}
      onChange={handleChange}
      className="rounded border border-rail bg-elevated px-2 py-1 text-ink"
    >
      <option value="user">user</option>
      <option value="editor">editor</option>
      <option value="admin">admin</option>
    </select>
  );
}
