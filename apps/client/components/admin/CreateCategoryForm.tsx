"use client";

import React from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { categorySchema } from "@repo/shared-schemas";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  categoryFormValidationSchema,
  type CategoryFormValues,
} from "../../validations";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

type CreateCategoryProps = {
  onSuccess?: (category: { slug: string; name: string }) => void;
  onCancel?: () => void;
};

export default function CreateCategoryForm({ onSuccess, onCancel }: CreateCategoryProps = {}) {
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormValidationSchema),
    defaultValues: { name: "", slug: "" },
  });
  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (values: CategoryFormValues) => {
    try {
      const payload = categorySchema.createCategory.parse(values);

      const res = await fetch(`${API_BASE_URL}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        toast.error(text || "Failed to create category");
        return;
      }

      toast.success("Category created");
      reset();
      if (onSuccess) {
        onSuccess(values);
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        const message = err.issues.map((i) => i.message).join("; ");
        toast.error(message);
      } else {
        const errorMsg = (err as Record<string, unknown>)?.message;
        toast.error(errorMsg ? String(errorMsg) : "An error occurred");
      }
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white border rounded-md p-4 flex flex-col gap-4"
      >
        <h2 className="text-lg font-semibold">Create Category</h2>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="T-Shirts" disabled={isSubmitting} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input placeholder="t-shirts" disabled={isSubmitting} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create"}
        </Button>
      </form>
    </Form>
  );
}

