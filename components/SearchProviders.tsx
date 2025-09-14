"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import Link from "next/link";

export default function SearchProviders() {
  const [providers, setProviders] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    setIsLoading(true);

    let queryBuilder = supabase
      .from("providers")
      .select("id, name, username, city, image_url, rating, verified");

    if (searchQuery) {
      queryBuilder = queryBuilder.or(
        `name.ilike.%${searchQuery}%,username.ilike.%${searchQuery}%`
      );
    }

    const { data } = await queryBuilder;
    setProviders(data || []);
    setIsLoading(false);
  };

  return (
    <>
      {/* Search Bar */}
      <div className="max-w-3xl mx-auto flex flex-col md:flex-row gap-4 mb-12">
        <input
          type="text"
          placeholder="Search by name or username..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
          className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleSearch}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          Search
        </button>
      </div>

      {/* Provider Results */}
      {isLoading ? (
        // Skeleton loading
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
          {providers.map((provider) => (
            <Link
              key={provider.id}
              href={`/service-providers/${provider.username}`}
              className="block p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition"
            >
              <div className="flex gap-4 items-center">
                {provider.image_url && (
                  <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 bg-gray-100">
                    <Image
                      src={provider.image_url}
                      alt={provider.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {provider.name}
                  </h3>
                  <p className="text-gray-500">@{provider.username}</p>
                  <div className="flex gap-3 mt-1 items-center text-gray-500 text-sm">
                    {provider.city && <span>📍 {provider.city}</span>}
                    {provider.rating && <span>⭐ {provider.rating}</span>}
                    {provider.verified && (
                      <span className="text-blue-600 font-medium">
                        ✔ Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
