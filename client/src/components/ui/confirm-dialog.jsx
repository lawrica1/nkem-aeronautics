"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Styled replacement for window.confirm.
// confirm: { title, description, confirmLabel, destructive?, onConfirm } | null
export function ConfirmDialog({ confirm, onClose }) {
  return (
    <Dialog open={!!confirm} onOpenChange={(open) => !open && onClose()}>
      {confirm && (
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>{confirm.title}</DialogTitle>
            <DialogDescription>{confirm.description}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
            <Button
              variant={confirm.destructive ? "destructive" : "default"}
              onClick={() => {
                confirm.onConfirm();
                onClose();
              }}
            >
              {confirm.confirmLabel}
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
}
