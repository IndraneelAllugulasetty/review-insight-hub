import { ShoppingBag, Search, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const CustomerNavbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <ShoppingBag className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-foreground">MarketPulse</span>
        </Link>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center bg-secondary rounded-lg px-3 py-2 gap-2 w-72">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input type="text" placeholder="Search products..." className="bg-transparent text-sm outline-none w-full text-foreground placeholder:text-muted-foreground" />
          </div>
          <Link to="/admin" className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors px-3 py-2 rounded-lg hover:bg-secondary">
            <User className="h-4 w-4" />
            Admin Panel
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default CustomerNavbar;
