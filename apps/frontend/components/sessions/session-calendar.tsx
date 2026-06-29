"use client";

import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { StudySession } from "@/types/sessions";

type SessionCalendarProps = {
  sessions: StudySession[];
};

export function SessionCalendar({ sessions }: SessionCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const sessionDates = useMemo(
    () => sessions.map((s) => new Date(s.startedAt)),
    [sessions],
  );

  const days = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const gridStart = startOfWeek(monthStart);
    const gridEnd = endOfWeek(monthEnd);
    return eachDayOfInterval({ start: gridStart, end: gridEnd });
  }, [currentMonth]);

  const sessionCountForDay = (day: Date) =>
    sessionDates.filter((d) => isSameDay(d, day)).length;

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium">{format(currentMonth, "MMMM yyyy")}</h3>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setCurrentMonth((m) => addDays(startOfMonth(m), -1))}
            aria-label="Previous month"
          >
            <ChevronLeft size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setCurrentMonth((m) => addDays(endOfMonth(m), 1))}
            aria-label="Next month"
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="py-1 font-medium">
            {d}
          </div>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {days.map((day) => {
          const count = sessionCountForDay(day);
          const inMonth = isSameMonth(day, currentMonth);

          return (
            <div
              key={day.toISOString()}
              className={cn(
                "flex aspect-square flex-col items-center justify-center rounded-md text-xs",
                !inMonth && "text-muted-foreground/40",
                count > 0 && inMonth && "bg-primary/15 font-medium text-primary",
                count === 0 && inMonth && "hover:bg-muted/50",
              )}
            >
              <span>{format(day, "d")}</span>
              {count > 0 && inMonth && (
                <span className="mt-0.5 text-[10px] opacity-70">{count} sess</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
