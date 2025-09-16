"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useSession, signIn } from "next-auth/react";
import { FaSpinner } from "react-icons/fa";
import StarRating from "./StarRating";

interface Review {
  id: string;
  user_id: string;
  user_name?: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface Props {
  providerId: string;
  initialReviews: Review[];
}

export default function ProviderReviews({ providerId, initialReviews}: Props) {
  const { data: session, status } = useSession();
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchingReviews, setFetchingReviews] = useState(false);

  // Fetch reviews for provider
  const fetchReviews = async () => {
    setFetchingReviews(true);
    const { data, error } = await supabase
      .from("reviews")
      .select("id, provider_id, user_id, user_name, rating, comment, created_at")
      .eq("provider_id", providerId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      setError("Failed to fetch reviews.");
    } else {
      setReviews(data || []);
    }
    setFetchingReviews(false);
  };

  // Handle new review submission
  const handleSubmit = async () => {
    if (!session) {
      setError("You must be logged in to leave a review.");
      return;
    }
    if (rating < 1 || rating > 5) {
      setError("Rating must be between 1 and 5.");
      return;
    }

    setLoading(true);
    setError(null);

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ providerId, rating, comment }),
    });

    const result = await res.json();
    if (!res.ok) {
      console.error(result.error);
      setError(result.error || "Failed to submit review.");
    } else {
      setRating(5);
      setComment("");
      fetchReviews(); // refresh the list
    }

    setLoading(false);
  };

  return (
    <section className="w-full max-w-5xl mt-12 bg-white rounded-2xl p-8 shadow">
      <h2 className="text-3xl font-bold mb-6 text-gray-900 border-b pb-4">
        Reviews
      </h2>

      {/* Reviews List */}
      {fetchingReviews ? (
        <div className="flex justify-center items-center py-12">
          <FaSpinner className="animate-spin text-gray-500 text-3xl" />
        </div>
      ) : reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="p-4 border rounded-lg bg-gray-50 flex flex-col gap-1"
            >
              <div className="flex justify-between items-center">
                <p className="font-semibold">{r.user_name || "Anonymous"}</p>
                <p className="text-yellow-500 font-semibold">⭐ {r.rating}</p>
              </div>
              {r.comment && <p className="text-gray-700">{r.comment}</p>}
              <p className="text-gray-400 text-sm">
                {new Date(r.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No reviews yet.</p>
      )}

      {/* Review Form or Login Button */}
      <div className="mt-8">
        {status === "loading" ? (
          <div className="flex justify-center">
            <FaSpinner className="animate-spin text-gray-500 text-2xl" />
          </div>
        ) : session ? (
          <>
            <h3 className="text-xl font-semibold mb-2">Leave a review</h3>
            <div className="flex flex-col mb-2">
              <label className="mb-1 font-medium">Rating:</label>
              <StarRating rating={rating} setRating={setRating} />
            </div>

            <textarea
              placeholder="Write a comment (optional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border rounded p-2 mb-2"
            />
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              {loading ? "Submitting..." : "Submit Review"}
            </button>
          </>
        ) : (
          <button
            onClick={() => signIn("google")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Login to leave a review
          </button>
        )}
      </div>
    </section>
  );
}
