import { useState } from 'react';
import { Star, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

const ReviewForm = ({ productId }: { productId: string }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState('');
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || !name.trim() || !text.trim()) {
      toast({ title: 'Please fill all fields', description: 'Rating, name, and review text are required.', variant: 'destructive' });
      return;
    }
    toast({ title: 'Review Submitted!', description: 'Your review is being analyzed by our AI system. Thank you!' });
    setRating(0); setName(''); setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="stat-card space-y-4">
      <h3 className="font-semibold text-foreground text-lg">Write a Review</h3>
      <div className="space-y-1">
        <label className="text-sm text-muted-foreground">Your Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map(s => (
            <button key={s} type="button" onClick={() => setRating(s)} onMouseEnter={() => setHoverRating(s)} onMouseLeave={() => setHoverRating(0)}>
              <Star className={`h-7 w-7 transition-colors ${s <= (hoverRating || rating) ? 'fill-warning text-warning' : 'text-border'}`} />
            </button>
          ))}
        </div>
      </div>
      <Input placeholder="Your name" value={name} onChange={e => setName(e.target.value)} className="bg-secondary/50" />
      <Textarea placeholder="Share your experience with this product..." value={text} onChange={e => setText(e.target.value)} rows={4} className="bg-secondary/50" />
      <Button type="submit" className="w-full gap-2">
        <Send className="h-4 w-4" /> Submit Review
      </Button>
    </form>
  );
};

export default ReviewForm;
