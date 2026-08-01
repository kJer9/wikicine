import { createClient } from "@/lib/supabase/server";
import RoleSelect from "@/components/admin/RoleSelect";

export const metadata = { title: "Admin · Utilisateurs" };

export default async function AdminUsersPage() {
  const supabase = createClient();
  const { data: users } = await supabase
    .from("profiles")
    .select("id, username, display_name, role, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h2 className="mb-6 font-display text-2xl tracking-poster text-ink">
        Utilisateurs ({users?.length ?? 0})
      </h2>
      <div className="overflow-hidden rounded-lg border border-rail">
        <table className="w-full text-left text-sm">
          <thead className="bg-elevated text-ink-muted">
            <tr>
              <th className="p-3">Utilisateur</th>
              <th className="p-3">Inscrit le</th>
              <th className="p-3">Rôle</th>
            </tr>
          </thead>
          <tbody>
            {(users ?? []).map((u) => (
              <tr key={u.id} className="border-t border-rail">
                <td className="p-3 text-ink">{u.display_name ?? u.username} <span className="text-ink-muted">@{u.username}</span></td>
                <td className="p-3 font-mono text-ink-muted">{new Date(u.created_at).toLocaleDateString("fr-FR")}</td>
                <td className="p-3"><RoleSelect userId={u.id} currentRole={u.role} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
