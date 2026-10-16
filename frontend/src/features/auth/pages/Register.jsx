import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getErrorMessage } from "../../../lib/api";
import { AuthShell, Field, FormError, SubmitButton, AuthLink } from "../components/Form";

const Register = () => {
  const { user, submitting, handleRegister } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (user) return <Navigate to="/" replace />;

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    try {
      await handleRegister({ username: username.trim(), email: email.trim(), password });
      navigate("/", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, "Could not create the account. Please try again."));
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Sign up and let your face pick the playlist."
      footer={<>Already have an account? <AuthLink to="/login">Log in</AuthLink></>}
    >
      <form onSubmit={onSubmit} className="space-y-5">
        <FormError message={error} />
        <Field label="Username" id="username" type="text" autoComplete="username" placeholder="yourname" required minLength={3} value={username} onChange={(e) => setUsername(e.target.value)} />
        <Field label="Email" id="email" type="email" autoComplete="email" placeholder="you@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <Field label="Password" id="password" type="password" autoComplete="new-password" placeholder="At least 6 characters" required value={password} onChange={(e) => setPassword(e.target.value)} />
        <SubmitButton loading={submitting} loadingText="Creating account...">Create account</SubmitButton>
      </form>
    </AuthShell>
  );
};

export default Register;
