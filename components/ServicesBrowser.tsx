"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import Link from "next/link";

export default function ServicesBrowser() {
  const [services, setServices] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const searchParams = useSearchParams();

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from("categories").select("id, name");
      setCategories(data || []);
    };
    fetchCategories();
  }, []);

  // Fetch cities (distinct)
  useEffect(() => {
    const fetchCities = async () => {
      const { data, error } = await supabase
        .from("providers")
        .select("city", { distinct: true })
        .not("city", "is", null)
        .order("city", { ascending: true });

      if (error) {
        console.error("Error fetching cities:", error);
        return;
      }

      const cities = data?.map((p) => p.city) || [];
      setCities(cities);
    };

    fetchCities();
  }, []);

  // Run search
  const handleSearch = async (cat?: string, cityParam?: string) => {
    setIsLoading(true);
    setHasSearched(true);

    const catToUse = cat ?? category;
    const cityToUse = cityParam ?? city;

    try {
      // If a city filter is provided -> first fetch provider IDs for that city
      let providerIds: any[] | null = null;
      if (cityToUse) {
        const { data: providers, error: provErr } = await supabase
          .from("providers")
          .select("id")
          .eq("city", cityToUse);

        if (provErr) {
          console.error("Error fetching providers for city:", provErr);
          setServices([]);
          setIsLoading(false);
          return;
        }

        providerIds = (providers || []).map((p: any) => p.id);

        // If no providers in that city, return early with no services
        if (!providerIds.length) {
          setServices([]);
          setIsLoading(false);
          return;
        }
      }

      // Build services query
      let queryBuilder = supabase
        .from("services")
        .select(`
          id,
          name,
          description,
          price_estimate,
          provider:providers(id,name,username,city,image_url,rating),
          category:categories(id,name),
          provider_id
        `);

      // Always exclude services without a provider (so UI doesn't need to filter)
      queryBuilder = queryBuilder.not("provider_id", "is", null);

      // If we have providerIds (city filter), use .in
      if (providerIds) {
        queryBuilder = queryBuilder.in("provider_id", providerIds);
      }

      if (catToUse) {
        queryBuilder = queryBuilder.eq("category_id", catToUse);
      }

      if (searchQuery) {
        // full text search on the name,description columns
        queryBuilder = queryBuilder.textSearch("name,description", searchQuery);
      }

      const { data, error } = await queryBuilder;
      if (error) {
        console.error("Error querying services:", error);
        setServices([]);
      } else {
        setServices(data || []);
      }
    } catch (err) {
      console.error("Unexpected error searching services:", err);
      setServices([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-run search if category or city is in URL (only if at least one exists)
  useEffect(() => {
    const catFromUrl = searchParams.get("category") || "";
    const cityFromUrl = searchParams.get("city") || "";

    if (catFromUrl) setCategory(catFromUrl);
    if (cityFromUrl) setCity(cityFromUrl);

    if (catFromUrl || cityFromUrl) {
      handleSearch(catFromUrl, cityFromUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams?.toString()]);

  return (
    <>
      {/* Search & Filter */}
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-4 mb-12">
        <input
          type="text"
          placeholder="Search services..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
          className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">All Cities</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <button
          onClick={() => handleSearch(category, city)}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          Search
        </button>
      </div>

      {/* Service Results */}
      {isLoading ? (
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="p-6 bg-gray-200 rounded-2xl animate-pulse h-40"
            ></div>
          ))}
        </div>
      ) : (
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {!hasSearched ? null : services.length === 0 ? (
            <div className="col-span-full text-center text-gray-500">
              No services found.
            </div>
          ) : (
            // We no longer need to .filter(s => s.provider) because queries exclude null provider_id
            services.map((service) => (
              <Link
                key={service.id}
                href={`/service-providers/${service.provider.username}`}
                className="block p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition"
              >
                <div className="flex gap-4 items-center">
                  {service.provider?.image_url && (
                    <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 bg-gray-100">
                      <Image
                        src={service.provider.image_url}
                        alt={service.provider.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {service.name}
                    </h3>
                    <p className="text-gray-700">{service.description}</p>
                    <div className="flex gap-3 mt-1 items-center text-gray-500 text-sm">
                      {service.price_estimate && (
                        <span>₹ {service.price_estimate}</span>
                      )}
                      {service.provider?.city && <span>📍 {service.provider.city}</span>}
                      {service.provider?.rating && <span>⭐ {service.provider.rating}</span>}
                      {service.category?.name && (
                        <span className="italic">({service.category.name})</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </>
  );
}
