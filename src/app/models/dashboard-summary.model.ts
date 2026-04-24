import { Product } from './product.model';

export interface DashboardSummary {
  totalProducts: number;
  totalCategories: number;
  lowStockProductsCount: number;
  lowStockProducts: Product[];
  totalInventoryValue: number;
  productsPerCategory: { [categoryName: string]: number };
}
