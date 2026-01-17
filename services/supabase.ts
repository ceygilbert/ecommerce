
import { createClient } from '@supabase/supabase-js';

// Access environment variables. 
// Note: In this environment, assume SUPABASE_URL and SUPABASE_ANON_KEY are available in process.env.
const supabaseUrl = process.env.SUPABASE_URL || 'https://hxfftpvzumcvtnzbpegb.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4ZmZ0cHZ6dW1jdnRuemJwZWdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1NzA0NTUsImV4cCI6MjA4NDE0NjQ1NX0.Fgn2rbrtdkUv8i6IWqnS5WxUeTIiRtwVy8MFmPFzPHg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Fallback Mock Data in case tables aren't set up yet
export const mockDb = {
  categories: [
    { id: '1', name: 'Laptops', slug: 'laptops' },
    { id: '2', name: 'Desktop PCs', slug: 'desktops' },
    { id: '3', name: 'Components', slug: 'components' },
    { id: '4', name: 'Accessories', slug: 'accessories' },
  ],
  brands: [
    { id: '1', name: 'ASUS' },
    { id: '2', name: 'MSI' },
    { id: '3', name: 'Razer' },
    { id: '4', name: 'Corsair' },
  ],
  products: [
    { 
      id: '1', 
      name: 'ROG Strix G16 (Mock)', 
      price: 1299.99, 
      stock: 12, 
      category_id: '1', 
      brand_id: '1', 
      image_url: 'https://picsum.photos/400/300?laptop',
      description: 'High performance gaming laptop.'
    }
  ]
};
