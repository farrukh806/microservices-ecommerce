"use client";

import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { PRODUCT_SERVICE_URL } from "@/lib/config";

interface Product {
  id: string;
  name: string;
  shortDescription: string;
  price: number;
  sizes: string[];
  colors: string[];
  images: Record<string, string>;
  categorySlug: string;
  createdAt: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${PRODUCT_SERVICE_URL}/products?size=100`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setProducts(data.items || []);
      }
    } catch {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`${PRODUCT_SERVICE_URL}/products/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id));
        toast.success("Product deleted");
      } else {
        toast.error("Failed to delete product");
      }
    } catch {
      toast.error("Failed to delete product");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {showForm && <ProductForm onClose={() => setShowForm(false)} onSuccess={fetchProducts} />}

      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sizes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Colors</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4">
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-gray-500">{product.shortDescription}</div>
                  </td>
                  <td className="px-6 py-4 text-sm">{product.categorySlug}</td>
                  <td className="px-6 py-4 text-sm">${product.price.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm">{product.sizes.join(", ")}</td>
                  <td className="px-6 py-4 text-sm">{product.colors.join(", ")}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 hover:bg-red-50 text-red-500 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <div className="text-center py-10 text-gray-500">No products found</div>
          )}
        </div>
      )}
    </div>
  );
}

function ProductForm({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    name: "",
    shortDescription: "",
    description: "",
    price: "",
    sizes: "",
    colors: "",
    categorySlug: "",
    images: {} as Record<string, string>,
  });
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [imageColorMap, setImageColorMap] = useState<Record<string, string>>({});

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setUploading(true);
    try {
      const formDataUpload = new FormData();
      Array.from(e.target.files).forEach((file) => formDataUpload.append("images", file));
      const res = await fetch(`${PRODUCT_SERVICE_URL}/products/upload`, {
        method: "POST",
        body: formDataUpload,
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Upload failed");
      }
      const { urls } = await res.json();
      setUploadedUrls((prev) => [...prev, ...(urls || [])]);
      // Auto-map new images to colors if not already mapped
      const colors = formData.colors.split(",").map((c) => c.trim()).filter(Boolean);
      const newMap = { ...imageColorMap };
      (urls || []).forEach((url: string, idx: number) => {
        const colorIdx = uploadedUrls.length + idx;
        const color = colors[colorIdx];
        if (color && !newMap[color]) {
          newMap[color] = url;
        }
      });
      setImageColorMap(newMap);
      toast.success("Images uploaded");
    } catch (err) {
      const errorMessage = (err as Record<string, unknown>)?.message || "Failed to upload images";
      toast.error(errorMessage as string);
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = "";
    }
  };

  const handleColorImageChange = (color: string, imageUrl: string) => {
    setImageColorMap((prev) => ({ ...prev, [color]: imageUrl }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const colors = formData.colors.split(",").map((c) => c.trim()).filter(Boolean);

      if (uploadedUrls.length === 0) {
        toast.error("Please upload at least one image");
        return;
      }

      // Validate all colors have an image
      const missingColors = colors.filter((color) => !imageColorMap[color]);
      if (missingColors.length > 0) {
        toast.error(`Please assign images to these colors: ${missingColors.join(", ")}`);
        return;
      }

      const payload = {
        name: formData.name,
        shortDescription: formData.shortDescription,
        description: formData.description,
        price: parseFloat(formData.price),
        sizes: formData.sizes.split(",").map((s) => s.trim()).filter(Boolean),
        colors,
        categorySlug: formData.categorySlug,
        images: imageColorMap,
      };

      const res = await fetch(`${PRODUCT_SERVICE_URL}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("Product created");
        onSuccess();
        onClose();
      } else {
        toast.error("Failed to create product");
      }
    } catch {
      toast.error("Failed to create product");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Add Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border rounded-md px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Short Description</label>
            <input
              type="text"
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              className="w-full border rounded-md px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border rounded-md px-3 py-2"
              rows={3}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Price</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full border rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category Slug</label>
              <input
                type="text"
                value={formData.categorySlug}
                onChange={(e) => setFormData({ ...formData, categorySlug: e.target.value })}
                className="w-full border rounded-md px-3 py-2"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Sizes (comma-separated)</label>
            <input
              type="text"
              placeholder="s, m, l, xl"
              value={formData.sizes}
              onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
              className="w-full border rounded-md px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Colors (comma-separated)</label>
            <input
              type="text"
              placeholder="gray, green, purple"
              value={formData.colors}
              onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
              className="w-full border rounded-md px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Images</label>
            <div className="border border-dashed rounded-lg p-4 bg-gray-50">
              <div className="flex flex-col gap-3">
                <div>
                  <p className="text-sm font-medium">Upload Images</p>
                  <p className="text-xs text-gray-500">
                    Upload images to get their URLs, then map them to colors below
                  </p>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleUpload}
                  disabled={uploading}
                  className="text-sm file:px-3 file:py-1 file:rounded file:border-0 file:text-xs file:font-medium file:bg-gray-200 file:text-gray-900 hover:file:bg-gray-300 cursor-pointer"
                />
                {uploading && (
                  <p className="text-xs text-blue-600 font-medium">Uploading...</p>
                )}
                {uploadedUrls.length > 0 && (
                  <div className="flex flex-col gap-2 mt-2 pt-2 border-t">
                    <p className="text-xs font-semibold">Map Images to Colors:</p>
                    {formData.colors.split(",").map((c) => c.trim()).filter(Boolean).map((color) => (
                      <div key={color} className="flex items-center gap-2">
                        <span className="text-xs font-medium w-20 truncate" title={color}>{color}</span>
                        <select
                          value={imageColorMap[color] || ""}
                          onChange={(e) => handleColorImageChange(color, e.target.value)}
                          className="text-xs border rounded px-2 py-1 flex-1"
                        >
                          <option value="">Select image...</option>
                          {uploadedUrls.map((url, i) => (
                            <option key={i} value={url}>
                              Image {i + 1} ({url.slice(0, 30)}...)
                            </option>
                          ))}
                        </select>
                        {imageColorMap[color] && (
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(imageColorMap[color]!);
                              toast.success("Copied!");
                            }}
                            className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded shrink-0"
                          >
                            Copy
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50"
            >
              {submitting ? "Creating..." : "Create Product"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
