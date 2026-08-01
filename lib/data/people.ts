import { createClient } from "@/lib/supabase/server";
import { isMockMode } from "@/lib/config";
import { mockPeople, getMockFilmography } from "@/lib/mock/data";
import type { Person } from "@/types/database";

export async function getPersonBySlug(slug: string) {
  if (isMockMode) {
    const person = mockPeople.find((p) => p.slug === slug);
    if (!person) return null;
    return { person, filmography: getMockFilmography(person.id) };
  }

  const supabase = createClient();

  const { data: person, error } = await supabase
    .from("people")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  if (!person) return null;

  const { data: credits, error: creditsError } = await supabase
    .from("film_credits")
    .select("*, films(*)")
    .eq("person_id", person.id)
    .order("billing_order", { ascending: true });

  if (creditsError) throw creditsError;

  return {
    person: person as Person,
    filmography: (credits ?? []).map((c: any) => ({ ...c, film: c.films })),
  };
}

export async function searchPeople(query: string, limit = 10) {
  if (isMockMode) {
    return mockPeople
      .filter((p) => p.full_name.toLowerCase().includes(query.toLowerCase()))
      .slice(0, limit);
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("people")
    .select("id, slug, full_name, photo_url")
    .ilike("full_name", `%${query}%`)
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as Pick<Person, "id" | "slug" | "full_name" | "photo_url">[];
}
