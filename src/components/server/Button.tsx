import clsx from "clsx";
import type { ButtonVariant } from "@/types/variant";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export const Button = ({
  variant = "primary",
  className,
  disabled,
  ...props
}: Props) => {
  return (
    <button
      className={clsx(
        "inline-block border border-solid rounded-md px-4 py-2",
        disabled && "bg-gray-400 text-white cursor-not-allowed",
        !disabled && variant === "primary" && "bg-sky-600 text-white",
        !disabled && variant === "error" && "bg-red-600 text-white",
        !disabled &&
          variant === "ghost" &&
          "bg-white text-gray-700 border-gray-300",
        className,
      )}
      disabled={disabled}
      {...props}
    />
  );
};
