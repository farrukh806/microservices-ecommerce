import { prisma } from "@repo/product-db";
import type { Request, Response } from "express";

export const userController = {
  async getUsers(req: Request, res: Response) {
    const { page = "1", size = "20", search } = req.query;
    const pageNum = parseInt(page as string, 10);
    const sizeNum = parseInt(size as string, 10);

    const whereInput = search
      ? {
          OR: [
            { email: { contains: search as string, mode: "insensitive" } },
            { firstName: { contains: search as string, mode: "insensitive" } },
            { lastName: { contains: search as string, mode: "insensitive" } },
          ],
        }
      : {};

    const where = Object.keys(whereInput).length > 0 ? whereInput : undefined;

    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip: (pageNum - 1) * sizeNum,
        take: sizeNum,
        orderBy: { createdAt: "desc" },
        include: {
          addresses: true,
          _count: { select: { orders: true } },
        },
      }),
    ]);

    res.json({
      items: users,
      page: pageNum,
      pageSize: sizeNum,
      total,
      totalPages: Math.ceil(total / sizeNum),
    });
  },

  async getUserById(req: Request, res: Response) {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        addresses: true,
        orders: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        _count: { select: { orders: true } },
      },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json(user);
  },

  async updateUser(req: Request, res: Response) {
    const { id } = req.params;
    const { firstName, lastName } = req.body;

    try {
      const user = await prisma.user.update({
        where: { id },
        data: {
          ...(firstName !== undefined && { firstName }),
          ...(lastName !== undefined && { lastName }),
        },
      });
      res.json(user);
    } catch (error) {
      res.status(404).json({ message: "User not found" });
    }
  },

  async deleteUser(req: Request, res: Response) {
    const { id } = req.params;

    try {
      await prisma.user.delete({ where: { id } });
      res.status(204).send();
    } catch (error) {
      res.status(404).json({ message: "User not found" });
    }
  },
};