import type React from "react";

interface ChipProps {
  children: React.ReactNode;
  className?: string;
}

export default function Chip({ children, className }: ChipProps) {
  return (
    <div
      className={`truncate px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm ${className}`}
    >
      {children}
    </div>
  );
}
