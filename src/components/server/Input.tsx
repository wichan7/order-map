import clsx from "clsx";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = ({ label, className, error, ...props }: Props) => {
  return (
    <div
      className={clsx(
        "flex-col gap-1 text-left",
        props.hidden ? "hidden" : "inline-flex",
        className,
      )}
    >
      {label && <span>{label}</span>}
      <input
        className={clsx(
          "inline-block border-1 border-solid rounded-md p-2",
          props.disabled && "bg-gray-100",
          error && "border-red-500",
        )}
        {...props}
      />
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
};
