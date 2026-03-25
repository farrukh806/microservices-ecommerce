import { Prisma, prisma } from "@repo/product-db";
import { productSchema } from "@repo/shared-schemas";
import type { Request, Response } from "express";

export const productController = {
  async createProduct(req: Request, res: Response) {
    const data = productSchema.createProduct.parse(req.body);
    // save data to db
    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        shortDescription: data.shortDescription,
        price: data.price,
        sizes: data.size,
        colors: data.colors,
        images: data.images,
        category: { connect: { slug: data.categorySlug } },
      } satisfies Prisma.ProductCreateInput,
    });

    res.status(201).json(product);
  },
};
