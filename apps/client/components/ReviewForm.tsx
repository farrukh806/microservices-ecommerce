"use client";
import React, { useState } from "react";
import StarRating from "./StarRating";
import { reviewApi } from "../lib/api-client";
import toast from "react-hot-toast";

interface ReviewFormProps {
  productId: string;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function ReviewForm({ productId, onSuccess, onClose }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    setLoading(true);
    try {
      await reviewApi.createReview({ productId, rating, title: title || undefined, content: content || undefined });
      toast.success("Review submitted!");
      onSuccess?.();
      onClose?.();
    } catch {
      toast.error("Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Your Rating</label>
        <div className="mt-2">
          <StarRating rating={rating} interactive onChange={setRating} size={24} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Title (optional)</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          placeholder="Summarize your experience"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Review (optional)</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={2000}
          rows={4}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          placeholder="Share your experience with this product"
        />
      </div>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </div>
    </form>
  );
}