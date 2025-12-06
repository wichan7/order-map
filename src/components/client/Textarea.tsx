"use client";

import clsx from "clsx";
import TextareaAutosize, {
  type TextareaAutosizeProps,
} from "react-textarea-autosize";

interface Props extends Omit<TextareaAutosizeProps, "style"> {
  label?: string;
  error?: string;
}

export const Textarea = ({ label, className, error, ...props }: Props) => {
  return (
    <div
      className={clsx(
        "flex flex-col gap-1 text-left",
        props.hidden && "hidden",
      )}
    >
      {label && <span>{label}</span>}
      <TextareaAutosize
        className={clsx(
          "inline-block border-1 border-solid rounded-md p-2 resize-none",
          props.disabled && "bg-gray-100",
          error && "border-red-500",
          className,
        )}
        {...props}
      />
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
};
