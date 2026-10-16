import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getErrorMessage } from "../../../lib/api";
import { AuthShell, Field, FormError, SubmitButton, AuthLink } from "../components/Form";

const Login = () => {
  const { user, submitting, handleLogin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (user) return <Navigate to="/" replace />;

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await handleLogin({ email: email.trim(), password });
      navigate("/", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, "Login failed. Please try again."));
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to get music that matches your mood."
      footer={<>New to AuraTune? <AuthLink to="/register">Create an account</AuthLink></>}
    >
      <form onSubmit={onSubmit} className="space-y-5">
        <FormError message={error} />
        <Field label="Email" id="email" type="email" autoComplete="email" placeholder="you@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <Field label="Password" id="password" type="password" autoComplete="current-password" placeholder="Enter your password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        <SubmitButton loading={submitting} loadingText="Logging in...">Log in</SubmitButton>
      </form>
    </AuthShell>
  );
};

export default Login;
