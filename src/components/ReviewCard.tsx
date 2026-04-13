import { Star, AlertTriangle, ThumbsUp, ThumbsDown, Minus, Brain } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Review } from '@/data/mockData';

const sentimentConfig = {
  positive: { icon: ThumbsUp, className: 'bg-success/10 text-success border-success/20' },
  negative: { icon: ThumbsDown, className: 'bg-destructive/10 text-destructive border-destructive/20' },
  neutral: { icon: Minus, className: 'bg-muted text-muted-foreground border-border' },
};

const ReviewCard = ({ review }: { review: Review }) => {
  const sentCfg = sentimentConfig[review.sentiment];
  const SentIcon = sentCfg.icon;

  return (
    <div className={`stat-card space-y-3 ${review.isFake ? 'border-warning/50 bg-warning/5' : ''}`}>
      {review.isFake && (
        <div className="flex items-center gap-2 text-warning text-xs font-medium">
          <AlertTriangle className="h-3.5 w-3.5" /> Flagged as potentially fake (confidence: {Math.round(review.fakeScore * 100)}%)
        </div>
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
            {review.customerName[0]}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{review.customerName}</p>
            <p className="text-xs text-muted-foreground">{review.date}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`h-3.5 w-3.5 ${i < review.rating ? 'fill-warning text-warning' : 'text-border'}`} />
          ))}
        </div>
      </div>
      <p className="text-sm text-foreground leading-relaxed">{review.text}</p>
      <div className="flex flex-wrap gap-1.5 pt-1">
        <Badge variant="outline" className={sentCfg.className}>
          <SentIcon className="h-3 w-3 mr-1" /> {review.sentiment}
        </Badge>
        {review.emotions.map(e => (
          <Badge key={e} variant="secondary" className="text-xs">{e}</Badge>
        ))}
      </div>
      {review.aspects.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          <Brain className="h-3.5 w-3.5 text-muted-foreground" />
          {review.aspects.map(a => (
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
    </div>
  );
};

export default ReviewCard;
