import ProviderRegistration from "@/components/ProviderRegistration";
import { supabase } from "@/lib/supabaseClient";

export default async function ProviderRegistrationPage() {
  const { data: categories, error } = await supabase
    .from("categories")
    .select("id, name")
    .order("name");

  if (error) {
    console.error(error);
    throw new Error("Failed to load categories");
  }

  return (
    <ProviderRegistration categories={categories ?? []} />
  );
}
