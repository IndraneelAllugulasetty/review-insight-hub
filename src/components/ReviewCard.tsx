import { Star, AlertTriangle, ThumbsUp, ThumbsDown, Minus, Brain, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Tables } from '@/integrations/supabase/types';

type Review = Tables<'reviews'>;

const sentimentConfig = {
  positive: { icon: ThumbsUp, className: 'bg-success/10 text-success border-success/20' },
  negative: { icon: ThumbsDown, className: 'bg-destructive/10 text-destructive border-destructive/20' },
  neutral: { icon: Minus, className: 'bg-muted text-muted-foreground border-border' },
};

const ReviewCard = ({ review }: { review: Review }) => {
  const sentiment = (review.sentiment as 'positive' | 'negative' | 'neutral') || 'neutral';
  const sentCfg = sentimentConfig[sentiment];
  const SentIcon = sentCfg.icon;
  const emotions = review.emotions || [];
  const aspects = (review.aspects as Array<{ name: string; sentiment: string }>) || [];
  const isFake = review.is_fake || false;
  const fakeScore = review.fake_score || 0;
  const isAnalyzing = !review.sentiment;

  return (
    <div className={`stat-card space-y-3 ${isFake ? 'border-warning/50 bg-warning/5' : ''}`}>
      {isFake && (
        <div className="flex items-center gap-2 text-warning text-xs font-medium">
          <AlertTriangle className="h-3.5 w-3.5" /> Flagged as potentially fake (confidence: {Math.round(fakeScore * 100)}%)
        </div>
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
            {review.customer_name[0]}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{review.customer_name}</p>
            <p className="text-xs text-muted-foreground">{new Date(review.date).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`h-3.5 w-3.5 ${i < review.rating ? 'fill-warning text-warning' : 'text-border'}`} />
          ))}
        </div>
      </div>
      <p className="text-sm text-foreground leading-relaxed">{review.text}</p>
      
      {isAnalyzing ? (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="h-3.5 w-3.5 animate-spin" /> AI analysis in progress...
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-1.5 pt-1">
            <Badge variant="outline" className={sentCfg.className}>
              <SentIcon className="h-3 w-3 mr-1" /> {sentiment}
            </Badge>
            {emotions.map(e => (
              <Badge key={e} variant="secondary" className="text-xs">{e}</Badge>
            ))}
          </div>
          {aspects.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <Brain className="h-3.5 w-3.5 text-muted-foreground" />
              {aspects.map(a => (
                <span key={a.name} className={`text-xs px-2 py-0.5 rounded-full ${
                  a.sentiment === 'positive' ? 'bg-success/10 text-success' :
                  a.sentiment === 'negative' ? 'bg-destructive/10 text-destructive' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {a.name}
                </span>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ReviewCard;
