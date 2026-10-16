import { Link } from "react-router-dom";
import Logo from "../../../components/ui/Logo";

// Shared shell for Login / Register
export const AuthShell = ({ title, subtitle, children, footer }) => (
  <div className="relative min-h-dvh bg-ink flex items-center justify-center px-4 py-10 overflow-hidden">
    <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-violet-600/15 blur-[140px]" />
    <div className="relative w-full max-w-md animate-fade-up">
      <div className="flex justify-center mb-8">
        <Logo size="lg" />
      </div>
      <div className="rounded-2xl border border-white/[0.08] bg-panel/90 backdrop-blur p-7 sm:p-8 shadow-[0_0_60px_rgba(124,58,237,0.12)]">
        <h1 className="text-2xl font-semibold text-white">{title}</h1>
        <p className="mt-1.5 text-sm text-gray-400">{subtitle}</p>
        <div className="mt-6">{children}</div>
      </div>
      <p className="mt-6 text-center text-sm text-gray-400">{footer}</p>
    </div>
  </div>
);

export const Field = ({ label, id, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-200 mb-2">{label}</label>
    <input
      id={id}
      name={id}
      {...props}
      className="w-full h-12 rounded-xl border border-white/[0.1] bg-ink px-4 text-sm text-white placeholder:text-gray-500 outline-none transition focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20"
    />
  </div>
);

export const FormError = ({ message }) =>
  message ? (
    <div role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
      {message}
    </div>
  ) : null;

export const SubmitButton = ({ loading, children, loadingText }) => (
  <button
    type="submit"
    disabled={loading}
    className="w-full h-12 cursor-pointer rounded-xl bg-violet-600 hover:bg-violet-500 text-sm font-semibold text-white shadow-[0_0_25px_rgba(124,58,237,0.3)] transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
  >
    {loading ? loadingText : children}
  </button>
);

export const AuthLink = ({ to, children }) => (
  <Link to={to} className="font-medium text-violet-400 hover:text-violet-300 transition">{children}</Link>
);
