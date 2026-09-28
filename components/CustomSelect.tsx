"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
  className?: string;
  icon?: React.ReactNode;
}

export function CustomSelect({ value, onChange, options, placeholder, className, icon }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className={cn("relative w-full text-gray-900", className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-green)] transition-all flex items-center justify-between text-left",
          icon ? "pl-12" : "pl-4"
        )}
      >
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 flex items-center justify-center">
            {icon}
          </div>
        )}
        <span className={!selectedOption ? "text-gray-400" : ""}>
          {selectedOption ? selectedOption.label : placeholder || "Select..."}
        </span>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-2xl max-h-60 overflow-y-auto overscroll-contain">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={cn(
                "w-full text-left px-4 py-3 text-sm hover:bg-gray-50 flex items-center justify-between transition-colors",
                value === opt.value ? "bg-green-50/50 text-[var(--color-brand-green)] font-bold" : "text-gray-700"
              )}
            >
              {opt.label}
              {value === opt.value && <Check className="w-4 h-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
