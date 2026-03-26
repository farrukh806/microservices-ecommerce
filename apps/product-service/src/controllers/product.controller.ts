import { Prisma, prisma } from "@repo/product-db";
import { productSchema } from "@repo/shared-schemas";
import type { Request, Response } from "express";

export const productController = {
  async createProduct(req: Request, res: Response) {
    const data = productSchema.createProduct.parse(req.body);
    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        shortDescription: data.shortDescription,
        price: data.price,
        sizes: data.sizes,
        colors: data.colors,
        images: data.images,
        category: { connect: { slug: data.categorySlug } },
      } satisfies Prisma.ProductCreateInput,
    });

    res.status(201).json(product);
  },

  async getProducts(req: Request, res: Response) {
    const {
      page,
      size,
      category,
      name,
      minPrice,
      maxPrice,
      sortBy,
      sortOrder,
    } = productSchema.getProductsQuery.parse(
      req.query,
    );

    const whereInput = {
      ...(category ? { categorySlug: category } : {}),
      ...(name ? { name: { contains: name, mode: "insensitive" } } : {}),
      ...(minPrice != null || maxPrice != null
        ? {
            price: {
              ...(minPrice != null ? { gte: minPrice } : {}),
              ...(maxPrice != null ? { lte: maxPrice } : {}),
            },
          }
        : {}),
    } as Prisma.ProductWhereInput;

    const where =
      Object.keys(whereInput).length > 0 ? whereInput : undefined;
    const orderBy = { [sortBy]: sortOrder } as Prisma.ProductOrderByWithRelationInput;

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        skip: (page - 1) * size,
        take: size,
        orderBy,
      }),
    ]);

    res.json({
      items: products,
      page,
      pageSize: size,
      total,
      totalPages: Math.ceil(total / size),
      sortBy,
      sortOrder,
      minPrice,
      maxPrice,
      name,
    });
  }
};
