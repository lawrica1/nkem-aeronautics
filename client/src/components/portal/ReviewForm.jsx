"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { useSubmitReview } from "@/hooks/useOperations";
import { Button } from "@/components/ui/button";

export function ReviewForm({ operationId }) {
  const submitReview = useSubmitReview();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  if (submitReview.isSuccess) {
    return <p className="text-xs text-brand-green">Thanks for reviewing your pilot!</p>;
  }

  return (
    <div className="space-y-2 border-t border-border pt-3">
      <p className="text-xs font-medium text-brand-navy-dark">Rate this operation</p>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" onClick={() => setRating(n)} aria-label={`${n} stars`}>
            <Star className={`size-5 ${n <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} />
          </button>
        ))}
      </div>
      <textarea
        rows={2}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Optional comment about the pilot…"
        className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
      />
      {submitReview.isError && <p className="text-xs text-destructive">{submitReview.error.message}</p>}
      <Button
        size="sm"
        disabled={rating === 0 || submitReview.isPending}
        onClick={() => submitReview.mutate({ operationId, rating, comment })}
        className="bg-brand-navy text-white hover:bg-brand-navy/90"
      >
        {submitReview.isPending ? "Submitting…" : "Submit review"}
      </Button>
    </div>
  );
}
