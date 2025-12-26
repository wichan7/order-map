import type React from "react";

type ChipSize = "small" | "medium";

interface ChipProps {
  children: React.ReactNode;
  className?: string;
  size?: ChipSize;
}

export default function Chip({ children, className, size = "medium" }: ChipProps) {
  return (
    <div
      className={`truncate px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm ${className} ${
        size === "small" ? "text-xs" : "text-sm"
      }`}
    >
      {children}
    </div>
  );
}
