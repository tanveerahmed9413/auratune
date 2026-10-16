// AuraTune logo: animated equalizer bars + wordmark
const heights = ["h-3", "h-5", "h-7", "h-4", "h-2.5"];

const Logo = ({ size = "md", showText = true }) => (
  <div className="flex items-center gap-3 select-none">
    <div className={`flex items-center gap-[3px] ${size === "lg" ? "h-10" : "h-8"}`} aria-hidden="true">
      {heights.map((h, i) => (
        <span
          key={i}
          className={`eq-bar w-[4px] rounded-full bg-gradient-to-t from-violet-600 to-fuchsia-400 ${h}`}
          style={{ animationDelay: `${i * 0.15}s`, animationDuration: `${1.1 + i * 0.1}s` }}
        />
      ))}
    </div>
    {showText && (
      <span className={`${size === "lg" ? "text-3xl" : "text-[22px]"} font-bold tracking-tight text-white`}>
        Aura<span className="text-violet-400">Tune</span>
      </span>
    )}
  </div>
);

export default Logo;
