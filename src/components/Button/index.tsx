interface ButtonProps {
  label: string;
  onClick: () => void;
  className?: string;
}

export default function Button({ label, onClick, className }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full h-10 mt-4 rounded-lg bg-sky-600 text-white font-semibold hover:bg-sky-500 transition-colors duration-200 cursor-pointer shadow-md ${className || ""}`}
    >
      {label}
    </button>
  );
}
