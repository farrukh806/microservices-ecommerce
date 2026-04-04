import { Prisma, PrismaClientKnownRequestError, prisma } from "@repo/product-db";
import { productSchema } from "@repo/shared-schemas";
import type { Request, Response } from "express";
import "multer";

export const productController = {
  async uploadImages(req: Request, res: Response) {
    if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
      res.status(400).json({ message: "No images provided" });
      return;
    }

    const files = req.files as Express.Multer.File[];
    const urls = files.map((file) => file.path);

    res.status(200).json({ urls });
  },

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
  },

  async getProductById(req: Request, res: Response) {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    res.json(product);
  },

  async updateProduct(req: Request, res: Response) {
    const { id } = req.params;
    const data = productSchema.updateProduct.parse(req.body);

    try {
      const product = await prisma.product.update({
        where: { id },
        data: {
          ...(data.name !== undefined ? { name: data.name } : {}),
          ...(data.description !== undefined ? { description: data.description } : {}),
          ...(data.shortDescription !== undefined ? { shortDescription: data.shortDescription } : {}),
          ...(data.price !== undefined ? { price: data.price } : {}),
          ...(data.sizes !== undefined ? { sizes: data.sizes } : {}),
          ...(data.colors !== undefined ? { colors: data.colors } : {}),
          ...(data.images !== undefined ? { images: data.images } : {}),
          ...(data.categorySlug !== undefined ? { category: { connect: { slug: data.categorySlug } } } : {}),
        },
      });

      res.json(product);
    } catch (error) {
      if ((error as Prisma.PrismaClientKnownRequestError).code === "P2025") {
        res.status(404).json({ message: "Product not found" });
        return;
      }
      throw error;
    }
  },

  async deleteProduct(req: Request, res: Response) {
    const { id } = req.params;

    try {
      await prisma.product.delete({ where: { id } });
      res.status(204).send();
    } catch (error) {
      if ((error as Prisma.PrismaClientKnownRequestError).code === "P2025") {
        res.status(404).json({ message: "Product not found" });
        return;
      }
      throw error;
    }
  },
};
