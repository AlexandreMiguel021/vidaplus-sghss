export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      <span className="text-xl mt-0.5 font-bold text-jungle-teal-700">
        Vida
      </span>
      <span className="text-2xl font-bold text-teal-700">Plus</span>
    </div>
  );
}

export function LogoSmall({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      <span className="text-lg font-bold text-jungle-teal-700">Vida</span>
      <span className="text-xl font-bold text-muted-teal-600">Plus</span>
    </div>
  );
}
