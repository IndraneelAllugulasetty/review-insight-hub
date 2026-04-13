import CustomerNavbar from '@/components/CustomerNavbar';
import ProductCard from '@/components/ProductCard';
import { products } from '@/data/mockData';

const Products = () => {
  return (
    <div className="min-h-screen bg-background">
      <CustomerNavbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">MarketPulse Store</h1>
          <p className="text-muted-foreground mt-1">Quality products from verified sellers</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </main>
    </div>
  );
};

export default Products;
