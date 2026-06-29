"use client";

import { useCallback, useMemo, useState } from "react";
import {
  addDays,
  format,
  isAfter,
  isSameDay,
  parseISO,
  startOfDay,
  subDays,
} from "date-fns";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type ProblemsDateNavigatorProps = {
  selectedDate: string;
  todayKey: string;
  countsByDate: Record<string, number>;
  onDateChange: (dateKey: string) => void;
};

function toDateKey(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

function parseDateKey(dateKey: string): Date {
  return startOfDay(parseISO(dateKey));
}

export function ProblemsDateNavigator({
  selectedDate,
  todayKey,
  countsByDate,
  onDateChange,
}: ProblemsDateNavigatorProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const today = useMemo(() => startOfDay(new Date()), []);
  const selected = parseDateKey(selectedDate);
  const isToday = selectedDate === todayKey;

  const stripDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, index) => subDays(today, 6 - index));
  }, [today]);

  const canGoNext = !isToday;

  const goPrev = useCallback(() => {
    onDateChange(toDateKey(subDays(selected, 1)));
  }, [onDateChange, selected]);

  const goNext = useCallback(() => {
    const next = addDays(selected, 1);
    if (!isAfter(next, today)) {
      onDateChange(toDateKey(next));
    }
  }, [onDateChange, selected, today]);

  const handlePickerChange = (value: string) => {
    if (!value) return;
    const picked = parseISO(value);
    if (isAfter(picked, today)) return;
    onDateChange(value);
    setPickerOpen(false);
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-11 shrink-0"
          onClick={goPrev}
          aria-label="Previous day"
        >
          <ChevronLeft />
        </Button>

        <div
          className="flex flex-1 gap-1.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="group"
          aria-label="Recent days"
        >
          {stripDays.map((day) => {
            const dateKey = toDateKey(day);
            const count = countsByDate[dateKey] ?? 0;
            const isSelected = dateKey === selectedDate;
            const isDayToday = isSameDay(day, today);

            return (
              <button
                key={dateKey}
                type="button"
                onClick={() => onDateChange(dateKey)}
                aria-pressed={isSelected}
                aria-label={`${isDayToday ? "Today" : format(day, "EEEE, MMM d")}, ${count} problems solved`}
                className={cn(
                  "motion-safe:transition-colors flex min-h-11 min-w-[4.5rem] shrink-0 flex-col items-center justify-center rounded-lg border px-2 py-1.5 text-xs focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                  isSelected
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <span className="font-medium">{isDayToday ? "Today" : format(day, "EEE")}</span>
                <span className="text-[0.65rem] text-muted-foreground">{format(day, "d")}</span>
                <span
                  className={cn(
                    "mt-0.5 rounded-full px-1.5 py-px text-[0.65rem] font-medium tabular-nums",
                    count > 0
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground",
                  )}
                  aria-hidden="true"
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-11 shrink-0"
          onClick={goNext}
          disabled={!canGoNext}
          aria-label="Next day"
        >
          <ChevronRight />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        {!isToday ? (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="min-h-11"
            onClick={() => onDateChange(todayKey)}
          >
            Jump to today
          </Button>
        ) : null}

        <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
          <PopoverTrigger
            className={cn(
              "inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-2.5 text-sm font-medium whitespace-nowrap transition-all outline-none select-none hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
            )}
          >
            <CalendarDays className="size-4" />
            Pick date
          </PopoverTrigger>
          <PopoverContent align="end" className="w-auto">
            <PopoverHeader>
              <PopoverTitle>Browse history</PopoverTitle>
              <PopoverDescription>Choose any day up to today.</PopoverDescription>
            </PopoverHeader>
            <input
              type="date"
              value={selectedDate}
              max={todayKey}
              onChange={(event) => handlePickerChange(event.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              aria-label="Select date"
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
