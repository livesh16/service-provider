import { supabase } from "@/lib/supabaseClient";
import ProviderCard from "@/components/ProviderCard";
import Footer from "@/components/Footer";
import Link from "next/link";

export default async function Home() {
  // Change this to "featured" or "topRated"
  const mode = "topRated" as "featured" | "topRated";

  let query = supabase.from("providers").select("*");

  if (mode === "featured") {
    query = query.eq("featured", true);
  } else if (mode === "topRated") {
    query = query.order("rating", { ascending: false }).limit(10); // top 10 by rating
  }

  const { data: providers, error } = await query;

  if (error) {
    console.error("Error fetching providers:", error.message);
  }

  return (
    <>
      {/* Hero Section */}
      <section
        className="relative w-full h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage:
            "url(https://qbjgfnlpmcyxjxopsnvt.supabase.co/storage/v1/object/public/service_provider_hero/service_provider.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute top-0 left-0 w-full h-full bg-black/50"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="hero-text text-5xl md:text-6xl font-extrabold">
            Find Trusted Local Professionals in Mauritius
          </h1>
          <p className="mt-4 text-xl md:text-2xl text-gray-200 drop-shadow-md">
            Plumbers, Electricians, Cleaners, and more — fast, reliable, and
            nearby.
          </p>
          <Link href="/services">
            <button className="btn mt-8">Browse Services</button>
          </Link>
        </div>
      </section>

      {/* Providers Section */}
      <section className="py-20 px-8 bg-[var(--color-bg-light)]">
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
          {mode === "featured" ? "Featured Providers" : "Top-Rated Providers"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {providers?.map((p) => (
            <ProviderCard key={p.id} provider={p} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </>
  );
}
