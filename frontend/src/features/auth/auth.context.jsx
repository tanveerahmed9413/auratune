import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import * as authApi from "./services/auth.api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // `initializing` only covers the first session check; form submits use `submitting`
  const [initializing, setInitializing] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Session check runs exactly once for the whole app
  useEffect(() => {
    let active = true;
    authApi
      .getMe()
      .then((data) => active && setUser(data.user))
      .catch(() => active && setUser(null))
      .finally(() => active && setInitializing(false));
    return () => {
      active = false;
    };
  }, []);

  const run = useCallback(async (fn) => {
    setSubmitting(true);
    try {
      return await fn();
    } finally {
      setSubmitting(false);
    }
  }, []);

  const handleLogin = useCallback(
    (creds) => run(async () => {
      const data = await authApi.login(creds);
      setUser(data.user);
      return data;
    }),
    [run],
  );

  const handleRegister = useCallback(
    (creds) => run(async () => {
      const data = await authApi.register(creds);
      setUser(data.user);
      return data;
    }),
    [run],
  );

  const handleLogout = useCallback(
    () => run(async () => {
      try {
        await authApi.logout();
      } finally {
        setUser(null);
      }
    }),
    [run],
  );

  const value = useMemo(
    () => ({ user, loading: initializing, submitting, handleLogin, handleRegister, handleLogout }),
    [user, initializing, submitting, handleLogin, handleRegister, handleLogout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
