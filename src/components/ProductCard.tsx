import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Tables } from '@/integrations/supabase/types';

type Product = Tables<'products'>;

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Link to={`/product/${product.id}`} className="stat-card group cursor-pointer">
      <div className="text-5xl mb-4 text-center py-6 bg-secondary/50 rounded-lg group-hover:scale-105 transition-transform">
        {product.image}
      </div>
      <div className="space-y-2">
        <p className="text-xs font-medium text-primary">{product.category}</p>
        <h3 className="font-semibold text-foreground leading-tight">{product.name}</h3>
        <p className="text-xs text-muted-foreground">by {product.seller}</p>
        <div className="flex items-center justify-between pt-1">
          <span className="text-lg font-bold text-foreground">${product.price}</span>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-warning text-warning" />
            <span className="text-sm font-medium text-foreground">{product.rating}</span>
            <span className="text-xs text-muted-foreground">({product.review_count})</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
