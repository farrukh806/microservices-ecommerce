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

  async searchProducts(req: Request, res: Response) {
    const {
      q,
      page,
      size,
      category,
      minPrice,
      maxPrice,
      sizes,
      colors,
      minRating,
      sortBy,
      inStock,
    } = productSchema.search.parse(req.body);

    // Build base where clause
    const where: Prisma.ProductWhereInput = {};

    // Full-text search
    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { shortDescription: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ];
    }

    // Category filter
    if (category) {
      where.categorySlug = category;
    }

    // Price range
    if (minPrice != null || maxPrice != null) {
      where.price = {
        ...(minPrice != null ? { gte: minPrice } : {}),
        ...(maxPrice != null ? { lte: maxPrice } : {}),
      };
    }

    // Rating filter
    if (minRating != null) {
      where.rating = { gte: minRating };
    }

    // Sizes filter (array contains any)
    if (sizes) {
      const sizeArray = sizes.split(",").map((s) => s.trim()).filter(Boolean);
      if (sizeArray.length > 0) {
        where.sizes = { hasSome: sizeArray };
      }
    }

    // Colors filter (array contains any)
    if (colors) {
      const colorArray = colors.split(",").map((c) => c.trim()).filter(Boolean);
      if (colorArray.length > 0) {
        where.colors = { hasSome: colorArray };
      }
    }

    // In stock filter (check ProductInventory)
    if (inStock === "true") {
      where.inventory = {
        quantity: { gt: 0 },
      };
    }

    // Sorting
    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
    if (sortBy === "price_asc") orderBy = { price: "asc" };
    else if (sortBy === "price_desc") orderBy = { price: "desc" };
    else if (sortBy === "rating") orderBy = { rating: "desc" };
    else if (sortBy === "newest") orderBy = { createdAt: "desc" };

    // Fetch products with pagination
    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        skip: (page - 1) * size,
        take: size,
        orderBy,
        include: { inventory: true, category: true },
      }),
    ]);

    // Calculate facets (aggregations)
    const [categoryFacets, sizeFacets, colorFacets, priceRange] = await Promise.all([
      // Category counts
      prisma.product.groupBy({
        by: ["categorySlug"],
        where,
        _count: { id: true },
      }),
      // Sizes - count products with each size
      prisma.product.findMany({
        where,
        select: { sizes: true },
      }),
      // Colors - count products with each color
      prisma.product.findMany({
        where,
        select: { colors: true },
      }),
      // Price range
      prisma.product.aggregate({
        where,
        _min: { price: true },
        _max: { price: true },
      }),
    ]);

    // Get category names for facets
    const categorySlugs = categoryFacets.map((f) => f.categorySlug);
    const categories = await prisma.category.findMany({
      where: { slug: { in: categorySlugs } },
      select: { slug: true, name: true },
    });
    const categoryMap = new Map(categories.map((c) => [c.slug, c.name]));

    // Aggregate size counts
    const sizeCountMap = new Map<string, number>();
    for (const p of products) {
      for (const s of p.sizes) {
        sizeCountMap.set(s, (sizeCountMap.get(s) || 0) + 1);
      }
    }

    // Aggregate color counts
    const colorCountMap = new Map<string, number>();
    for (const p of products) {
      for (const c of p.colors) {
        colorCountMap.set(c, (colorCountMap.get(c) || 0) + 1);
      }
    }

    const facets = {
      categories: categoryFacets.map((f) => ({
        slug: f.categorySlug,
        name: categoryMap.get(f.categorySlug) || f.categorySlug,
        count: f._count.id,
      })),
      sizes: Array.from(sizeCountMap.entries()).map(([value, count]) => ({
        value,
        count,
      })),
      colors: Array.from(colorCountMap.entries()).map(([value, count]) => ({
        value,
        count,
      })),
      priceRange: {
        min: priceRange._min.price || 0,
        max: priceRange._max.price || 0,
      },
    };

    res.json({
      items: products,
      facets,
      pagination: {
        page,
        pageSize: size,
        total,
        totalPages: Math.ceil(total / size),
      },
    });
  },

  async autocomplete(req: Request, res: Response) {
    const { q, limit } = productSchema.autocomplete.parse(req.query);

    const products = await prisma.product.findMany({
      where: {
        name: { contains: q, mode: "insensitive" },
      },
      select: {
        id: true,
        name: true,
        price: true,
        images: true,
      },
      take: limit,
      orderBy: { rating: "desc" },
    });

    res.json(
      products.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        image: Object.values(p.images as Record<string, string>)[0] || null,
      })),
    );
  },

  async getLowStock(req: Request, res: Response) {
    const lowStockItems = await prisma.productInventory.findMany({
      where: {
        OR: [
          { quantity: { gt: 0 }, lowStockAlert: true },
          { quantity: { lte: 5 }, quantity: { gt: 0 } },
        ],
      },
      include: { product: true },
      orderBy: { quantity: "asc" },
      take: 20,
    });

    res.json(lowStockItems);
  },

  async getAllInventory(req: Request, res: Response) {
    const { page = "1", size = "50" } = req.query;
    const pageNum = parseInt(page as string) || 1;
    const sizeNum = parseInt(size as string) || 50;

    // Get all products with inventory (left join to include products without inventory records)
    const [total, items] = await Promise.all([
      prisma.product.count(),
      prisma.product.findMany({
        include: {
          inventory: true,
          category: true,
        },
        skip: (pageNum - 1) * sizeNum,
        take: sizeNum,
        orderBy: { name: "asc" },
      }),
    ]);

    // Map to match expected structure (use product id as id for edit compatibility)
    const inventoryItems = items.map((p) => ({
      id: p.inventory?.id || p.id,
      quantity: p.inventory?.quantity ?? 0,
      reservedQty: p.inventory?.reservedQty ?? 0,
      lowStockAlert: p.inventory?.lowStockAlert ?? false,
      backInStockEnabled: p.inventory?.backInStockEnabled ?? false,
      product: {
        id: p.id,
        name: p.name,
        price: p.price,
      },
    }));

    res.json({
      items: inventoryItems,
      page: pageNum,
      pageSize: sizeNum,
      total,
      totalPages: Math.ceil(total / sizeNum),
    });
  },

  async getProductById(req: Request, res: Response) {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        inventory: true,
        reviews: {
          take: 5,
          orderBy: { createdAt: "desc" },
          include: { user: { select: { firstName: true, lastName: true } } },
        },
      },
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

  async updateInventory(req: Request, res: Response) {
    const { id } = req.params;
    const { quantity, lowStockAlert, backInStockEnabled } = req.body;

    // Get current inventory to check if coming back in stock
    const current = await prisma.productInventory.findUnique({
      where: { productId: id },
    });

    const wasOutOfStock = current && current.quantity === 0;

    const inventory = await prisma.productInventory.upsert({
      where: { productId: id },
      create: { productId: id, quantity, lowStockAlert: lowStockAlert ?? false, backInStockEnabled: backInStockEnabled ?? false },
      update: {
        ...(quantity !== undefined ? { quantity } : {}),
        ...(lowStockAlert !== undefined ? { lowStockAlert } : {}),
        ...(backInStockEnabled !== undefined ? { backInStockEnabled } : {}),
      },
    });

    // If stock went from 0 to > 0, trigger back-in-stock notifications
    // This would be handled by the email service webhook call
    const isNowInStock = inventory.quantity > 0;

    res.json({
      ...inventory,
      backInStockTriggered: wasOutOfStock && isNowInStock,
    });
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