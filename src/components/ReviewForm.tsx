import { useState } from 'react';
import { Star, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const ReviewForm = ({ productId, onReviewSubmitted }: { productId: string; onReviewSubmitted?: () => void }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || !name.trim() || !text.trim()) {
      toast({ title: 'Please fill all fields', description: 'Rating, name, and review text are required.', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    try {
      // Insert the review into the database
      const { data: review, error: insertError } = await supabase
        .from('reviews')
        .insert({
          product_id: productId,
          customer_name: name.trim(),
          rating,
          text: text.trim(),
        })
        .select()
        .single();

      if (insertError) throw insertError;

      toast({ title: 'Review Submitted!', description: 'Your review is being analyzed by our AI system...' });
      setRating(0); setName(''); setText('');
      onReviewSubmitted?.();

      // Trigger AI analysis in the background
      supabase.functions.invoke('analyze-review', {
        body: {
          reviewId: review.id,
          reviewText: review.text,
          rating: review.rating,
          customerName: review.customer_name,
          productId: review.product_id,
        },
      }).then(() => {
        // Refresh reviews after AI analysis completes
        onReviewSubmitted?.();
      }).catch((err) => {
        console.error('AI analysis failed:', err);
      });
    } catch (error: any) {
      console.error('Submit error:', error);
      toast({ title: 'Error', description: error.message || 'Failed to submit review.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
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
      <Input placeholder="Your name" value={name} onChange={e => setName(e.target.value)} className="bg-secondary/50" disabled={isSubmitting} />
      <Textarea placeholder="Share your experience with this product..." value={text} onChange={e => setText(e.target.value)} rows={4} className="bg-secondary/50" disabled={isSubmitting} />
      <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </Button>
    </form>
  );
};

export default ReviewForm;
