import { Prisma, prisma } from "@repo/product-db";
import { categorySchema } from "@repo/shared-schemas";
import type { Request, Response } from "express";

export const categoryController = {
  async createCategory(req: Request, res: Response) {
    const data = categorySchema.createCategory.parse(req.body);

    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
      } satisfies Prisma.CategoryCreateInput,
    });

    res.status(201).json(category);
  },
};
