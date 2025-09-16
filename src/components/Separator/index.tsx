interface SeparatorProps {
  label: string;
}

export default function Separator({ label }: SeparatorProps) {
  if (label) {
    return (
      <div className="flex items-center my-6">
        <div className="flex-grow border-t border-sky-600"></div>
        <span className="flex-shrink mx-4 text-sm text-sky-400">{label}</span>
        <div className="flex-grow border-t border-sky-600"></div>
      </div>
    );
  }

  return <div className="w-[100%] border-t border-sky-600 my-6"></div>;
}
