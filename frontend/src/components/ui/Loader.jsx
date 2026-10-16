export const Spinner = ({ className = "w-6 h-6" }) => (
  <div className={`${className} rounded-full border-2 border-violet-500 border-t-transparent animate-spin`} role="status" aria-label="Loading" />
);

export const FullScreenLoader = ({ label = "Loading..." }) => (
  <div className="min-h-dvh flex items-center justify-center bg-ink text-white">
    <div className="flex flex-col items-center gap-3">
      <Spinner className="w-8 h-8" />
      <p className="text-sm text-gray-400">{label}</p>
    </div>
  </div>
);
