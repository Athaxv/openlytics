"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type StopSessionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  elapsedSeconds: number;
  onConfirm: () => void;
};

function formatDuration(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function StopSessionDialog({
  open,
  onOpenChange,
  elapsedSeconds,
  onConfirm,
}: StopSessionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>End session?</DialogTitle>
          <DialogDescription>
            Your session will be saved to today&apos;s log.
          </DialogDescription>
        </DialogHeader>

        <p className="py-4 text-center font-mono text-4xl font-semibold tabular-nums tracking-tight">
          {formatDuration(elapsedSeconds)}
        </p>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={onConfirm}>
            Stop
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
