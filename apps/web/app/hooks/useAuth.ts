"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { AxiosError } from "axios";
import { api, apiError, session } from "../lib/api";
import type { User } from "../lib/types";

type AuthResponse = { user: User; token: string };

export function useAuth() {
  const queryClient = useQueryClient();

  const me = useQuery<User | null>({
    queryKey: ["me"],
    queryFn: async () => {
      try {
        return (await api.get<{ user: User }>("/auth/me")).data.user;
      } catch (e) {
        if (e instanceof AxiosError && e.response?.status === 401) {
          session.set(null);
          return null;
        }
        throw e;
      }
    },
    staleTime: 5 * 60_000,
  });

  const onAuthenticated = (data: AuthResponse) => {
    session.set(data.token);
    queryClient.setQueryData(["me"], data.user);
    queryClient.invalidateQueries({ predicate: (q) => q.queryKey[0] === "account" });
  };

  const login = useMutation({
    mutationFn: async (body: { email: string; password: string }) =>
      (await api.post<AuthResponse>("/auth/login", body)).data,
    onSuccess: onAuthenticated,
    onError: (e) => toast.error(apiError(e, "Login failed")),
  });

  const register = useMutation({
    mutationFn: async (body: { name: string; email: string; password: string }) =>
      (await api.post<AuthResponse>("/auth/register", body)).data,
    onSuccess: onAuthenticated,
    onError: (e) => toast.error(apiError(e, "Registration failed")),
  });

  const logout = useMutation({
    mutationFn: async () => (await api.post("/auth/logout")).data,
    onSettled: () => {
      session.set(null);
      queryClient.setQueryData(["me"], null);
      queryClient.removeQueries({ predicate: (q) => q.queryKey[0] === "account" });
    },
  });

  return {
    user: me.data ?? null,
    isLoading: me.isLoading,
    isAuthenticated: !!me.data,
    login,
    register,
    logout,
  };
}
