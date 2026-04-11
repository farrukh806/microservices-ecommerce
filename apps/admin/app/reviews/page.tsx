"use client";
import React, { useEffect, useState } from "react";
import { Flag } from "lucide-react";
import toast from "react-hot-toast";
import { ORDER_SERVICE_URL } from "@/lib/config";

interface Review {
  id: string;
  rating: number;
  title: string | null;
  content: string | null;
  photos: string[];
  helpfulVotes: number;
  createdAt: string;
  productId: string;
  user: { firstName: string | null; lastName: string | null };
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchReviews();
  }, [page]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${ORDER_SERVICE_URL}/reviews?page=${page}&size=20`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setReviews(data.items || []);
        setTotalPages(data.totalPages || 1);
      }
    } catch {
      toast.error("Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  };

  if (loading && reviews.length === 0) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Review Moderation</h1>

      {reviews.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg shadow">
          <Flag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No reviews to moderate</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Review</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Helpful</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reviews.map((review) => (
                  <tr key={review.id}>
                    <td className="px-6 py-4 text-sm">{review.productId.slice(0, 8)}...</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} className={star <= review.rating ? "text-amber-400" : "text-gray-300"}>
                            ★
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      {review.title && <p className="font-medium text-sm">{review.title}</p>}
                      {review.content && <p className="text-sm text-gray-600 truncate">{review.content}</p>}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {[review.user.firstName, review.user.lastName].filter(Boolean).join(" ") || "Anonymous"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{review.helpfulVotes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2">Page {page} of {totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}