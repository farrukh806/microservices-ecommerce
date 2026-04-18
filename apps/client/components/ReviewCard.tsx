"use client";
import React from "react";
import StarRating from "./StarRating";
import { type ReviewCardProps } from "../types/components";

export default function ReviewCard({ review, onVote }: ReviewCardProps) {
  const userName = [review.user?.firstName, review.user?.lastName].filter(Boolean).join(" ") || "Anonymous";
  const date = new Date(review.createdAt).toLocaleDateString();

  return (
    <div className="border-b border-gray-200 py-4">
      <div className="flex items-start justify-between">
        <div>
          <StarRating rating={review.rating} size={14} />
          <p className="text-sm text-gray-500 mt-1">
            by <span className="font-medium">{userName}</span>
            {review.orderId && (
              <span className="ml-2 text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded">Verified Purchase</span>
            )}
          </p>
        </div>
        <span className="text-xs text-gray-400">{date}</span>
      </div>
      {review.title && (
        <p className="font-medium mt-2">{review.title}</p>
      )}
      {review.content && (
        <p className="text-gray-700 mt-1">{review.content}</p>
      )}
      {review.photos && review.photos.length > 0 && (
        <div className="flex gap-2 mt-2">
          {review.photos.map((photo, i) => (
            <img key={i} src={photo} alt={`Review photo ${i + 1}`} className="w-16 h-16 object-cover rounded" />
          ))}
        </div>
      )}
      <div className="flex items-center gap-4 mt-3">
        <span className="text-xs text-gray-500">{review.helpfulVotes} people found this helpful</span>
        {onVote && (
          <button
            type="button"
            onClick={() => onVote(review.id, true)}
            className="text-xs text-blue-600 hover:underline"
          >
            Helpful
          </button>
        )}
      </div>
    </div>
  );
}