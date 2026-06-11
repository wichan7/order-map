"use client";

import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

interface Option {
  value: string;
  label: string;
}

interface Props {
  label?: string;
  options?: Option[];
  placeholder?: string;
  error?: string;
  onChange?: (value: string) => void;
}

export const SearchableCombobox = ({
  label,
  options = [],
  placeholder = "검색...",
  error,
  onChange,
}: Props) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<Option | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered =
    query === ""
      ? options
      : options.filter((o) =>
          o.label.toLowerCase().includes(query.toLowerCase()),
        );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        if (selected) setQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selected]);

  const handleSelect = (option: Option) => {
    setSelected(option);
    setQuery(option.label);
    setIsOpen(false);
    onChange?.(option.value);
  };

  const handleClear = () => {
    setSelected(null);
    setQuery("");
    onChange?.("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsOpen(true);
    if (selected && e.target.value !== selected.label) {
      setSelected(null);
      onChange?.("");
    }
  };

  return (
    <div className="flex flex-col gap-1 text-left" ref={containerRef}>
      {label && <span>{label}</span>}
      <div className="relative">
        <div
          className={clsx(
            "flex items-center border-1 border-solid rounded-md p-2 bg-white",
            error && "border-red-500",
            isOpen && "ring-2 ring-blue-300",
          )}
        >
          <input
            className="flex-1 outline-none text-sm bg-transparent"
            placeholder={placeholder}
            value={query}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
          />
          {selected ? (
            <button
              type="button"
              className="ml-2 text-gray-400 hover:text-gray-600 text-xs"
              onClick={handleClear}
            >
              ✕
            </button>
          ) : (
            <span className="ml-2 text-gray-400 text-xs pointer-events-none">
              ▾
            </span>
          )}
        </div>

        {isOpen && (
          <ul className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm text-gray-400">
                검색 결과 없음
              </li>
            ) : (
              filtered.map((option) => (
                <li
                  key={option.value}
                  className={clsx(
                    "px-3 py-2 text-sm cursor-pointer hover:bg-blue-50",
                    selected?.value === option.value &&
                      "bg-blue-100 font-medium",
                  )}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelect(option);
                  }}
                >
                  {option.label}
                </li>
              ))
            )}
          </ul>
        )}
      </div>
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
};
