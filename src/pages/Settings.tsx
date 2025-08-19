import React, { useEffect, useMemo, useRef, useState } from "react";
import { CalendarIcon, SaveIcon } from "lucide-react";

interface MonthSettings {
  dailyGoal: number;
  extraTaskHours: number;
  daysOff: number[];
}

interface SettingsProps {
  settings: MonthSettings;
  onUpdateSettings: (settings: MonthSettings) => void;
  currentMonth: Date;
}

type Segment = { left: number; width: number; top: number; height: number };

export function Settings({
  settings,
  onUpdateSettings,
  currentMonth,
}: SettingsProps) {
  const [dailyGoal, setDailyGoal] = useState<number>(settings.dailyGoal);
  const [extraTaskHours, setExtraTaskHours] = useState<number>(
    settings.extraTaskHours,
  );
  const [daysOff, setDaysOff] = useState<number[]>(settings.daysOff);

  // Workweek state - 0=Sun ... 6=Sat, always 5 days
  const [workStart, setWorkStart] = useState(1); // default Mon
  const workLength = 5; // fixed 5 days

  // ---- helpers ----
  const isWorkingDay = (dow: number) => (dow - workStart + 7) % 7 < workLength;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      dailyGoal: Number(dailyGoal),
      extraTaskHours: Number(extraTaskHours),
      daysOff,
    });
  };

  const handleDayToggle = (day: number) => {
    setDaysOff((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  // Generate calendar
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const daysInMonth = useMemo(
    () => new Date(year, month + 1, 0).getDate(),
    [year, month],
  );
  const firstDay = useMemo(
    () => new Date(year, month, 1).getDay(),
    [year, month],
  );

  const calendarDays: (number | null)[] = useMemo(() => {
    const arr: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) arr.push(null);
    for (let d = 1; d <= daysInMonth; d++) arr.push(d);
    return arr;
  }, [firstDay, daysInMonth]);

  const formatMonth = (date: Date) =>
    date.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  // ---------- PERFECT OVERLAY ALIGNMENT (measured in px) ----------
  const gridRef = useRef<HTMLDivElement | null>(null);
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [segments, setSegments] = useState<Segment[]>([]);

  // Build selected index ranges (handles wrap)
  const selectedRanges = useMemo(() => {
    const end = (workStart + workLength - 1) % 7;
    if (workStart + workLength <= 7) {
      // one continuous range
      return [[workStart, workStart + workLength - 1]] as [number, number][];
    }
    // wrap: two ranges
    return [
      [workStart, 6],
      [0, end],
    ] as [number, number][];
  }, [workStart, workLength]);

  // Measure and set overlay segments
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const compute = () => {
      const gridBox = grid.getBoundingClientRect();
      const firstBtn = btnRefs.current.find(Boolean);
      if (!firstBtn) return;

      const top = firstBtn.getBoundingClientRect().top - gridBox.top;
      const height = firstBtn.getBoundingClientRect().height;

      const segs: Segment[] = selectedRanges.map(([startIdx, endIdx]) => {
        const startEl = btnRefs.current[startIdx]!;
        const endEl = btnRefs.current[endIdx]!;
        const startBox = startEl.getBoundingClientRect();
        const endBox = endEl.getBoundingClientRect();
        const left = startBox.left - gridBox.left;
        const width = endBox.right - startBox.left; // includes borders/gaps
        return { left, width, top, height };
      });

      setSegments(segs);
    };

    // initial + on resize
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(grid);
    window.addEventListener("resize", compute);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", compute);
    };
  }, [selectedRanges]);

  return (
    <div className="min-h-screen w-full bg-[#f8f9fc] text-gray-800">
      <main className="px-6 py-8 pt-32">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
              Settings
            </h1>
            <p className="text-gray-500">
              Configure your monthly ticket goals and days off for{" "}
              {formatMonth(currentMonth)}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Ticket Goals */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Ticket Goals
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="daily-goal"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Daily Goal
                  </label>
                  <div className="relative">
                    <input
                      id="daily-goal"
                      type="number"
                      min="1"
                      value={dailyGoal}
                      onChange={(e) => setDailyGoal(Number(e.target.value))}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent text-lg font-bold text-gray-700"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                      tickets/day
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    The number of tickets you aim to complete each working day.
                  </p>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="extra-hours"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Extra Task Hours
                  </label>
                  <div className="relative">
                    <input
                      id="extra-hours"
                      type="number"
                      min="0"
                      step="0.5"
                      value={extraTaskHours}
                      onChange={(e) =>
                        setExtraTaskHours(Number(e.target.value))
                      }
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent text-lg font-bold text-gray-700"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                      hours
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Additional hours spent on tasks other than tickets.
                  </p>
                </div>
              </div>
            </div>

            {/* Workweek & Days Off */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
                <CalendarIcon size={18} className="mr-2 text-gray-600" />
                Workweek & Days Off
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Choose your workweek and select additional days you won't work.
                Non-working days are disabled.
              </p>

              {/* Workweek Slider */}
              <div className="mb-6">
                <div className="relative">
                  {/* Overlay segments (measured) */}
                  <div className="absolute inset-x-0 top-0 pointer-events-none z-0">
                    {segments.map((seg, i) => (
                      <div
                        key={i}
                        className="absolute bg-lime-400/10 border-2 border-lime-400/30 rounded-lg transition-all duration-300"
                        style={{
                          left: `${seg.left}px`,
                          width: `${seg.width}px`,
                          top: `${seg.top}px`,
                          height: `${seg.height}px`,
                        }}
                      />
                    ))}
                  </div>

                  {/* Pills */}
                  <div
                    ref={gridRef}
                    className="grid grid-cols-7 gap-2 relative z-10"
                  >
                    {dayNames.map((day, index) => {
                      const isSelected = isWorkingDay(index);
                      const isSliderStart = index === workStart;

                      return (
                        <div key={index} className="relative">
                          <button
                            ref={(el) => (btnRefs.current[index] = el)}
                            type="button"
                            onClick={() => setWorkStart(index)}
                            className={`
                w-[5.5rem] h-12 rounded-lg flex items-center justify-center text-sm font-medium
                transition-all duration-200 relative overflow-hidden
                ${
                  isSelected
                    ? "bg-lime-50 border-2 border-lime-300 text-gray-900 shadow-sm"
                    : "bg-white/35 backdrop-blur-md border border-gray-200/50 text-gray-600 hover:bg-white/50"
                }
                ${isSliderStart ? "ring-2 ring-lime-400 ring-offset-2" : ""}
              `}
                          >
                            {day}

                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <p className="text-xs text-gray-500 mt-2 text-center">
                  Click any day to start your 5-day workweek from that day
                </p>
              </div>

              {/* Calendar */}
              <div className="bg-gray-50 rounded-xl p-5">
                <div className="grid grid-cols-7 gap-2 mb-3">
                  {dayNames.map((day, index) => (
                    <div
                      key={index}
                      className="text-center text-xs font-medium text-gray-500"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {calendarDays.map((day, index) => {
                    if (day === null)
                      return <div key={`empty-${index}`} className="h-10" />;

                    const date = new Date(year, month, day);
                    const dayOfWeek = date.getDay();
                    const isWorkingDayOfWeek = isWorkingDay(dayOfWeek);
                    const isDayOff = daysOff.includes(day);

                    return (
                      <button
                        key={`day-${day}`}
                        type="button"
                        disabled={!isWorkingDayOfWeek}
                        onClick={() =>
                          isWorkingDayOfWeek && handleDayToggle(day)
                        }
                        className={`
                          h-10 rounded-lg flex items-center justify-center text-sm
                          ${
                            !isWorkingDayOfWeek
                              ? "bg-gray-100 text-gray-400"
                              : isDayOff
                                ? "bg-red-100 text-red-700 font-medium border-2 border-red-500"
                                : "bg-white hover:bg-gray-100 text-gray-700 border border-gray-200"
                          }
                        `}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center px-6 py-3 bg-lime-500 hover:bg-lime-600 text-gray-900 rounded-lg transition font-medium"
              >
                <SaveIcon size={18} className="mr-2" />
                Save Settings
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
