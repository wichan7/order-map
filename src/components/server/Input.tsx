import clsx from "clsx";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = ({ label, className, ...props }: Props) => {
  return (
    <div
      className={clsx(
        "flex flex-col gap-1 text-left",
        props.hidden && "hidden",
      )}
    >
      {label && <span>{label}</span>}
      <input
        className={clsx(
          "inline-block border-1 border-solid rounded-md p-2",
          props.disabled && "bg-gray-100",
        )}
        {...props}
      />
    </div>
  );
};
