"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { productSchema } from "@repo/shared-schemas";
import CreateCategoryForm from "./CreateCategoryForm";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import {
  productFormValidationSchema,
  type ProductFormValues,
} from "../../validations";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

function parseCommaSeparatedList(text: string): string[] {
  return text
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export default function CreateProductForm() {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormValidationSchema),
    defaultValues: {
      name: "",
      description: "",
      shortDescription: "",
      price: "",
      sizes: [],
      colorsText: "",
      categorySlug: "",
    },
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const [uploading, setUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

  const [categories, setCategories] = useState<{slug: string, name: string}[]>([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/categories`);
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // handleCategoryChange removed since we directly handle onValueChange in Shadcn Select

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setUploading(true);
    try {
      const formData = new FormData();
      Array.from(e.target.files).forEach((file) => formData.append("images", file));
      const res = await fetch(`${API_BASE_URL}/products/upload`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Upload failed");
      }
      const { urls } = await res.json();
      setUploadedUrls((prev) => [...prev, ...(urls || [])]);
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

  const onSubmit = async (values: ProductFormValues) => {
    try {
      if (uploadedUrls.length === 0) {
        toast.error("Please upload at least one image");
        return;
      }

      const transformed = {
        name: values.name.trim(),
        description: values.description,
        shortDescription: values.shortDescription,
        price: Number(values.price),
        sizes: values.sizes,
        colors: parseCommaSeparatedList(values.colorsText),
        images: uploadedUrls.reduce((acc, url, index) => {
          const color = values.colorsText.split(",")[index]?.trim() || `color-${index}`;
          acc[color] = url;
          return acc;
        }, {} as Record<string, string>),
        categorySlug: values.categorySlug.trim(),
      };

      // Validate against the API schema
      const payload = productSchema.createProduct.parse(transformed);

      const res = await fetch(`${API_BASE_URL}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        toast.error(text || "Failed to create product");
        return;
      }

      toast.success("Product created");
      reset();
    } catch (err) {
      if (err instanceof z.ZodError) {
        // These are API schema validation errors, show as toast
        const message = err.issues.map((i) => i.message).join("; ");
        toast.error(message);
      } else {
        const errorMsg = (err as Record<string, unknown>)?.message;
        toast.error(errorMsg ? String(errorMsg) : "An error occurred");
      }
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white border rounded-lg p-6 flex flex-col gap-6"
        >
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-semibold">Create Product</h2>
            <p className="text-sm text-muted-foreground">Add a new product to your catalog</p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground">Basic Information</h3>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Classic T-Shirt" disabled={isSubmitting} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shortDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Description</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Brief description for listings"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Detailed product description"
                        rows={4}
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Product Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground">Product Details</h3>

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        inputMode="decimal"
                        placeholder="39.99"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sizes"
                render={({ field }) => {
                  const allSizes = ["XS", "S", "M", "L", "XL", "XXL"];
                  const selectedSizes = (field.value || []) as string[];

                  const toggleSize = (size: string) => {
                    const updated = selectedSizes.includes(size)
                      ? selectedSizes.filter((s) => s !== size)
                      : [...selectedSizes, size];
                    field.onChange(updated);
                  };

                  return (
                    <FormItem>
                      <FormLabel>Sizes</FormLabel>
                      <FormControl>
                        <div className="flex flex-wrap gap-2">
                          {allSizes.map((size) => (
                            <button
                              key={size}
                              type="button"
                              onClick={() => toggleSize(size)}
                              disabled={isSubmitting}
                              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors border ${
                                selectedSizes.includes(size)
                                  ? "bg-blue-600 text-white border-blue-600"
                                  : "bg-white text-slate-700 border-slate-300 hover:border-slate-400"
                              } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </FormControl>
                      <p className="text-xs text-muted-foreground">Select one or more sizes</p>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="colorsText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Colors (comma separated)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., green, purple, blue"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categorySlug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(val) => {
                        if (val === "CREATE_NEW") {
                          setIsCategoryModalOpen(true);
                          field.onChange("");
                        } else {
                          field.onChange(val);
                        }
                      }}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((c) => (
                          <SelectItem key={c.slug} value={c.slug}>
                            {c.name}
                          </SelectItem>
                        ))}
                        <SelectItem value="CREATE_NEW" className="font-semibold text-blue-600">
                          + Create new category
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Images */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground">Images</h3>

              <div className="border border-dashed rounded-lg p-4 bg-slate-50">
                <div className="flex flex-col gap-3">
                  <div>
                    <p className="text-sm font-medium">Upload Images</p>
                    <p className="text-xs text-muted-foreground">
                      Upload images to get their URLs, then map them to colors below
                    </p>
                  </div>

                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleUpload}
                    disabled={uploading}
                    className="text-sm file:px-3 file:py-1 file:rounded file:border-0 file:text-xs file:font-medium file:bg-slate-200 file:text-slate-900 hover:file:bg-slate-300 cursor-pointer"
                  />

                  {uploading && (
                    <p className="text-xs text-blue-600 font-medium">Uploading to Cloudinary...</p>
                  )}

                  {uploadedUrls.length > 0 && (
                    <div className="flex flex-col gap-2 mt-2 pt-2 border-t">
                      <p className="text-xs font-semibold">Uploaded URLs:</p>
                      {uploadedUrls.map((url, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs">
                          <a
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 underline truncate flex-1 min-w-0"
                          >
                            {url}
                          </a>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              navigator.clipboard.writeText(url);
                              toast.success("Copied!");
                            }}
                            className="h-6 px-2 text-xs shrink-0"
                          >
                            Copy
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting} size="lg" className="mt-4">
            {isSubmitting ? "Creating..." : "Create Product"}
          </Button>
        </form>
      </Form>

      <Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
        <DialogContent showCloseButton={false} className="sm:max-w-md p-0 overflow-hidden bg-transparent border-0 shadow-none ring-0">
          <CreateCategoryForm
            onCancel={() => setIsCategoryModalOpen(false)}
            onSuccess={(cat) => {
              setCategories((prev) => [cat, ...prev]);
              setValue("categorySlug", cat.slug);
              setIsCategoryModalOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

