export type IProduct = {
  id: string;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  sizes: string[];
  colors: string[];
  images: Record<string, string>;
  category: string[];
};

export type ICartItem = Omit<
  IProduct,
  "sizes" | "colors" | "images" | "category"
> & {
  size: string;
  color: string;
  image: string;
  quantity: number
};
