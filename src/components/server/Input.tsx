interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id?: string;
}

export const Input = ({ label, id, ...props }: Props) => {
  const finalId = id ?? `input-${Math.random().toString(36).slice(2, 8)}`;

  return (
    <div className="flex flex-col gap-1 text-left">
      {label && <label htmlFor={finalId}>{label}</label>}
      <input
        id={finalId}
        className="inline-block border-1 border-solid rounded-md p-2"
        {...props}
      />
    </div>
  );
};
