import React, { useState, useEffect, useRef } from 'react';
import { Calendar as CalendarIcon, ChevronDown, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface DateRangePickerProps {
  onApply: (range: { label: string; start: Date | null; end: Date | null }) => void;
  defaultLabel?: string;
  align?: "left" | "right";
}

export function DateRangePicker({ onApply, defaultLabel = "All time", align = "left" }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLabel, setCurrentLabel] = useState(defaultLabel);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Popover state
  const [activePreset, setActivePreset] = useState(defaultLabel);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [startInput, setStartInput] = useState("");
  const [endInput, setEndInput] = useState("");

  const today = new Date();
  const [leftMonth, setLeftMonth] = useState(new Date(today.getFullYear(), today.getMonth() - 1, 1));
  const [rightMonth, setRightMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDateString = (d: Date | null) => {
    if (!d) return "";
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const presets = [
    { label: "All time", getRange: () => ({ start: null, end: null }) },
    {
      label: "Yesterday", getRange: () => {
        const d = new Date(); d.setDate(d.getDate() - 1); return { start: d, end: d };
      }
    },
    {
      label: "Last 7 days", getRange: () => {
        const end = new Date(); const start = new Date(); start.setDate(start.getDate() - 7); return { start, end };
      }
    },
    {
      label: "This month", getRange: () => {
        const start = new Date(today.getFullYear(), today.getMonth(), 1); return { start, end: today };
      }
    },
    {
      label: "Last month", getRange: () => {
        const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const end = new Date(today.getFullYear(), today.getMonth(), 0);
        return { start, end };
      }
    },
    {
      label: "Last 90 days", getRange: () => {
        const end = new Date(); const start = new Date(); start.setDate(start.getDate() - 90); return { start, end };
      }
    },
    {
      label: "Last 180 days", getRange: () => {
        const end = new Date(); const start = new Date(); start.setDate(start.getDate() - 180); return { start, end };
      }
    },
    {
      label: "Custom Date", getRange: () => {
        return { start: startDate, end: endDate };
      }
    }
  ];

  const handlePresetClick = (preset: typeof presets[0]) => {
    setActivePreset(preset.label);
    const range = preset.getRange();
    setStartDate(range.start);
    setEndDate(range.end);
    setStartInput(formatDateString(range.start));
    setEndInput(formatDateString(range.end));

    if (range.end) {
      setRightMonth(new Date(range.end.getFullYear(), range.end.getMonth(), 1));
      setLeftMonth(new Date(range.end.getFullYear(), range.end.getMonth() - 1, 1));
    }
  };

  const handleDayClick = (d: Date) => {
    setActivePreset("Custom Date");
    if (!startDate || (startDate && endDate)) {
      setStartDate(d);
      setEndDate(null);
      setStartInput(formatDateString(d));
      setEndInput("");
    } else if (startDate && !endDate) {
      if (d < startDate) {
        setEndDate(startDate);
        setStartDate(d);
        setStartInput(formatDateString(d));
        setEndInput(formatDateString(startDate));
      } else {
        setEndDate(d);
        setEndInput(formatDateString(d));
      }
    }
  };

  const handleApply = () => {
    let finalStart = startDate;
    let finalEnd = endDate;
    
    if (activePreset === "Custom Date") {
      if (startInput) {
        const parsedStart = new Date(startInput + "T00:00:00");
        if (!isNaN(parsedStart.getTime())) finalStart = parsedStart;
      }
      if (endInput) {
        const parsedEnd = new Date(endInput + "T23:59:59");
        if (!isNaN(parsedEnd.getTime())) finalEnd = parsedEnd;
      }
      if (finalStart && finalEnd && finalStart > finalEnd) {
        const temp = finalStart;
        finalStart = finalEnd;
        finalEnd = temp;
      }
    }

    let finalLabel = activePreset;
    if (activePreset === "Custom Date" && finalStart && finalEnd) {
      finalLabel = `${formatDateString(finalStart)} - ${formatDateString(finalEnd)}`;
    }
    setCurrentLabel(finalLabel);
    setStartDate(finalStart);
    setEndDate(finalEnd);
    setIsOpen(false);
    onApply({ label: activePreset, start: finalStart, end: finalEnd });
  };

  const nextMonth = () => {
    setLeftMonth(new Date(leftMonth.getFullYear(), leftMonth.getMonth() + 1, 1));
    setRightMonth(new Date(rightMonth.getFullYear(), rightMonth.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setLeftMonth(new Date(leftMonth.getFullYear(), leftMonth.getMonth() - 1, 1));
    setRightMonth(new Date(rightMonth.getFullYear(), rightMonth.getMonth() - 1, 1));
  };

  const renderCalendar = (monthDate: Date) => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return (
      <div className="w-[240px]">
        <div className="flex justify-between items-center mb-4">
          <span className="text-[14px] font-bold text-gray-900">{monthNames[month]} {year}</span>
        </div>
        <div className="grid grid-cols-7 gap-y-2 text-center mb-2">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
            <div key={d} className="text-[12px] font-medium text-gray-400">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-y-1 text-center">
          {days.map((d, i) => {
            if (!d) return <div key={i} className="h-8"></div>;

            const isStart = startDate && d.getTime() === startDate.getTime();
            const isEnd = endDate && d.getTime() === endDate.getTime();
            const inRange = startDate && endDate && d > startDate && d < endDate;
            const isSelected = isStart || isEnd;

            return (
              <button
                key={i}
                onClick={() => handleDayClick(d)}
                className={`h-8 w-8 mx-auto rounded-full text-[13px] font-medium flex items-center justify-center transition-colors
                  ${isSelected ? 'bg-[#102B4E] text-white' : ''}
                  ${inRange ? 'bg-blue-50 text-blue-800 rounded-none w-full' : ''}
                  ${!isSelected && !inRange ? 'text-gray-700 hover:bg-gray-100' : ''}
                `}
              >
                {d.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-11 px-4 bg-white border border-slate-200 rounded-2xl text-[14px] text-slate-700 flex items-center justify-between gap-3 hover:bg-slate-50 transition-all font-medium cursor-pointer shadow-sm"
      >
        <div className="flex items-center gap-2.5">
          <CalendarIcon className="w-[18px] h-[18px] text-slate-600" />
          <span>{currentLabel === "All time" ? "All Time" : currentLabel}</span>
        </div>

        {activePreset === "Custom Date" ? (
          <div onClick={(e) => {
            e.stopPropagation();
            handlePresetClick(presets[0]); // Reset to "All time"
            setCurrentLabel("All time");
            onApply({ label: "All time", start: null, end: null });
          }} className="p-0.5 hover:bg-gray-100 rounded">
            <X className="w-4 h-4 text-gray-500" />
          </div>
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400" />
        )}
      </button>

      {isOpen && (
        <div className={`absolute top-full ${align === "right" ? "right-0" : "left-0"} mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 flex overflow-hidden min-w-[700px]`}>
          {/* Sidebar */}
          <div className="w-[160px] border-r border-gray-100 py-4">
            {presets.map(p => (
              <button
                key={p.label}
                onClick={() => handlePresetClick(p)}
                className={`w-full text-left px-5 py-2 text-[13px] font-medium transition-colors ${activePreset === p.label ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div className="p-6 flex flex-col w-full">
            <div className="flex gap-4 mb-6">
              <div className="flex flex-col gap-1 w-1/2">
                <label className="text-[12px] font-bold text-gray-700">Start date</label>
                <input
                  type="text"
                  value={startInput}
                  onChange={(e) => setStartInput(e.target.value)}
                  placeholder="YYYY-MM-DD"
                  className="h-9 border border-gray-200 rounded-md px-3 text-[13px] text-gray-900 outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="flex flex-col justify-end pb-2">
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex flex-col gap-1 w-1/2">
                <label className="text-[12px] font-bold text-gray-700">End date</label>
                <input
                  type="text"
                  value={endInput}
                  onChange={(e) => setEndInput(e.target.value)}
                  placeholder="YYYY-MM-DD"
                  className="h-9 border border-gray-200 rounded-md px-3 text-[13px] text-gray-900 outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div className="flex gap-8 relative">
              <button onClick={prevMonth} className="absolute -left-2 top-0 h-6 w-6 flex items-center justify-center hover:bg-gray-100 rounded-full z-10">
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>
              {renderCalendar(leftMonth)}

              <button onClick={nextMonth} className="absolute -right-2 top-0 h-6 w-6 flex items-center justify-center hover:bg-gray-100 rounded-full z-10">
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
              {renderCalendar(rightMonth)}
            </div>

            <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
              <button onClick={() => setIsOpen(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-[13px] font-bold text-gray-700 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={handleApply} className="px-5 py-2 bg-blue-600 rounded-lg text-[13px] font-bold text-white hover:bg-blue-700 transition-colors">
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
