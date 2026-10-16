import api from "../../../lib/api";

export const register = async ({ email, username, password }) =>
  (await api.post("/api/auth/register", { email, username, password })).data;

export const login = async ({ email, username, password }) =>
  (await api.post("/api/auth/login", { email, username, password })).data;

export const getMe = async () => (await api.get("/api/auth/get-me")).data;

export const logout = async () => (await api.get("/api/auth/logout")).data;
