
export interface Product {
  id: string;
  name: string;
  code: string;
  slug: string;
  price: number;
  description: string;
  image: string;
}

export interface CartItem {
  id: string;
  variantName: string;
  productName: string;
  unitPrice: number;
  total: number;
  quantity: number;
}

export interface Cart {
  tokenValue: string;
  items: CartItem[];
  itemsTotal: number;
  total: number;
  currencyCode: string;
}
