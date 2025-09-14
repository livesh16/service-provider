"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import Link from "next/link";

type Category = {
  id: string;
  name: string;
  icon: string,
};

export default function CategoriesBrowser() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    setIsLoading(true);

    let queryBuilder = supabase.from("categories").select("id, name, icon");

    if (searchQuery) {
      queryBuilder = queryBuilder.ilike("name", `%${searchQuery}%`);
    }

    const { data } = await queryBuilder;
    setCategories(data || []);
    setIsLoading(false);
  };

  // Fetch all categories initially
  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <>
      {/* Search */}
      <div className="max-w-3xl mx-auto flex flex-col md:flex-row gap-4 mb-12">
        <input
          type="text"
          placeholder="Search categories..."
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

      {/* Category results */}
      {isLoading ? (
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="p-6 bg-gray-200 rounded-2xl animate-pulse h-32"
            ></div>
          ))}
        </div>
      ) : (
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/services?category=${category.id}`}
              className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition"
            >
              <div className="w-16 h-16 mb-4">
                <Image
                  src={category.icon || "/default-category-icon.png"}
                  alt={category.name}
                  width={64}
                  height={64}
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
