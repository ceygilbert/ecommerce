
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  category_id: string;
}

export interface Brand {
  id: string;
  name: string;
  logo_url?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category_id: string;
  brand_id: string;
  image_url: string;
  is_custom_build: boolean;
  specifications?: Record<string, string>;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
}

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  phone?: string;
  address?: string;
  status: 'active' | 'suspended';
  created_at: string;
}
