"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { notFound, useParams } from "next/navigation";
import { useCartStore } from "../../../providers/cart-store-provider";
import AddToCartButton from "../../../components/AddToCart";
import QuantitySelector from "../../../components/QuantitySelector";
import ColorSector from "../../../components/ColorSector";
import SizeSelector from "../../../components/SizeSelector";
import StarRating from "../../../components/StarRating";
import ReviewCard from "../../../components/ReviewCard";
import ReviewForm from "../../../components/ReviewForm";
import WishlistButton from "../../../components/WishlistButton";
import StockBadge from "../../../components/StockBadge";
import { IProduct } from "../../../types/product";
import { reviewApi } from "../../../lib/api-client";
import toast from "react-hot-toast";

const PRODUCT_SERVICE_URL = process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL || "http://localhost:8000";

interface ProductWithInventory extends IProduct {
  inventory?: { quantity: number } | null;
  reviews?: Array<{
    id: string;
    rating: number;
    title: string | null;
    content: string | null;
    photos: string[];
    helpfulVotes: number;
    createdAt: string;
    user: { firstName: string | null; lastName: string | null };
    orderId: string | null;
  }>;
}

const ProductDetails: React.FC = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<ProductWithInventory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const { products: cartItems } = useCartStore((selector) => selector);
  const [quantity, setQuantity] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviews, setReviews] = useState<Array<{
    id: string;
    rating: number;
    title: string | null;
    content: string | null;
    photos: string[];
    helpfulVotes: number;
    createdAt: string;
    user: { firstName: string | null; lastName: string | null };
    orderId: string | null;
  }>>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  const cartItem = cartItems.find(
    (item) =>
      item.id === product?.id &&
      item.size === selectedSize &&
      item.color === selectedColor,
  );

  useEffect(() => {
    if (cartItem && quantity !== cartItem.quantity) {
      setQuantity(cartItem.quantity);
    }
  }, [cartItem]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${PRODUCT_SERVICE_URL}/products/${id}`, {
          credentials: "include",
        });
        if (!res.ok) {
          if (res.status === 404) {
            notFound();
            return;
          }
          throw new Error("Failed to fetch product");
        }
        const data: ProductWithInventory = await res.json();
        setProduct(data);
        setSelectedSize(data.sizes[0] ?? "");
        setSelectedColor(data.colors[0] ?? "");
        setReviews(data.reviews ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  const handleVoteReview = async (reviewId: string, helpful: boolean) => {
    try {
      await reviewApi.voteReview(reviewId, helpful);
      setReviews((prev) =>
        prev.map((r) =>
          r.id === reviewId ? { ...r, helpfulVotes: r.helpfulVotes + 1 } : r,
        ),
      );
      toast.success("Vote recorded");
    } catch {
      toast.error("Failed to vote");
    }
  };

  if (loading) {
    return (
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
        <div className="animate-pulse bg-gray-200 aspect-320/430" />
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
          <div className="h-10 bg-gray-200 rounded w-1/4" />
        </div>
      </section>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-10 text-red-500">
        <p>{error || "Product not found"}</p>
      </div>
    );
  }

  const imageUrl = product.images[selectedColor] || Object.values(product.images)[0];
  const stockQty = product.inventory?.quantity;

  return (
    <>
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
        {/* image section */}
        <div className="relative w-full aspect-320/430 overflow-hidden bg-gray-100">
          <Image
            src={imageUrl as string}
            alt={product.name}
            fill
            className="object-cover"
          />
          <div className="absolute top-4 right-4">
            <WishlistButton productId={product.id} size={selectedSize} color={selectedColor} />
          </div>
        </div>
        {/* description section */}
        <div>
          <div className="flex items-start justify-between">
            <h2 className="text-2xl font-semibold">{product.name}</h2>
            <StockBadge quantity={stockQty} />
          </div>
          {/* Rating */}
          <div className="flex items-center gap-2 mt-2">
            <StarRating rating={product.rating ?? 0} />
            <span className="text-sm text-gray-500">
              ({product.reviewCount ?? 0} reviews)
            </span>
          </div>
          <p className="mt-4 text-sm text-gray-500">{product.description}</p>
          <h3 className="mt-4 text-2xl font-bold">${product.price.toFixed(2)}</h3>
          {/* sizes */}
          <SizeSelector
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            sizes={product.sizes}
          />
          {/* colors */}
          <ColorSector
            colors={product.colors}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
          />
          {/* quantity */}
          <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
          {/* add to cart button */}
          <AddToCartButton
            product={{
              id: product.id,
              name: product.name,
              shortDescription: product.shortDescription,
              description: product.description,
              price: product.price,
              size: selectedSize,
              color: selectedColor,
              image: imageUrl as string,
              quantity,
            }}
          />
        </div>
      </section>

      {/* Reviews Section */}
      <section className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Customer Reviews</h3>
          <button
            onClick={() => setShowReviewForm(true)}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            Write a Review
          </button>
        </div>

        {showReviewForm && (
          <div className="bg-gray-50 rounded-lg mb-6">
            <ReviewForm
              productId={product.id}
              onSuccess={() => {
                setShowReviewForm(false);
                // Refresh reviews
                reviewApi.getReviews({ productId: product.id, size: 5 }).then((data) => {
                  setReviews(data.items || []);
                });
              }}
              onClose={() => setShowReviewForm(false)}
            />
          </div>
        )}

        {reviews.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
        ) : (
          <div>
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onVote={handleVoteReview}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default ProductDetails;