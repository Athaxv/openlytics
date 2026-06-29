"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { SessionPlatform } from "@/types/sessions";

const platforms: SessionPlatform[] = [
  "leetcode",
  "codeforces",
  "atcoder",
  "gfg",
  "mixed",
];

type ManualLogDialogProps = {
  onLogged?: () => void;
};

export function ManualLogDialog({ onLogged }: ManualLogDialogProps) {
  const [open, setOpen] = useState(false);
  const [platform, setPlatform] = useState<SessionPlatform>("leetcode");
  const [durationMin, setDurationMin] = useState("45");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    onLogged?.();
    setTimeout(() => {
      setOpen(false);
      setSubmitted(false);
      setNotes("");
      setDurationMin("45");
      setPlatform("leetcode");
    }, 1200);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" />}>
        Log session manually
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log study session</DialogTitle>
          <DialogDescription>
            Record a session you completed outside the timer.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm text-muted-foreground">Platform</label>
            <Select value={platform} onValueChange={(v) => setPlatform(v as SessionPlatform)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {platforms.map((p) => (
                  <SelectItem key={p} value={p} className="capitalize">
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm text-muted-foreground">
              Duration (minutes)
            </label>
            <Input
              type="number"
              min={1}
              max={480}
              value={durationMin}
              onChange={(e) => setDurationMin(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm text-muted-foreground">Notes</label>
            <Textarea
              placeholder="What did you work on?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={submitted}>
              {submitted ? "Session logged!" : "Save session"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
