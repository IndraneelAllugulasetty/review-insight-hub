import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Store } from 'lucide-react';
import CustomerNavbar from '@/components/CustomerNavbar';
import ReviewForm from '@/components/ReviewForm';
import ReviewCard from '@/components/ReviewCard';
import { products, reviews } from '@/data/mockData';

const ProductDetail = () => {
  const { id } = useParams();
  const product = products.find(p => p.id === id);
  const productReviews = reviews.filter(r => r.productId === id);

  if (!product) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Product not found</div>;

  return (
    <div className="min-h-screen bg-background">
      <CustomerNavbar />
      <main className="container mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Products
        </Link>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="stat-card">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="text-8xl text-center py-10 px-12 bg-secondary/50 rounded-lg">{product.image}</div>
                <div className="space-y-3 flex-1">
                  <p className="text-sm font-medium text-primary">{product.category}</p>
                  <h1 className="text-2xl font-bold text-foreground">{product.name}</h1>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Store className="h-4 w-4" /> {product.seller}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex">{Array.from({length:5}).map((_,i) => <Star key={i} className={`h-5 w-5 ${i < Math.round(product.rating) ? 'fill-warning text-warning' : 'text-border'}`}/>)}</div>
                    <span className="font-semibold text-foreground">{product.rating}</span>
                    <span className="text-muted-foreground text-sm">({product.reviewCount} reviews)</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">${product.price}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">Customer Reviews ({productReviews.length})</h2>
              <div className="space-y-4">
                {productReviews.length ? productReviews.map(r => <ReviewCard key={r.id} review={r} />) : <p className="text-muted-foreground text-sm">No reviews yet. Be the first to review!</p>}
              </div>
            </div>
          </div>
          <div>
            <ReviewForm productId={product.id} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
