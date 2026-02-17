import { useState, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Trash2, Pencil } from 'lucide-react';
import { CleaningQuote, QuoteStatus, CleaningFormType } from '@/lib/types';
import { formatCurrency } from '@/lib/pricing';
import { Button } from '@/components/ui/button';

interface SwipeableSubmissionCardProps {
  quote: CleaningQuote;
  onClick: () => void;
  onEdit: (quote: CleaningQuote) => void;
  onDelete: (id: string) => void;
  statusColors: Record<QuoteStatus, string>;
  typeLabels: Record<CleaningFormType, string>;
}

export function SwipeableSubmissionCard({
  quote,
  onClick,
  onEdit,
  onDelete,
  statusColors,
  typeLabels,
}: SwipeableSubmissionCardProps) {
  const [translateX, setTranslateX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const currentXRef = useRef(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const DELETE_THRESHOLD = -80;
  const MAX_SWIPE = -100;

  const handleTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
    currentXRef.current = translateX;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    const currentX = e.touches[0].clientX;
    const diff = currentX - startXRef.current;
    let newTranslate = currentXRef.current + diff;

    // Only allow swiping left (negative values)
    newTranslate = Math.min(0, Math.max(MAX_SWIPE, newTranslate));

    setTranslateX(newTranslate);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);

    // Snap to open or closed position
    if (translateX < DELETE_THRESHOLD / 2) {
      setTranslateX(DELETE_THRESHOLD);
    } else {
      setTranslateX(0);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(quote.id);
    setTranslateX(0);
  };

  const handleCardClick = () => {
    if (translateX < -10) {
      // If swiped, reset instead of opening
      setTranslateX(0);
    } else {
      onClick();
    }
  };

  return (
    <div className="relative overflow-hidden rounded-lg">
      {/* Delete button background */}
      <div
        className="absolute inset-y-0 right-0 flex items-center justify-end bg-destructive"
        style={{ width: Math.abs(DELETE_THRESHOLD) }}
      >
        <button
          onClick={handleDelete}
          className="flex h-full w-full items-center justify-center text-destructive-foreground"
          aria-label="Deletar submission"
        >
          <Trash2 className="h-6 w-6" />
        </button>
      </div>

      {/* Swipeable card */}
      <div
        ref={cardRef}
        className="relative bg-background p-4 border rounded-lg cursor-pointer transition-transform"
        style={{
          transform: `translateX(${translateX}px)`,
          transition: isDragging ? 'none' : 'transform 0.2s ease-out',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleCardClick}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="min-w-0">
            <p className="font-medium truncate">{quote.client_name}</p>
            <p className="text-xs text-muted-foreground truncate">{quote.client_email}</p>
          </div>
          <Badge className={`${statusColors[quote.status]} flex-shrink-0 hover:bg-inherit cursor-default pointer-events-none`}>
            {quote.status}
          </Badge>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="outline" className="text-xs">
            {typeLabels[quote.form_type]}
          </Badge>
          <span>•</span>
          <span>{quote.form_type === 'house' ? quote.preferred_date : '—'}</span>
          <span>•</span>
          <span>{quote.form_type === 'house' ? quote.preferred_time : '—'}</span>
          <span>•</span>
          <span className="font-medium text-foreground">
            {quote.total > 0 ? formatCurrency(quote.total) : 'Quote'}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 h-9 text-muted-foreground hover:text-foreground"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(quote);
            }}
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <div className="w-px h-4 bg-border" />
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 h-9 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(quote.id);
            }}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
