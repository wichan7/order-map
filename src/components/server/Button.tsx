interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "error";
}

export const Button = ({ variant = "primary", className, ...props }: Props) => {
  return (
    <button
      className={`inline-block border border-solid rounded-md px-4 py-2 text-white ${
        variant === "primary" ? "bg-sky-600" : "bg-red-600"
      } ${className}`}
      {...props}
    />
  );
};
