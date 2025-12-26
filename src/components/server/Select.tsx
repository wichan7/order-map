import clsx from "clsx";

interface Option {
  value: string | number;
  label: string;
}

interface Props extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: Option[];
}

export const Select = ({
  label,
  className,
  error,
  options = [],
  ...props
}: Props) => {
  return (
    <div
      className={clsx(
        "flex flex-col gap-1 text-left",
        props.hidden && "hidden",
      )}
    >
      {label && <span>{label}</span>}
      <select
        className={clsx(
          "inline-block border-1 border-solid rounded-md p-2",
          props.disabled && "bg-gray-100",
          error && "border-red-500",
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
};
