"use client";
import React, { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { productApi } from "../lib/api-client";
import Link from "next/link";
import { type SearchOverlayProps, type SearchResult } from "../types/components";

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (query.length >= 2) {
        setLoading(true);
        try {
          const results = await productApi.autocomplete(query, 5);
          setSuggestions(results);
        } catch {
          setSuggestions([]);
        } finally {
          setLoading(false);
        }
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-20">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-xl overflow-hidden">
        <div className="flex items-center border-b border-gray-200 p-4">
          <Search className="w-5 h-5 text-gray-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="flex-1 text-lg outline-none"
          />
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        {suggestions.length > 0 && (
          <div className="max-h-96 overflow-y-auto">
            {suggestions.map((result) => (
              <Link
                key={result.id}
                href={`/products/${result.id}`}
                onClick={onClose}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 border-b border-gray-100"
              >
                {result.image && (
                  <img src={result.image} alt={result.name} className="w-12 h-12 object-cover rounded" />
                )}
                <div>
                  <p className="font-medium">{result.name}</p>
                  <p className="text-gray-600">${result.price.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
        {query.length >= 2 && !loading && suggestions.length === 0 && (
          <div className="p-8 text-center text-gray-500">No products found for "{query}"</div>
        )}
        {loading && (
          <div className="p-4 text-center text-gray-500">Searching...</div>
        )}
      </div>
    </div>
  );
}